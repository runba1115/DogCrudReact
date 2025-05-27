package com.example.dog_crud_spring_boot.repository;

import com.example.dog_crud_spring_boot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

/**
 * ユーザーエンティティに対するデータアクセス操作を定義するリポジトリインタフェース
 * Spring Data JPA により、自動的に実装が提供される。
 */
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * 指定されたメールアドレスに一致するユーザーを検索する
     *
     * @param email 検索対象のメールアドレス
     * @return 該当するユーザーが存在すれば Optional に包んで返す 存在しなければ空のOptional
     */
    Optional<User> findByEmail(String email);

    /**
     * 指定されたメールアドレスが既に登録されているかどうかを判定する
     *
     * @param email 確認対象のメールアドレス
     * @return 登録されていれば true、そうでなければ false
     */
    boolean existsByEmail(String email);
}