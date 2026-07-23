package com.workforce.hrm.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.workforce.hrm.entity.LoginHistory;

public interface LoginHistoryRepository extends JpaRepository<LoginHistory, Long> {

}