package com.example.dog_crud_spring_boot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import org.springframework.lang.NonNull;

import org.springframework.security.config.Customizer;

/**
 * Webアプリケーションの共通設定を定義するクラス
 * CORS設定やセキュリティ（ログイン・認可）の構成を行う
 */
@Configuration
public class WebConfig implements WebMvcConfigurer {

    /**
     * CORS（Cross-Origin Resource Sharing）の設定を追加する
     * React（http://localhost:3000）からのAPI通信を許可するための構成
     *
     * @param registry CORSマッピングを管理するオブジェクト
     */
    @Override
    public void addCorsMappings(@NonNull CorsRegistry registry) {
        registry
                // すべてのパスに対してCORSを適用する
                .addMapping("/**")

                // ローカルのReactアプリからのアクセスを許可する
                .allowedOriginPatterns("http://localhost:3000")

                // 許可するHTTPメソッド（すべて）
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")

                // すべてのヘッダーを許可する
                .allowedHeaders("*")

                // 認証情報（Cookie等）の送信を許可する
                .allowCredentials(true);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // CORSを有効化（↑で定義したCORS設定が使われるようにする）
                .cors(Customizer.withDefaults())

                // CSRF対策（Cross-Site Request Forgery大まかにいうとなりすまし攻撃の対策）
                // を無効化（API用アプリのため、トークン管理しないので無効にする）
                .csrf(csrf -> csrf.disable())

                // 全てのリクエストを許可する（現状は細かい制限を加えない）
                .authorizeHttpRequests(auth -> auth
                        .anyRequest().permitAll());

        // 最終的にSecurityFilterChainを返す
        return http.build();
    }
}