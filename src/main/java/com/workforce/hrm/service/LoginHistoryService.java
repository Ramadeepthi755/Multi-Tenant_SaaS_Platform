package com.workforce.hrm.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import com.workforce.hrm.entity.LoginHistory;
import com.workforce.hrm.enums.LoginStatus;
import com.workforce.hrm.repository.LoginHistoryRepository;

@Service
public class LoginHistoryService {

    private final LoginHistoryRepository repository;

    public LoginHistoryService(
            LoginHistoryRepository repository) {

        this.repository = repository;
    }

    // =========================================================
    // SAVE LOGIN HISTORY
    // =========================================================
    //
    // REQUIRES_NEW is intentional.
    //
    // Login history must be saved independently from
    // the authentication transaction.
    //
    // This is especially important for failed logins because
    // AuthServiceImpl may throw an authentication exception.
    // =========================================================

    @Transactional(
            propagation = Propagation.REQUIRES_NEW
    )
    public void saveLogin(
            String email,
            LoginStatus status,
            String ipAddress) {

        if (email == null ||
                email.isBlank()) {

            return;
        }

        LoginHistory history =
                new LoginHistory();

        history.setEmail(
                email.trim().toLowerCase()
        );

        history.setStatus(
                status
        );

        history.setIpAddress(
                ipAddress == null ||
                ipAddress.isBlank()
                        ? "UNKNOWN"
                        : ipAddress
        );

        history.setLoginTime(
                LocalDateTime.now()
        );

        repository.save(history);
    }

    // =========================================================
    // BACKWARD COMPATIBILITY
    // =========================================================

    @Transactional(
            propagation = Propagation.REQUIRES_NEW
    )
    public void saveLogin(
            String email,
            String status,
            String ipAddress) {

        LoginStatus loginStatus =
                LoginStatus.valueOf(
                        status.toUpperCase()
                );

        saveLogin(
                email,
                loginStatus,
                ipAddress
        );
    }
}