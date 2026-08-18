package com.workforce.hrm.service;

import java.time.LocalDateTime;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.workforce.hrm.dto.response.AuditLogResponseDTO;
import com.workforce.hrm.entity.AuditLog;
import com.workforce.hrm.repository.AuditLogRepository;
import com.workforce.hrm.security.SecurityUtils;

@Service
public class AuditLogService {

    private final AuditLogRepository auditLogRepository;

    public AuditLogService(
            AuditLogRepository auditLogRepository) {

        this.auditLogRepository = auditLogRepository;
    }

 // =========================================================
 // SAVE AUDIT LOG
 // =========================================================

 public void saveLog(
         String action,
         String module,
         String details,
         String ipAddress) {

     try {

         System.out.println("========== AUDIT START ==========");

         AuditLog log = new AuditLog();

         // User
         log.setUserId(SecurityUtils.getCurrentUserId());
         log.setUserEmail(SecurityUtils.getCurrentUserEmail());

         // Company
         Long companyId = SecurityUtils.getCurrentCompanyId();
         log.setCompanyId(companyId == null ? 0L : companyId);

         // Audit Details
         log.setAction(action);
         log.setModule(module);
         log.setDetails(details);
         log.setIpAddress(ipAddress);
         log.setCreatedAt(LocalDateTime.now());

         System.out.println("User ID      : " + log.getUserId());
         System.out.println("User Email   : " + log.getUserEmail());
         System.out.println("Company ID   : " + log.getCompanyId());
         System.out.println("Action       : " + log.getAction());
         System.out.println("Module       : " + log.getModule());
         System.out.println("Details      : " + log.getDetails());

         AuditLog savedLog = auditLogRepository.save(log);

         System.out.println("Saved Audit ID : " + savedLog.getId());
         System.out.println("Total Audit Records : " + auditLogRepository.count());

         System.out.println("========== AUDIT END ==========");

     } catch (Exception e) {

         System.out.println("========== AUDIT ERROR ==========");
         e.printStackTrace();
     }
 }

    // =========================================================
    // GET ALL AUDIT LOGS
    // =========================================================

    public Page<AuditLogResponseDTO> getAuditLogs(
            Pageable pageable) {

        if (SecurityUtils.isSuperAdmin()) {

            return auditLogRepository
                    .findAll(pageable)
                    .map(this::convertToDTO);
        }

        return auditLogRepository
                .findByCompanyId(
                        SecurityUtils.getCurrentCompanyId(),
                        pageable)
                .map(this::convertToDTO);
    }


 // =========================================================
 // SEARCH BY MODULE
 // =========================================================

 public Page<AuditLogResponseDTO> getByModule(
         String module,
         Pageable pageable) {

     if (SecurityUtils.isSuperAdmin()) {

         return auditLogRepository
                 .findByModule(module, pageable)
                 .map(this::convertToDTO);
     }

     return auditLogRepository
             .findByCompanyIdAndModule(
                     SecurityUtils.getCurrentCompanyId(),
                     module,
                     pageable)
             .map(this::convertToDTO);
 }
//=========================================================
//SEARCH BY ACTION
//=========================================================

public Page<AuditLogResponseDTO> getByAction(
      String action,
      Pageable pageable) {

  if (SecurityUtils.isSuperAdmin()) {

      return auditLogRepository
              .findByAction(action, pageable)
              .map(this::convertToDTO);
  }

  return auditLogRepository
          .findByCompanyIdAndAction(
                  SecurityUtils.getCurrentCompanyId(),
                  action,
                  pageable)
          .map(this::convertToDTO);
}

//=========================================================
//SEARCH BY USER EMAIL
//=========================================================

public Page<AuditLogResponseDTO> getByUserEmail(
     String email,
     Pageable pageable) {

 if (SecurityUtils.isSuperAdmin()) {

     return auditLogRepository
             .findByUserEmailContainingIgnoreCase(
                     email,
                     pageable)
             .map(this::convertToDTO);
 }

 return auditLogRepository
         .findByCompanyIdAndUserEmailContainingIgnoreCase(
                 SecurityUtils.getCurrentCompanyId(),
                 email,
                 pageable)
         .map(this::convertToDTO);
}
    // =========================================================
    // ENTITY -> DTO
    // =========================================================

    private AuditLogResponseDTO convertToDTO(
            AuditLog log) {

        AuditLogResponseDTO dto =
                new AuditLogResponseDTO();

        dto.setId(log.getId());

        dto.setUserId(log.getUserId());

        dto.setUserEmail(log.getUserEmail());

        dto.setCompanyId(log.getCompanyId());

        dto.setAction(log.getAction());

        dto.setModule(log.getModule());

        dto.setDetails(log.getDetails());

        dto.setIpAddress(log.getIpAddress());

        dto.setCreatedAt(log.getCreatedAt());

        return dto;
    }
}