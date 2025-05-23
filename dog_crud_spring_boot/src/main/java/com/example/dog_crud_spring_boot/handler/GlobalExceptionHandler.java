package com.example.dog_crud_spring_boot.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.example.dog_crud_spring_boot.dto.ErrorResponseDto;

import java.util.List;
import java.util.stream.Collectors;

/**
 * アプリケーション全体で発生する例外を一括で処理するためのクラス
 * バリデーションエラーや予期しないサーバーエラーを統一的に処理してレスポンスを返す
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    /**
     * バリデーション失敗時の例外を処理する
     *
     * @param ex バリデーション例外（@Valid や @Validated によってスローされる）
     * @return 各フィールドごとのエラーメッセージを含むレスポンス（ステータスコード400）
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<List<ErrorResponseDto>> handleValidationException(MethodArgumentNotValidException ex) {
        // すべてのバリデーションエラーをフィールド名とメッセージのDTOに変換する
        List<ErrorResponseDto> errors = ex.getBindingResult()
                .getFieldErrors()
                .stream()
                .map(error -> new ErrorResponseDto(error.getField(), error.getDefaultMessage()))
                .collect(Collectors.toList());

        // HTTP 400 Bad Request でレスポンス
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);

    }

    /**
     * その他すべての例外を一括処理する
     *
     * @param ex 予期しない例外
     * @return サーバーエラーを表すレスポンスDTO（ステータスコード500）
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponseDto> handleGenericException(Exception ex) {
        // 開発用に例外スタックトレースを出力する
        ex.printStackTrace();

        // クライアントには簡潔なエラーメッセージのみ返す
        ErrorResponseDto error = new ErrorResponseDto("server", "エラーが発生しました");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(error);
    }
}