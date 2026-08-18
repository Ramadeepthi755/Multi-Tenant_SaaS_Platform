package com.workforce.hrm.repository;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workforce.hrm.entity.AuditLog;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    // ==============================
    // SUPER ADMIN
    // ==============================

    Page<AuditLog> findAll(Pageable pageable);

    // ==============================
    // COMPANY
    // ==============================

    Page<AuditLog> findByCompanyId(
            Long companyId,
            Pageable pageable);

    // ==============================
    // USER
    // ==============================

    Page<AuditLog> findByUserId(
            Long userId,
            Pageable pageable);

    Page<AuditLog> findByUserEmailContainingIgnoreCase(
            String email,
            Pageable pageable);

    // ==============================
    // MODULE
    // ==============================

    Page<AuditLog> findByModule(
            String module,
            Pageable pageable);

    Page<AuditLog> findByCompanyIdAndModule(
            Long companyId,
            String module,
            Pageable pageable);

    // ==============================
    // ACTION
    // ==============================

    Page<AuditLog> findByAction(
            String action,
            Pageable pageable);

    Page<AuditLog> findByCompanyIdAndAction(
            Long companyId,
            String action,
            Pageable pageable);

    // ==============================
    // USER EMAIL
    // ==============================

    Page<AuditLog> findByCompanyIdAndUserEmailContainingIgnoreCase(
            Long companyId,
            String email,
            Pageable pageable);

    // ==============================
    // DATE RANGE
    // ==============================

    Page<AuditLog> findByCreatedAtBetween(
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable);

    Page<AuditLog> findByCompanyIdAndCreatedAtBetween(
            Long companyId,
            LocalDateTime startDate,
            LocalDateTime endDate,
            Pageable pageable);

}