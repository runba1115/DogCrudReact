package com.example.dog_crud_spring_boot.dto;
import lombok.Data;

/**
 * バリデーションエラーなどのフィールドごとのエラー情報を表すレスポンスDTO
 */
@Data
public class ErrorResponseDto{
    /** エラーが発生した対象のフィールド名 */
    private String field;

    /** エラーメッセージの内容 */
    private String message;
}