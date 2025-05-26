package com.example.dog_crud_spring_boot.service;

import com.example.dog_crud_spring_boot.dto.PostRequestDto;
import com.example.dog_crud_spring_boot.exception.ValidationException;
import com.example.dog_crud_spring_boot.model.Age;
import com.example.dog_crud_spring_boot.model.Post;
import com.example.dog_crud_spring_boot.repository.AgeRepository;
import com.example.dog_crud_spring_boot.repository.PostRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * 投稿に関するビジネスロジックを提供するサービスクラス。
 * すべての投稿の取得、特定のidの投稿の取得、投稿の作成、更新、削除処理を担当する。
 */
@Service
public class PostService {

    private final PostRepository postRepository;
    private final AgeRepository ageRepository;
    private final PasswordEncoder passwordEncoder;
    private static final String TARGET_DATA_NOT_FOUND = "指定された投稿が存在しません";
    private static final String WRONG_PASSWORD = "パスワードが間違っています";
    private static final String WRONG_AGE_DATA = "送信された年齢のデータが不正です";

    /**
     * コンストラクタ
     * 
     * @param postRepository 投稿データへのアクセスを提供するリポジトリ
     * @param ageRepository 年齢データへのアクセスを提供するリポジトリ
     * @param passwordEncoder パスワードのハッシュ化・照合を行うエンコーダー
     */
    public PostService(PostRepository postRepository, AgeRepository ageRepository, PasswordEncoder passwordEncoder) {
        this.postRepository = postRepository;
        this.ageRepository = ageRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * すべての投稿を取得する
     * 
     * @return すべての投稿
     */
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    /**
     * 特定のidの投稿を取得する
     * 
     * @param id 投稿のID
     * @return 該当する投稿（存在しない場合は空のOptional）
     */
    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }

    /**
     * 新しい投稿を作成する
     *
     * @param request クライアントから送信された投稿データ（バリデーション済み）
     * @return 保存された投稿オブジェクト
     * @throws ValidationException 年齢IDが存在しない場合にスローされる
     */
    public Post createPost(PostRequestDto request) {
        // 入力された年齢IDに対応するAgeデータを取得（存在しなければ例外）
        Age age = ageRepository.findById(request.getAgeId())
            .orElseThrow(() -> new ValidationException(WRONG_AGE_DATA));

        // 投稿データの作成と各フィールドの設定
        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setImageUrl(request.getImageUrl());
        post.setAge(age);

        // パスワードはハッシュ化して保存する
        post.setPassword(passwordEncoder.encode(request.getPassword()));

        // 投稿データを保存して返却する
        return postRepository.save(post);
    }

    /**
     * 指定されたIDの投稿を更新する
     *
     * @param id 更新対象の投稿ID
     * @param request 更新後の投稿データ（バリデーション済み）
     * @return 更新された投稿オブジェクト
     * @throws ValidationException 投稿が存在しない、パスワードが一致しない、または年齢IDが不正な場合にスローされる
     */
    public Post updatePost(Long id, PostRequestDto request) {
        // 指定された投稿IDの投稿データを取得（存在しなければ例外）
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new ValidationException(TARGET_DATA_NOT_FOUND));

        // パスワードが一致しない場合は例外を投げる
        if (!passwordEncoder.matches(request.getPassword(), post.getPassword())) {
            throw new ValidationException(WRONG_PASSWORD);
        }

        // 入力された年齢IDに対応するAgeデータを取得（存在しなければ例外）
        Age age = ageRepository.findById(request.getAgeId())
            .orElseThrow(() -> new ValidationException(WRONG_AGE_DATA));

        // 投稿内容の更新
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setImageUrl(request.getImageUrl());
        post.setAge(age);

        // 更新内容を保存して返却
        return postRepository.save(post);
    }

    /**
     * 指定されたIDの投稿を削除する。
     *
     * @param id 削除対象の投稿ID
     * @param request 削除に必要な情報（パスワードを含む）
     * @throws ValidationException 投稿が存在しない、またはパスワードが一致しない場合にスローされる
     */
    public void deletePost(Long id, PostRequestDto request) {
        // 指定された投稿IDの投稿データを取得（存在しなければ例外）
        Post post = postRepository.findById(id)
            .orElseThrow(() -> new ValidationException(TARGET_DATA_NOT_FOUND));

        // パスワードが一致しない場合は例外を投げる
        if (!passwordEncoder.matches(request.getPassword(), post.getPassword())) {
            throw new ValidationException(WRONG_PASSWORD);
        }

        // 投稿の削除処理を実行
        postRepository.delete(post);
    }
}
