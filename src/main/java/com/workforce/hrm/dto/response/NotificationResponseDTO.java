package com.workforce.hrm.dto.response;

import java.time.LocalDateTime;

import com.workforce.hrm.enums.NotificationStatus;

public class NotificationResponseDTO {

	private Long notificationId;
	private String title;
	private String message;
	private NotificationStatus status;
	private LocalDateTime createdAt;

	public NotificationResponseDTO() {
	}

	public NotificationResponseDTO(Long notificationId, String title, String message, NotificationStatus status,
			LocalDateTime createdAt) {
		this.notificationId = notificationId;
		this.title = title;
		this.message = message;
		this.status = status;
		this.createdAt = createdAt;
	}

	public Long getNotificationId() {
		return notificationId;
	}

	public void setNotificationId(Long notificationId) {
		this.notificationId = notificationId;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public NotificationStatus getStatus() {
		return status;
	}

	public void setStatus(NotificationStatus status) {
		this.status = status;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}
}