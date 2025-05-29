package com.example.dog_crud_spring_boot.controller;

import com.example.dog_crud_spring_boot.dto.UserResponseDto;
import com.example.dog_crud_spring_boot.model.User;
import com.example.dog_crud_spring_boot.repository.UserRepository;

import jakarta.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

/**
 * ユーザー関連の操作を提供するRESTコントローラ
 * 下記の機能を持つ
 * ・新規ユーザー登録
 * ・ログイン中のユーザー情報取得
 * ※ログイン機能はSpring Security の機能（/login）に任せるので特別なコードは不要
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Autowired
    public UserController(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * 新しいユーザーを登録する。
     * すでに登録されたメールアドレスが存在する場合は登録を拒否する。
     *
     * @param user 登録対象のユーザー情報（バリデーション付き）
     * @return 登録されたユーザーのIDとメールアドレスを含むレスポンス（ステータスコード200）
     * @throws IllegalArgumentException メールアドレスが既に登録されている場合
     */
    @PostMapping("/register")
    public ResponseEntity<UserResponseDto> register(@Valid @RequestBody User user) {
        if (userRepository.existsByEmail(user.getEmail())) {
            throw new IllegalArgumentException("このメールアドレスは既に使われています");
        }

        // パスワードをハッシュ化する
        user.setPassword(passwordEncoder.encode(user.getPassword())); // パスワードをハッシュ化

        // 保存を実行する
        User savedUser = userRepository.save(user);
        UserResponseDto userResponse = new UserResponseDto();
        userResponse.setId(savedUser.getId());
        userResponse.setEmail(savedUser.getEmail());
        userResponse.setUserName(savedUser.getUserName());

        return ResponseEntity.ok(userResponse);
    }

    /**
     * 現在ログイン中のユーザー情報を取得する
     *
     * @param authentication Spring Securityによって注入されるログイン済みユーザーの認証情報
     * @return ログイン済みユーザーのIDとメールアドレスを含むレスポンス（ステータスコード200）
     *         未認証の場合は 401 Unauthorized を返す
     */
    @PreAuthorize("isAuthenticated()")
    @GetMapping("/me")
    public ResponseEntity<UserResponseDto> getCurrentUser(Authentication authentication) {
        // 認証されている場合は、認証情報からログインユーザー（Userオブジェクト）を取得する
        User user = (User) authentication.getPrincipal();

        // 上記のままではパスワードのような、使用しない情報も含まれている。
        // ユーザーIDとメールアドレスだけを返す簡易レスポンスを作成して返す
        UserResponseDto response = new UserResponseDto();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setUserName(user.getUserName());
        return ResponseEntity.ok(response);
    }
}