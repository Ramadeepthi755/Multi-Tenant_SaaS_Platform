package com.workforce.hrm.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.multipart.MultipartException;

import com.workforce.hrm.dto.response.ErrorResponse;

@ControllerAdvice
public class GlobalExceptionHandler {

    // =========================================================
    // MULTIPART REQUESTS
    // =========================================================

    @ExceptionHandler(MultipartException.class)
    public ResponseEntity<ErrorResponse> handleMultipartException(
            MultipartException ex) {

        ErrorResponse response = new ErrorResponse(
                LocalDateTime.now(),
                HttpStatus.BAD_REQUEST.value(),
                "The uploaded file is missing, malformed, or exceeds the allowed size.",
                null);

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }

    // =========================================================
    // VALIDATION ERROR
    // =========================================================

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(
            MethodArgumentNotValidException ex) {

        Map<String, String> errors =
                new HashMap<>();

        ex.getBindingResult()
                .getFieldErrors()
                .forEach(error ->
                        errors.put(
                                error.getField(),
                                error.getDefaultMessage()
                        )
                );

        ErrorResponse response =
                new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.BAD_REQUEST.value(),
                        "Validation Failed",
                        errors
                );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }


    // =========================================================
    // RESOURCE NOT FOUND
    // =========================================================

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse>
    handleResourceNotFoundException(
            ResourceNotFoundException ex) {

        ErrorResponse response =
                new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.NOT_FOUND.value(),
                        ex.getMessage(),
                        null
                );

        return ResponseEntity
                .status(HttpStatus.NOT_FOUND)
                .body(response);
    }


    // =========================================================
    // DUPLICATE RESOURCE
    // =========================================================

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ErrorResponse>
    handleDuplicateException(
            DuplicateResourceException ex) {

        ErrorResponse response =
                new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.CONFLICT.value(),
                        ex.getMessage(),
                        null
                );

        return ResponseEntity
                .status(HttpStatus.CONFLICT)
                .body(response);
    }


    // =========================================================
    // ACCESS DENIED
    // =========================================================
    //
    // Authenticated user exists,
    // but does not have required permission
    // OR tries to access another tenant.
    //
    // 403 = Forbidden
    //

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse>
    handleAccessDeniedException(
            AccessDeniedException ex) {

        ErrorResponse response =
                new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.FORBIDDEN.value(),
                        ex.getMessage() != null
                                ? ex.getMessage()
                                : "Access Denied",
                        null
                );

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(response);
    }


    // =========================================================
    // BAD CREDENTIALS
    // =========================================================

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse>
    handleBadCredentialsException(
            BadCredentialsException ex) {

        ErrorResponse response =
                new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.UNAUTHORIZED.value(),
                        "Invalid email or password.",
                        null
                );

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(response);
    }


    // =========================================================
    // ACCOUNT LOCKED
    // =========================================================

    @ExceptionHandler(LockedException.class)
    public ResponseEntity<ErrorResponse>
    handleLockedException(
            LockedException ex) {

        ErrorResponse response =
                new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.FORBIDDEN.value(),
                        ex.getMessage() != null
                                ? ex.getMessage()
                                : "Account is locked.",
                        null
                );

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(response);
    }


    // =========================================================
    // ACCOUNT DISABLED
    // =========================================================

    @ExceptionHandler(DisabledException.class)
    public ResponseEntity<ErrorResponse>
    handleDisabledException(
            DisabledException ex) {

        ErrorResponse response =
                new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.FORBIDDEN.value(),
                        ex.getMessage() != null
                                ? ex.getMessage()
                                : "Account is disabled.",
                        null
                );

        return ResponseEntity
                .status(HttpStatus.FORBIDDEN)
                .body(response);
    }


    // =========================================================
    // AUTHENTICATION EXCEPTION
    // =========================================================

    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ErrorResponse>
    handleAuthenticationException(
            AuthenticationException ex) {

        ErrorResponse response =
                new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.UNAUTHORIZED.value(),
                        "Authentication required.",
                        null
                );

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(response);
    }


    // =========================================================
    // ILLEGAL ARGUMENT
    // =========================================================

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse>
    handleIllegalArgumentException(
            IllegalArgumentException ex) {

        ErrorResponse response =
                new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.BAD_REQUEST.value(),
                        ex.getMessage(),
                        null
                );

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(response);
    }


    // =========================================================
    // GENERIC EXCEPTION
    // =========================================================

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse>
    handleException(Exception ex) {

        /*
         * Log the actual exception on backend.
         *
         * Do NOT expose stack trace/details
         * to frontend in production.
         */

        ex.printStackTrace();

        ErrorResponse response =
                new ErrorResponse(
                        LocalDateTime.now(),
                        HttpStatus.INTERNAL_SERVER_ERROR.value(),
                        "Something went wrong. Please try again.",
                        null
                );

        return ResponseEntity
                .status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(response);
    }
}
