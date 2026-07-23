package com.workforce.hrm.entity;

import java.time.LocalDateTime;

import jakarta.persistence.*;

@Entity
@Table(name = "audit_logs")
public class AuditLog {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	private String userEmail;

	
	private String AuditAction;

	private String AuditModule;

	private LocalDateTime timestamp;

	public AuditLog() {
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getUserEmail() {
		return userEmail;
	}

	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}

	public String getAuditAction() {
		return AuditAction;
	}

	public void setAuditAction(String auditAction) {
		AuditAction = auditAction;
	}

	public String getAuditModule() {
		return AuditModule;
	}

	public void setAuditModule(String auditModule) {
		AuditModule = auditModule;
	}


	public LocalDateTime getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(LocalDateTime timestamp) {
		this.timestamp = timestamp;
	}
}