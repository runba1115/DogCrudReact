package com.example.dog_crud_spring_boot.service;

import com.example.dog_crud_spring_boot.repository.UserRepository;
import org.springframework.security.core.userdetails.*;
import org.springframework.stereotype.Service;

/**
 * Spring Security の認証処理において、指定されたユーザー情報をデータベースから取得するためのサービスクラス
 * UserDetailsServiceインターフェースを実装し、emailを用いたユーザーの検索と返却を行う
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * コンストラクタインジェクションによるUserRepositoryの注入
     * ※Springが自動で用意して、ここにセットする仕組みを使っている
     *
     * @param userRepository ユーザー情報を取得するためのリポジトリ
     */
    public CustomUserDetailsService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * 指定されたemailを用いてユーザー情報をロードする
     * Spring Securityの認証時に自動で呼び出される
     *
     * @param email ログイン時に入力されたメールアドレス（ユーザー名の代わり）
     * @return 該当するユーザー情報（UserDetailsとして返却）
     * @throws UsernameNotFoundException 指定されたメールアドレスが見つからなかった場合にスローされる例外
     */
    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // emailを使ってユーザーを検索し、存在しなければ例外を投げる
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }
}