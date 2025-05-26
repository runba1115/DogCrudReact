package com.example.dog_crud_spring_boot.repository;

import com.example.dog_crud_spring_boot.model.Age;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

/**
 * 年齢エンティティ {@link Age} に対するデータアクセス操作を定義するリポジトリインタフェース
 */
public interface AgeRepository extends JpaRepository<Age, Long> {
    /**
     * 年齢をすべて取得するとき、sortOrderで昇順で並び替えて取得する
     * ※Spring Data JPA には メソッド名から自動的にクエリを作ってくれる機能 があるためこれだけでよい
     * @return sortOrderで昇順で並び替えられた後のすべての年齢の情報
     */
    List<Age> findAllByOrderBySortOrderAsc();
}