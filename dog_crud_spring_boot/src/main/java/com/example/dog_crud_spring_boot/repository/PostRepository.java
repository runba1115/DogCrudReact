package com.example.dog_crud_spring_boot.repository;

import com.example.dog_crud_spring_boot.model.Post;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 投稿エンティティ {@link Post} に対するデータアクセス操作を定義するリポジトリインタフェース
 * ※現在は、{@link JpaRepository} によって提供される基本的なCRUD操作（保存、取得、削除など）のみを使用しており、
 * このインタフェース自体には独自のメソッド定義は存在しない。
 * 今後、特定の条件による検索やカスタムクエリの追加が必要になった場合に備え、拡張可能な形で作成している。
 */
public interface PostRepository extends JpaRepository<Post, Long> {
    // 追加のメソッドは現在未定義（将来の拡張用）
}