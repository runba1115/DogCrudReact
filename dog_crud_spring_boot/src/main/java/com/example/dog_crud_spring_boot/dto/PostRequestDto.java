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

    @NotBlank(message = "タイトルを入力してください")
    @Size(max = 20, message = "タイトルが長すぎます")
    private String title;

    @NotBlank(message = "内容を入力してください")
    @Size(max = 100, message = "タイトルが長すぎます")
    private String content;

    @NotNull(message = "年齢を選択してください")
    private Long ageId;

    @NotBlank(message = "画像を選択してください")
    private String imageUrl;
}