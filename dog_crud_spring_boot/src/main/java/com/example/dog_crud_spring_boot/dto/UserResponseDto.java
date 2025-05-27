package com.example.dog_crud_spring_boot.dto;

import lombok.Data;

/**
 * ユーザー情報の簡易レスポンス
 * 認証されたユーザーの最小限の情報のみを含む
 */
@Data
public class UserResponseDto {
    private Long id;
    private String email;
    private String userName;
}