package com.workforce.hrm.controller;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workforce.hrm.dto.response.AuditLogResponseDTO;
import com.workforce.hrm.service.AuditLogService;

@RestController
@RequestMapping({"/api/audit", "/api/audit-logs"})
public class AuditLogController {

    private final AuditLogService auditLogService;

    public AuditLogController(AuditLogService auditLogService) {
        this.auditLogService = auditLogService;
    }

    // =========================================================
    // GET ALL AUDIT LOGS
    // =========================================================

    @GetMapping
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','COMPANY_ADMIN')")
    public Page<AuditLogResponseDTO> getAuditLogs(Pageable pageable) {

        return auditLogService.getAuditLogs(pageable);
    }

    // =========================================================
    // GET BY MODULE
    // =========================================================

    @GetMapping("/module/{module}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','COMPANY_ADMIN')")
    public Page<AuditLogResponseDTO> getByModule(
            @PathVariable String module,
            Pageable pageable) {

        return auditLogService.getByModule(module, pageable);
    }

    // =========================================================
    // GET BY ACTION
    // =========================================================

    @GetMapping("/action/{action}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','COMPANY_ADMIN')")
    public Page<AuditLogResponseDTO> getByAction(
            @PathVariable String action,
            Pageable pageable) {

        return auditLogService.getByAction(action, pageable);
    }

    // =========================================================
    // GET BY USER EMAIL
    // =========================================================

    @GetMapping("/user/{email}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','COMPANY_ADMIN')")
    public Page<AuditLogResponseDTO> getByUserEmail(
            @PathVariable String email,
            Pageable pageable) {

        return auditLogService.getByUserEmail(email, pageable);
    }
}