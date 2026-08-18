package com.workforce.hrm.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.workforce.hrm.entity.LoginHistory;
import com.workforce.hrm.repository.LoginHistoryRepository;

@RestController
@RequestMapping("/api/login-history")
public class LoginHistoryController {

    private final LoginHistoryRepository repository;

    public LoginHistoryController(
            LoginHistoryRepository repository) {

        this.repository = repository;
    }

    // =========================================================
    // MY LOGIN HISTORY
    // =========================================================

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Page<LoginHistory>>
            getMyLoginHistory(
                    Authentication authentication,

                    @RequestParam(
                            defaultValue = "0")
                    int page,

                    @RequestParam(
                            defaultValue = "10")
                    int size) {

        if (page < 0) {
            page = 0;
        }

        if (size <= 0) {
            size = 10;
        }

        if (size > 100) {
            size = 100;
        }

        Pageable pageable =
                PageRequest.of(
                        page,
                        size,
                        Sort.by(
                                Sort.Direction.DESC,
                                "loginTime"
                        )
                );

        Page<LoginHistory> history =
                repository.findByEmail(
                        authentication.getName(),
                        pageable
                );

        return ResponseEntity.ok(
                history
        );
    }
}