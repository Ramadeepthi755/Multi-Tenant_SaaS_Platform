package com.workforce.hrm.controller;

import com.workforce.hrm.dto.request.ForgotPasswordRequest;
import com.workforce.hrm.dto.request.LoginRequest;
import com.workforce.hrm.dto.request.ResetPasswordRequest;
import com.workforce.hrm.dto.response.LoginResponse;
import com.workforce.hrm.entity.User;
import com.workforce.hrm.repository.UserRepository;
import com.workforce.hrm.security.JwtUtil;
import com.workforce.hrm.service.LoginHistoryService;
import com.workforce.hrm.service.UserService;

import lombok.RequiredArgsConstructor;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final LoginHistoryService loginHistoryService;
    private final UserService userService;
    private final UserRepository userRepository;

    @Autowired
    public AuthController(AuthenticationManager authenticationManager,
                          JwtUtil jwtUtil,
                          LoginHistoryService loginHistoryService,
                          UserService userService,
                          UserRepository userRepository) {

        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.loginHistoryService = loginHistoryService;
        this.userService = userService;
        this.userRepository = userRepository;
    }


    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {

        logger.info("========== LOGIN ==========");
        logger.info("Email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User Not Found"));

        // Check account lock
        if (user.isAccountLocked()) {
            throw new RuntimeException("Your account is locked. Please contact Admin.");
        }

        try {

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()));

            // Reset failed attempts
            user.setFailedAttempts(0);
            user.setAccountLocked(false);
            user.setLockTime(null);

            userRepository.save(user);

            // Save login history (if implemented)
            try {
            } catch (Exception e) {
                logger.warn("Unable to save login history: {}", e.getMessage());
            }

            String token = jwtUtil.generateToken(request.getEmail());

            logger.info("Login Successful");

            return ResponseEntity.ok(new LoginResponse(token));

        } catch (BadCredentialsException e) {

            int attempts = user.getFailedAttempts() + 1;

            user.setFailedAttempts(attempts);

            if (attempts >= 5) {
                user.setAccountLocked(true);
                user.setLockTime(java.time.LocalDateTime.now());
            }

            userRepository.save(user);

            throw new RuntimeException(
                    "Invalid Email or Password. Attempt "
                            + attempts + " of 5");

        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(
            @RequestBody ForgotPasswordRequest request) {

        userService.forgotPassword(request.getEmail());

        return ResponseEntity.ok("Reset Token Generated Successfully");
    }

    @PostMapping("/reset-password")
    public ResponseEntity<String> resetPassword(
            @RequestBody ResetPasswordRequest request) {

        userService.resetPassword(request);

        return ResponseEntity.ok("Password Reset Successfully");
    }

}