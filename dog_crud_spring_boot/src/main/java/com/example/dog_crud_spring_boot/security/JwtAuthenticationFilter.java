package com.example.dog_crud_spring_boot.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

/**
 * JWT トークンを検証し、認証情報を設定するフィルタ
 */
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final String SECRET_KEY = "your_secret_key"; // 環境変数で管理するのが推奨

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws IOException, javax.servlet.ServletException {

        // Authorization ヘッダーからトークンを取得
        final String authHeader = request.getHeader("Authorization");
        final String token;

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            // トークンがない場合は次のフィルタへ
            chain.doFilter(request, response);
            return;
        }

        token = authHeader.substring(7); // "Bearer " を除去

        try {
            // トークンをパースしてユーザー情報を取得
            Claims claims = Jwts.parser()
                    .setSigningKey(SECRET_KEY)
                    .parseClaimsJws(token)
                    .getBody();

            String username = claims.getSubject(); // トークン内のユーザー名
            if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // ユーザーを認証済みとして設定
                UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                        username, null, null);
                authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(authToken);
            }
        } catch (Exception e) {
            // トークンが無効な場合、例外をキャッチして無視
            System.out.println("Invalid JWT Token: " + e.getMessage());
        }

        // 次のフィルタを呼び出す
        chain.doFilter(request, response);
    }
}