package com.example.dog_crud_spring_boot.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * 投稿を保存、更新するときのDTO
 */
@Data
public class PostRequestDto {

    private Long id;

    @NotBlank(message = "タイトルは必須です")
    @Size(max = 20, message = "タイトルは20文字以内で入力してください")
    private String title;

    @NotBlank(message = "内容は必須です")
    @Size(max = 100, message = "内容は100文字以内で入力してください")
    private String content;

    @NotNull(message = "年齢を選択してください")
    private Long ageId;

    @NotBlank(message = "画像のURLは必須です")
    private String imageUrl;
}