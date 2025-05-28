package com.example.dog_crud_spring_boot.handler;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authorization.AuthorizationDeniedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import com.example.dog_crud_spring_boot.dto.ErrorResponseDto;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * アプリケーション全体で発生する例外を一括で処理するためのクラス。
 * 各種例外に対し、共通フォーマット（List<ErrorResponseDto>）のエラーレスポンスを返却する。
 * クライアント側で一貫した形式でエラーハンドリングを行うための仕組み。
 */
@ControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    /**
     * バリデーション失敗時の例外を処理する
     *
     * @param ex @Valid によってスローされたバリデーション例外
     * @return フィールドごとのエラーメッセージを含むレスポンス（HTTP 400 BAD_REQUEST）
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
     * 認可エラー（アクセス権限がない場合）の例外を処理する。
     * 
     * @param ex アクセス権限がない場合にスローされる例外
     * @return 権限不足を示すエラーメッセージを含むレスポンス（HTTP 403 FORBIDDEN）
     */
    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<List<ErrorResponseDto>> handleAccessDeniedException(AccessDeniedException ex) {
        ErrorResponseDto dto = new ErrorResponseDto();
        dto.setField("authorization");
        dto.setMessage(ex.getMessage());

        List<ErrorResponseDto> dtoList = new ArrayList<>();
        dtoList.add(dto);

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(dtoList);
    }

    /**
     * 認可エラー（権限不足など）の例外を処理する。
     * Spring Securityによってスローされる AuthorizationDeniedException を捕捉し、
     * 統一フォーマットのエラーレスポンスを返却する。
     *
     * @param ex Spring Security によってスローされた認可例外
     * @return エラー内容を含むレスポンス（HTTP 401 UNAUTHORIZED）
     */
    @ExceptionHandler(AuthorizationDeniedException.class)
    public ResponseEntity<List<ErrorResponseDto>> handleAuthenticationException(AuthorizationDeniedException ex) {
        ErrorResponseDto dto = new ErrorResponseDto();
        dto.setField("authorization");
        dto.setMessage("権限がありません");

        List<ErrorResponseDto> dtoList = new ArrayList<>();
        dtoList.add(dto);

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(dtoList);
    }

    /**
     * リクエスト内容が不正な場合の例外を処理する。
     * 使用例：すでに登録されているメールアドレスでのユーザー登録リクエスト
     * 
     * @param ex クライアントの論理的な入力ミスによる例外
     * @return エラー内容を含むレスポンス（HTTP 400 BAD_REQUEST）
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<List<ErrorResponseDto>> handleIllegalArgumentException(IllegalArgumentException ex) {
        ErrorResponseDto dto = new ErrorResponseDto();
        dto.setField("email");
        dto.setMessage(ex.getMessage());

        List<ErrorResponseDto> dtoList = new ArrayList<>();
        dtoList.add(dto);

        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(dtoList);
    }

    /**
     * その他すべての例外を一括処理する
     *
     * @param ex 予期しない例外
     * @return サーバーエラーを表すレスポンスDTO（ステータスコード500 INTERNAL_SERVER_ERROR）
     */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<List<ErrorResponseDto>> handleGenericException(Exception ex) {
        // ログにエラースタックトレースを出力
        logger.error("予期しないエラーが発生しました", ex);

        // 予期しない例外のため、クライアント側にはメッセージを返さない（漏らしてはいけない情報が漏れることを防ぐため）
        ErrorResponseDto dto = new ErrorResponseDto();
        dto.setField("server");
        dto.setMessage("エラーが発生しました");

        List<ErrorResponseDto> dtoList = new ArrayList<>();
        dtoList.add(dto);

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(dtoList);
    }
}