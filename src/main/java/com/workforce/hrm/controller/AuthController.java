package com.workforce.hrm.controller;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.workforce.hrm.dto.auth.LoginRequest;
import com.workforce.hrm.dto.auth.LoginResponse;
import com.workforce.hrm.dto.request.ForgotPasswordRequest;
import com.workforce.hrm.dto.request.ResetPasswordRequest;
import com.workforce.hrm.service.AuthService;
import com.workforce.hrm.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserService userService;

    public AuthController(
            AuthService authService,
            UserService userService) {

        this.authService = authService;
        this.userService = userService;
    }

    // =========================================================
    // LOGIN
    // =========================================================

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(
            @Valid @RequestBody LoginRequest request) {

        LoginResponse response =
                authService.login(request);

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // LOGOUT
    // =========================================================

    @PostMapping("/logout")
    public ResponseEntity<Void> logout() {

        authService.logout();

        return ResponseEntity.noContent()
                .build();
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<Void> forgotPassword(
            @Valid @RequestBody ForgotPasswordRequest request) {

        userService.forgotPassword(request.getEmail());

        /*
         * Do not reveal whether an email is registered. A valid address always
         * receives the same response; delivery errors are surfaced separately.
         */
        return ResponseEntity.accepted().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(
            @Valid @RequestBody ResetPasswordRequest request) {

        userService.resetPassword(request);

        return ResponseEntity.noContent().build();
    }
}
