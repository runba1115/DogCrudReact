package com.example.dog_crud_spring_boot.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.example.dog_crud_spring_boot.dto.ErrorResponseDto;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.stream.Collectors;

/**
 * アプリケーション全体で発生する例外を一括で処理するためのクラス
 * バリデーションエラーや予期しないサーバーエラーを統一的に処理してレスポンスを返す
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

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
                .map(error -> {
                    ErrorResponseDto dto = new ErrorResponseDto();
                    dto.setField(error.getField());
                    dto.setMessage(error.getDefaultMessage());
                    return dto;
                })
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
        // ログにエラースタックトレースを出力
        logger.error("予期しないエラーが発生しました", ex)

        // クライアントには簡潔なエラーメッセージのみ返す
        ErrorResponseDto dto = new ErrorResponseDto();
        dto.setField("server");
        dto.setMessage("エラーが発生しました");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(dto);
    }
}