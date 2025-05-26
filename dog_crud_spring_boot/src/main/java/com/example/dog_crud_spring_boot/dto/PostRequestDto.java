package com.example.dog_crud_spring_boot.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * 投稿を保存、更新するときのDTO
 * ※パスワードの長さに制限を設けるためのバリデーションが必要だが、
 * Post側に持たせるとハッシュ化したときに長くなり、バリデーションに引っかかってしまうため作成した
 */
public class PostRequestDto {

    private Long id;

    @NotBlank(message = "タイトルは必須です")
    @Size(max = 20, message = "タイトルは20文字以内で入力してください")
    private String title;

    @NotBlank(message = "内容は必須です")
    @Size(max = 100, message = "内容は100文字以内で入力してください")
    private String content;

    @Size(min = 5, max = 20, message = "パスワードは5文字以上20文字以内で入力してください")
    private String password;

    @NotNull(message = "年齢を選択してください")
    private Long ageId;

    @NotBlank(message = "画像のURLは必須です")
    private String imageUrl;

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public Long getAgeId(){
        return ageId;
    }

    public String getPassword() {
        return password;
    }

    public String getImageUrl() {
        return imageUrl;
    }

}