package com.example.dog_crud_spring_boot.dto;

import java.time.LocalDateTime;

import lombok.Data;

/**
 * 投稿の情報を返すDTO
 * ※ユーザーの情報や年齢の情報が含まれるが、ユーザーの情報内のパスワード、年齢の情報内の並び順を返さないようにすることが目的のため、
 * 削除日時のようなおそらく使わない値も念のため設定できるようにしている
 */
@Data
public class PostResponseDto {
    /** 投稿のID */
    Long id;

    /** 投稿を作成したユーザーのID */
    Long userId;

    /** 投稿を作成したユーザーのメールアドレス */
    String userEmail;

    /** 投稿を作成したユーザーの名前 */
    String userName;

    /** タイトル */
    String title;

    /** 内容 */
    String content;

    /** 年齢のID */
    Long ageId;

    /** 年齢の値 */
    String ageValue;

    /** 画像のURL */
    String imageUrl;

    /** 作成日時 */
    LocalDateTime createdAt;

    /** 更新日時 */
    LocalDateTime updatedAt;

    /** 削除日時 */
    LocalDateTime deletedAt;
}