package com.example.dog_crud_spring_boot.controller;

import com.example.dog_crud_spring_boot.model.Post;
import com.example.dog_crud_spring_boot.repository.PostRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;

/**
 * 投稿に関するAPIを提供するコントローラ
 * 投稿の作成、取得、更新、削除（CRUD）を行う
 */
@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostRepository postRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * PostControllerのコンストラクタ
     * 
     * @param postRepository 投稿データへのアクセスを提供するリポジトリ
     */
    public PostController(PostRepository postRepository, PasswordEncoder passwordEncoder) {
        this.postRepository = postRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * すべての投稿を取得する
     *
     * @return 投稿のリストを含む HTTP レスポンス（ステータスコード 200）
     */
    @GetMapping("/all")
    public ResponseEntity<List<Post>> getAll() {
        List<Post> postList = postRepository.findAll();
        return ResponseEntity.ok(postList);
    }

    /**
     * 新しい投稿を作成する。
     * ※バリデーションに引っかかるなどすると例外が発生するが、グローバルエラーハンドラーで処理できるためtry-catchは不要である。
     *
     * @param post クライアントから送信された投稿データ（バリデーション付き）
     * @return 保存された投稿データを含む HTTP レスポンス（ステータスコード 200）
     */
    @PostMapping
    public ResponseEntity<Post> create(@Valid @RequestBody Post post) {
        // パスワードはハッシュ化してから保存する
        post.setPassword(passwordEncoder.encode(post.getPassword()));
        Post savedPost = postRepository.save(post);
        return ResponseEntity.ok(savedPost);
    }

    /**
     * 指定されたIDの投稿を取得する
     *
     * @param id 取得対象の投稿ID
     * @return 該当する投稿が存在すればステータス200で投稿を返し、存在しなければ404を返す HTTP レスポンス
     */
    @GetMapping("/{id}")
    public ResponseEntity<Post> getById(@PathVariable Long id) {
        return postRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 指定されたIDの投稿を更新する
     * ※バリデーションに引っかかるなどすると例外が発生するが、グローバルエラーハンドラーで処理できるためtry-catchは不要である。
     *
     * @param id          更新対象の投稿ID
     * @param updatedPost 新しい投稿データ（バリデーション付き）
     * @return 更新後の投稿データを含む HTTP レスポンス。該当IDが存在しない場合は404を返す
     */
    @PutMapping("/{id}")
    public ResponseEntity<Post> update(@PathVariable Long id, @Valid @RequestBody Post updatedPost) {
        // 指定IDの投稿を検索する
        return postRepository.findById(id)
                .map(post -> {
                    if (passwordEncoder.matches(updatedPost.getPassword(), post.getPassword())) {
                        // 入力されたパスワードが保存されているものと一致する。保存を実行する。
                        // タイトルと本文を新しい値に更新
                        post.setTitle(updatedPost.getTitle());
                        post.setContent(updatedPost.getContent());
                        post.setImageUrl(updatedPost.getImageUrl());

                        // 更新された投稿を保存して返す
                        Post savedPost = postRepository.save(post);
                        return ResponseEntity.ok(savedPost);
                    } else {
                        return ResponseEntity.status(HttpStatus.FORBIDDEN).<Post>build();
                    }

                })
                // 該当投稿が存在しなければ 404 を返す
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 指定されたIDの投稿を削除する。
     * 
     * @param id 削除対象の投稿ID
     * @return 削除成功時は204 No Content、存在しない場合は404 Not Found を返す HTTP レスポンス
     *         ※削除成功時、「消えたから返すものがない」という意味で204 No Contentを返す(そのためステータス200ではない)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!postRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }

        // 投稿をID指定で削除
        postRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}