package com.example.dog_crud_spring_boot.dto;

import jakarta.persistence.Column;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 投稿を保存、更新するときのDTO
 * ※パスワードの長さに制限を設けるためのバリデーションが必要だが、
 * Post側に持たせるとハッシュ化したときに長くなり、バリデーションに引っかかってしまうため作成した
 */
public class PostRequestDto {
    @NotBlank(message = "タイトルは必須です")
    @Size(max = 20, message = "タイトルは20文字以内で入力してください")
    @Column(nullable = false, length = 20)
    private String title;

    @NotBlank(message = "内容は必須です")
    @Size(max = 100, message = "内容は100文字以内で入力してください")
    @Column(nullable = false, length = 100)
    private String content;

    @NotBlank(message = "パスワードは必須です")
    @Size(min = 5, max = 20, message = "パスワードは5文字以上20文字以内で入力してください")
    @Column(nullable = false)
    private String password;

    @NotBlank(message = "画像のURLは必須です")
    @Column(name = "image_url", nullable = false)
    private String imageUrl;

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public String getPassword() {
        return password;
    }

    public String getImageUrl() {
        return imageUrl;
    }

}