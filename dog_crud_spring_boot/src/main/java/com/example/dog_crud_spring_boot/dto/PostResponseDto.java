package com.example.dog_crud_spring_boot.dto;

import java.time.LocalDateTime;

/**
 * バリデーションエラーなどのフィールドごとのエラー情報を表すレスポンスDTO
 *
 * @param field   エラーが発生した対象のフィールド名
 * @param message エラーメッセージの内容
 */
public record PostResponseDto(Long id, String title, String content, Long ageId, String imageUrl,
        LocalDateTime createdAt, LocalDateTime updatedAt) {
}