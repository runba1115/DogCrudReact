package com.example.dog_crud_spring_boot.model;

import jakarta.persistence.*;

@Entity
@Table(name = "ages")
public class Age {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 20)
    private String value;

    @Column(name = "sort_order", nullable = false)
    private Long sortOrder;

    /**
     * デフォルトのデータを作成する際に使用するコンストラクタ
     * 
     * @param value     表示する値
     * @param sortOrder 並び順
     */
    public Age(String value, Long sortOrder) {
        this.value = value;
        this.sortOrder = sortOrder;
    }

    /** JPA（リポジトリ）がデフォルトで使うコンストラクタ */
    public Age() {
    }

    public Long getId() {
        return id;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public Long getSortOrder() {
        return sortOrder;
    }

    public void setSortOrder(Long sortOrder) {
        this.sortOrder = sortOrder;
    }
}
