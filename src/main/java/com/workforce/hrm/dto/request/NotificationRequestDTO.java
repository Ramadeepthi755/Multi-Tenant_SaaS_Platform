package com.workforce.hrm.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class NotificationRequestDTO {

	@NotNull(message = "User ID is required")
	private Long userId;

	@NotBlank(message = "Title is required")
	@Size(max = 100, message = "Title cannot exceed 100 characters")
	private String title;

	@NotBlank(message = "Message is required")
	@Size(max = 500, message = "Message cannot exceed 500 characters")
	private String message;

	public NotificationRequestDTO() {
	}

	public NotificationRequestDTO(Long userId, String title, String message) {
		this.userId = userId;
		this.title = title;
		this.message = message;
	}

	public Long getUserId() {
		return userId;
	}

	public void setUserId(Long userId) {
		this.userId = userId;
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
}