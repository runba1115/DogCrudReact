package com.example.dog_crud_spring_boot.controller;

import com.example.dog_crud_spring_boot.dto.PostRequestDto;
import com.example.dog_crud_spring_boot.dto.PostResponseDto;
import com.example.dog_crud_spring_boot.service.PostService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import jakarta.validation.Valid;

import java.nio.file.AccessDeniedException;
import java.util.List;

/**
 * 投稿に関するAPIを提供するコントローラ
 * 投稿の作成、取得、更新、削除（CRUD）を行う
 */
@RestController
@RequestMapping("/api/posts")
public class PostController {
    private final PostService postService;

    /**
     * PostControllerのコンストラクタ
     * 
     * @param postService 投稿に関するロジックを提供するサービス
     */
    public PostController(PostService postService) {
        this.postService = postService;
    }

    /**
     * すべての投稿を取得する
     *
     * @return 投稿のリストを含む HTTP レスポンス（ステータスコード 200）
     */
    @GetMapping("/all")
    public ResponseEntity<List<PostResponseDto>> getAll() {
        List<PostResponseDto> postList = postService.getAllPosts();
        return ResponseEntity.ok(postList);
    }

    /**
     * 新しい投稿を作成する。
     * ※バリデーションに引っかかるなどすると例外が発生するが、グローバルエラーハンドラーで処理できるためtry-catchは不要である。
     *
     * @param postRequestDto クライアントから送信された投稿データ（バリデーション付き）
     * @return 保存された投稿データを含む HTTP レスポンス（ステータスコード 200）
     */
    @PreAuthorize("isAuthenticated()")
    @PostMapping
    public ResponseEntity<PostResponseDto> create(@Valid @RequestBody PostRequestDto postRequestDto,
            Authentication authentication) {
        PostResponseDto savedPost = postService.createPost(postRequestDto, authentication);
        return ResponseEntity.ok(savedPost);
    }

    /**
     * 指定されたIDの投稿を取得する
     *
     * @param id 取得対象の投稿ID
     * @return 該当する投稿が存在すればステータス200で投稿を返し、存在しなければ404を返す HTTP レスポンス
     */
    @GetMapping("/{id}")
    public ResponseEntity<PostResponseDto> getById(@PathVariable Long id) {
        return postService.getPostById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 指定されたIDの投稿を更新する
     * ※バリデーションに引っかかるなどすると例外が発生するが、グローバルエラーハンドラーで処理できるためtry-catchは不要である。
     *
     * @param id             更新対象の投稿ID
     * @param updatedPostDto 新しい投稿データ（バリデーション付き）
     * @return 更新後の投稿データを含む HTTP レスポンス
     */
    @PutMapping("/{id}")
    public ResponseEntity<PostResponseDto> update(@PathVariable Long id,
            @Valid @RequestBody PostRequestDto updatedPostDto,
            Authentication authentication) throws AccessDeniedException {
        PostResponseDto updatedPost = postService.updatePost(id, updatedPostDto, authentication);
        return ResponseEntity.ok(updatedPost);
    }

    /**
     * 指定されたIDの投稿を削除する。
     * 
     * @param id 削除対象の投稿ID
     * @return 削除成功時は204 No Content、存在しない場合は404 Not Found を返す HTTP レスポンス
     *         ※削除成功時、「消えたから返すものがない」という意味で204 No Contentを返す(そのためステータス200ではない)
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication authentication)
            throws AccessDeniedException {
        postService.deletePost(id, authentication);
        return ResponseEntity.noContent().build();
    }
}