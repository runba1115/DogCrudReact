package com.example.dog_crud_spring_boot.service;

import com.example.dog_crud_spring_boot.dto.PostRequestDto;
import com.example.dog_crud_spring_boot.dto.PostResponseDto;
import com.example.dog_crud_spring_boot.model.Age;
import com.example.dog_crud_spring_boot.model.Post;
import com.example.dog_crud_spring_boot.model.User;
import com.example.dog_crud_spring_boot.repository.AgeRepository;
import com.example.dog_crud_spring_boot.repository.PostRepository;

import jakarta.validation.ValidationException;

import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.List;
import java.util.Optional;

/**
 * 投稿に関するビジネスロジックを提供するサービスクラス。
 * すべての投稿の取得、特定のidの投稿の取得、投稿の作成、更新、削除処理を担当する。
 */
@Service
public class PostService {

    private final PostRepository postRepository;
    private final AgeRepository ageRepository;
    private static final String TARGET_DATA_NOT_FOUND = "指定された投稿が存在しません";
    private static final String WRONG_AGE_DATA = "送信された年齢のデータが不正です";
    private static final String NO_PERMISSION = "この操作を実行する権限がありません";

    /**
     * コンストラクタ
     * 
     * @param postRepository 投稿データへのアクセスを提供するリポジトリ
     * @param ageRepository  年齢データへのアクセスを提供するリポジトリ
     */
    public PostService(PostRepository postRepository, AgeRepository ageRepository) {
        this.postRepository = postRepository;
        this.ageRepository = ageRepository;
    }

    /**
     * Postをフロントエンド側に返却するDTOに変換する
     * 
     * @param post DTOに変換する対象
     * @return フロントエンド側に返却するPostのDTO
     */
    private PostResponseDto convertPostToPostResponseDto(Post post) {
        PostResponseDto dto = new PostResponseDto();
        dto.setId(post.getId());
        dto.setUserId(post.getUser().getId());
        dto.setUserEmail(post.getUser().getEmail());
        dto.setUserName(post.getUser().getName());
        dto.setTitle(post.getTitle());
        dto.setContent(post.getContent());
        dto.setAgeId(post.getAge().getId());
        dto.setAgeValue(post.getAge().getValue());
        dto.setImageUrl(post.getImageUrl());
        dto.setCreatedAt(post.getCreatedAt());
        dto.setUpdatedAt(post.getUpdatedAt());
        dto.setDeletedAt(post.getDeletedAt());
        return dto;
    }

    /**
     * すべての投稿を取得する
     * 
     * @return すべての投稿
     */
    public List<PostResponseDto> getAllPosts() {
        return postRepository.findAll().stream().map(this::convertPostToPostResponseDto).toList();
    }

    /**
     * 特定のidの投稿を取得する
     * 
     * @param id 投稿のID
     * @return 該当する投稿（存在しない場合は空のOptional）
     */
    public Optional<PostResponseDto> getPostById(Long id) {
        return postRepository.findById(id).map(this::convertPostToPostResponseDto);
    }

    /**
     * 新しい投稿を作成する
     *
     * @param request クライアントから送信された投稿データ（バリデーション済み）
     * @return 保存された投稿オブジェクト
     * @throws ValidationException 年齢IDが存在しない場合にスローされる
     */
    public PostResponseDto createPost(PostRequestDto request, Authentication authentication) {
        // 入力された年齢IDに対応するAgeデータを取得（存在しなければ例外）
        Age age = ageRepository.findById(request.getAgeId())
                .orElseThrow(() -> new ValidationException(WRONG_AGE_DATA));

        User user = (User) authentication.getPrincipal();

        // 投稿データの作成と各フィールドの設定
        Post post = new Post();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setImageUrl(request.getImageUrl());
        post.setUser(user);
        post.setAge(age);

        // 投稿データを保存して返却する
        Post savedPost = postRepository.save(post);
        PostResponseDto response = convertPostToPostResponseDto(savedPost);
        return response;
    }

    /**
     * 投稿の作成者とログインしているユーザーが同じかを確認し、同じでなければ例外を投げる
     * 
     * @param post           確認対象の投稿
     * @param authentication ログインしているユーザー
     * @throws AccessDeniedException 投稿の作成者とログインしているユーザーが同じ出ない場合にthrowされる
     */
    private void validateUserOwnership(Post post, Authentication authentication) throws AccessDeniedException {
        // 認証されたユーザーを取得
        User authenticatedUser = (User) authentication.getPrincipal();

        // 投稿の所有者と認証されたユーザーが一致するか確認
        if (!post.getUser().getId().equals(authenticatedUser.getId())) {
            throw new AccessDeniedException(NO_PERMISSION);
        }
    }

    /**
     * 指定されたIDの投稿を更新する
     *
     * @param id      更新対象の投稿ID
     * @param request 更新後の投稿データ（バリデーション済み）
     * @return 更新された投稿オブジェクト
     */
    public PostResponseDto updatePost(Long id, PostRequestDto request, Authentication authentication)
            throws AccessDeniedException {
        // 指定された投稿IDの投稿データを取得（存在しなければ例外）
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ValidationException(TARGET_DATA_NOT_FOUND));

        // 入力された年齢IDに対応するAgeデータを取得（存在しなければ例外）
        Age age = ageRepository.findById(request.getAgeId())
                .orElseThrow(() -> new ValidationException(WRONG_AGE_DATA));

        // 更新しようとしたユーザーと作成者が同じかを確認する（異なっていれば例外を投げることで処理を中断するためreturnは不要）
        validateUserOwnership(post, authentication);

        // 投稿内容の更新
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setImageUrl(request.getImageUrl());
        post.setAge(age);

        // 更新内容を保存して返却する
        Post savedPost = postRepository.save(post);
        PostResponseDto response = convertPostToPostResponseDto(savedPost);
        return response;
    }

    /**
     * 指定されたIDの投稿を削除する。
     *
     * @param id      削除対象の投稿ID
     * @param request 削除に必要な情報（パスワードを含む）
     */
    public void deletePost(Long id, PostRequestDto request, Authentication authentication)
            throws AccessDeniedException {
        // 指定された投稿IDの投稿データを取得（存在しなければ例外）
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new ValidationException(TARGET_DATA_NOT_FOUND));

        // 削除しようとしたユーザーと作成者が同じかを確認する（異なっていれば例外を投げることで処理を中断するためreturnは不要）
        validateUserOwnership(post, authentication);

        // 投稿の削除処理を実行
        postRepository.delete(post);
    }
}
