package com.workforce.hrm.repository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import com.workforce.hrm.entity.LoginHistory;

public interface LoginHistoryRepository
        extends JpaRepository<LoginHistory, Long> {

    Page<LoginHistory> findByEmail(
            String email,
            Pageable pageable
    );
}