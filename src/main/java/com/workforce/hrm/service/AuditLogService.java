package com.workforce.hrm.service;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;

import com.workforce.hrm.entity.AuditLog;
import com.workforce.hrm.repository.AuditLogRepository;

@Service
public class AuditLogService {

	private final AuditLogRepository repository;

	public AuditLogService(AuditLogRepository repository) {
		this.repository = repository;
	}

	public void saveLog(String email,
	        String action,
	        String module,
	        String ipAddress) {

		AuditLog log = new AuditLog();

		log.setUserEmail(email);
		log.setAuditAction(action);
		log.setAuditModule(module);
		log.setTimestamp(LocalDateTime.now());
		

		repository.save(log);
	}
}