package com.workforce.hrm.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workforce.hrm.dto.auth.LoginRequest;
import com.workforce.hrm.dto.auth.LoginResponse;
import com.workforce.hrm.dto.auth.UserAuthResponse;
import com.workforce.hrm.entity.User;
import com.workforce.hrm.enums.LoginStatus;
import com.workforce.hrm.repository.UserRepository;
import com.workforce.hrm.security.CustomUserDetails;
import com.workforce.hrm.security.JwtUtil;
import com.workforce.hrm.service.AuthService;
import com.workforce.hrm.service.LoginHistoryService;

@Service
public class AuthServiceImpl
        implements AuthService {

    private final AuthenticationManager
            authenticationManager;

    private final UserRepository
            userRepository;

    private final JwtUtil jwtUtil;

    private final LoginHistoryService
            loginHistoryService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public AuthServiceImpl(
            AuthenticationManager
                    authenticationManager,

            UserRepository
                    userRepository,

            JwtUtil
                    jwtUtil,

            LoginHistoryService
                    loginHistoryService) {

        this.authenticationManager =
                authenticationManager;

        this.userRepository =
                userRepository;

        this.jwtUtil =
                jwtUtil;

        this.loginHistoryService =
                loginHistoryService;
    }


    // =========================================================
    // LOGIN
    // =========================================================

    @Override
    @Transactional
    public LoginResponse login(
            LoginRequest request) {

        // =====================================================
        // BASIC REQUEST VALIDATION
        // =====================================================

        if (request == null) {

            throw new IllegalArgumentException(
                    "Login request cannot be null."
            );
        }

        if (request.getEmail() == null ||
                request.getEmail().isBlank()) {

            throw new IllegalArgumentException(
                    "Email is required."
            );
        }

        if (request.getPassword() == null ||
                request.getPassword().isBlank()) {

            throw new IllegalArgumentException(
                    "Password is required."
            );
        }


        String email =
                request.getEmail()
                        .trim()
                        .toLowerCase();

        String password =
                request.getPassword();


        // =====================================================
        // FIND USER
        // =====================================================

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new UsernameNotFoundException(
                                        "Invalid email or password."
                                )
                        );


        // =====================================================
        // ACCOUNT STATUS
        // =====================================================

        if (!Boolean.TRUE.equals(
                user.isActive())) {

            throw new DisabledException(
                    "Your account is inactive."
            );
        }

        if (!Boolean.TRUE.equals(
                user.getEnabled())) {

            throw new DisabledException(
                    "Your account is disabled."
            );
        }

        if (Boolean.TRUE.equals(
                user.isAccountLocked())) {

            throw new LockedException(
                    "Your account is locked."
            );
        }


        // =====================================================
        // AUTHENTICATE
        // =====================================================

        Authentication authentication;

        try {

            authentication =
                    authenticationManager.authenticate(
                            new UsernamePasswordAuthenticationToken(
                                    email,
                                    password
                            )
                    );

        } catch (BadCredentialsException ex) {

            // -------------------------------------------------
            // RECORD FAILED LOGIN
            // -------------------------------------------------

            registerFailedAttempt(user);

            loginHistoryService.saveLogin(
                    email,
                    LoginStatus.FAILED,
                    "UNKNOWN"
            );

            throw new BadCredentialsException(
                    "Invalid email or password."
            );
        }


        // =====================================================
        // AUTHENTICATION SUCCESSFUL
        // =====================================================

        CustomUserDetails userDetails =
                (CustomUserDetails)
                        authentication.getPrincipal();


        // =====================================================
        // RESET FAILED ATTEMPTS
        // =====================================================

        user.setFailedAttempts(0);

        user.setLockTime(null);


        // =====================================================
        // UPDATE LAST LOGIN
        // =====================================================

        user.setLastLogin(
                LocalDateTime.now()
        );


        // =====================================================
        // SAVE USER
        // =====================================================

        userRepository.save(user);


        // =====================================================
        // SAVE SUCCESSFUL LOGIN HISTORY
        // =====================================================

        loginHistoryService.saveLogin(
                email,
                LoginStatus.SUCCESS,
                "UNKNOWN"
        );


        // =====================================================
        // GENERATE JWT
        // =====================================================

        String token =
                jwtUtil.generateToken(
                        user,
                        userDetails
                );


        // =====================================================
        // MAP USER TO SAFE DTO
        // =====================================================

        UserAuthResponse userResponse =
                mapToUserResponse(
                        user,
                        authentication
                );


        // =====================================================
        // FINAL RESPONSE
        // =====================================================

        return new LoginResponse(
                token,
                userResponse
        );
    }


    // =========================================================
    // LOGOUT
    // =========================================================

    @Override
    public void logout() {

        /*
         * JWT is stateless.
         *
         * Frontend removes the token.
         *
         * Future enterprise enhancement:
         *
         * - Refresh tokens
         * - Token revocation
         * - Session management
         * - Device management
         */
    }


    // =========================================================
    // MAP USER TO AUTH RESPONSE
    // =========================================================

    private UserAuthResponse mapToUserResponse(
            User user,
            Authentication authentication) {

        List<String> permissions =
                authentication
                        .getAuthorities()
                        .stream()
                        .map(
                                GrantedAuthority
                                        ::getAuthority
                        )
                        .filter(
                                permission ->
                                        permission != null
                                        && !permission
                                                .isBlank()
                        )
                        .distinct()
                        .sorted()
                        .collect(
                                Collectors.toList()
                        );


        String role = null;

        if (user.getRole() != null) {

            role =
                    user.getRole()
                            .getRoleName();
        }


        Long companyId = null;

        String companyName = null;


        // =====================================================
        // COMPANY
        // =====================================================

        if (user.getCompany() != null) {

            companyId =
                    user.getCompany()
                            .getId();

            companyName =
                    user.getCompany()
                            .getCompanyName();
        }

        // =====================================================
        // ACCOUNT STATUS
        // =====================================================

        String status;

        if (Boolean.TRUE.equals(
                user.isAccountLocked())) {

            status = "LOCKED";

        } else if (!Boolean.TRUE.equals(
                user.isActive())) {

            status = "INACTIVE";

        } else if (!Boolean.TRUE.equals(
                user.getEnabled())) {

            status = "DISABLED";

        } else {

            status = "ACTIVE";
        }


        // =====================================================
        // RESPONSE
        // =====================================================

        return new UserAuthResponse(
                user.getUserId(),
                user.getFullName(),
                user.getEmail(),
                role,
                permissions,
                user.isActive(),
                user.isAccountLocked(),
                status,
                companyId,
                companyName,
                user.getCreatedAt(),
                user.getLastLogin()
        );
    }


    // =========================================================
    // FAILED LOGIN ATTEMPTS
    // =========================================================

    private void registerFailedAttempt(
            User user) {

        int attempts =
                user.getFailedAttempts() == null
                        ? 0
                        : user.getFailedAttempts();

        attempts++;

        user.setFailedAttempts(
                attempts
        );


        // =====================================================
        // LOCK AFTER 5 FAILED ATTEMPTS
        // =====================================================

        if (attempts >= 5) {

            user.setAccountLocked(
                    true
            );

            user.setLockTime(
                    LocalDateTime.now()
            );
        }


        userRepository.save(user);
    }
}