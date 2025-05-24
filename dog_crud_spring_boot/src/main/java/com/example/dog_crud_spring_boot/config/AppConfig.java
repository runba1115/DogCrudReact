package com.example.dog_crud_spring_boot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * アプリケーション全体で使用する共通のBean定義を行う設定クラス
 * 主にセキュリティ関連（パスワードの暗号化設定）を構成する
 */
@Configuration // このクラスが設定クラスであることをSpringに伝えるアノテーション
public class AppConfig {

    /**
     * パスワードの暗号化に使用するエンコーダーをBeanとして定義する
     * Spring Securityがユーザー認証時に自動で使用するようになる
     *
     * @return BCryptアルゴリズムを使用したパスワードエンコーダー
     */
    @Bean // このメソッドの戻り値をSpringコンテナに登録し、他の場所で使えるようにする
    public PasswordEncoder passwordEncoder() {
        // パスワードをハッシュ化するエンコーダーを生成する
        return new BCryptPasswordEncoder();
    }
}