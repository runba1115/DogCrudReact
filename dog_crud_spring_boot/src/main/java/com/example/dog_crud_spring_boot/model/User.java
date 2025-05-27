package com.example.dog_crud_spring_boot.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

import java.util.Collection;
import java.util.List;

/**
 * アプリケーション内のユーザー情報を保持するエンティティ。
 * DBの users テーブルにマッピングされ、Spring Security による認証・認可にも利用される。
 */
@Entity // JPAのエンティティ（DBのusersテーブルに対応）
@Table(name = "users")
public class User implements UserDetails {

    /** ユーザーID（主キー、自動採番） */
    @Id // 主キー
    @GeneratedValue(strategy = GenerationType.IDENTITY) // 自動採番
    private Long id;

    /** 名前（表示名） */
    @NotBlank(message = "名前を設定してください")
    @Size(max = 20, message = "名前が長すぎます")
    @Column(nullable = false, length = 20)
    private String userName;

    /** メールアドレス（ログインIDとして使用） */
    @NotBlank(message = "メールアドレスを設定してください")
    @Email(message = "メールアドレスの形式が正しくありません")
    @Column(nullable = false, unique = true)
    private String email;

    /** パスワード */
    @NotBlank(message = "パスワードを設定してください")
    @Size(min = 8, message = "パスワードは5文字以上で設定してください")
    @Column(nullable = false, length = 255)
    private String password;

    // --- 以下、ゲッター・セッター（ID以外書き換え可能） ---

    public Long getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    // --- UserDetails インタフェースの実装 ---

    /**
     * このユーザーの権限リストを返す。
     * ここでは常に「ROLE_USER（一般ユーザー）」のみを持つものとして扱う。
     */
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(() -> "ROLE_USER");
    }

    /**
     * 認証に使うユーザー名を返す（ここではメールアドレスを使用）
     * ※上記のゲッターのgetUserNameとは関係ないことに留意すること
     */
    @Override
    public String getUsername() {
        return email;
    }

    /** アカウントが期限切れでないか（常にtrue） */
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    /** アカウントがロックされていないか（常にtrue） */
    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    /** 資格情報（パスワードなど）が期限切れでないか（常にtrue） */
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    /** アカウントが有効か（常にtrue） */
    @Override
    public boolean isEnabled() {
        return true;
    }
}