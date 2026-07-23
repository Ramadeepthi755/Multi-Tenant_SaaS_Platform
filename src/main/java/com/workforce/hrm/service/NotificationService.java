package com.workforce.hrm.service;

import java.util.List;

import com.workforce.hrm.dto.request.NotificationRequestDTO;
import com.workforce.hrm.dto.response.NotificationResponseDTO;

public interface NotificationService {

	// Create a notification
	NotificationResponseDTO createNotification(NotificationRequestDTO requestDTO);

	// Get all notifications of a user
	List<NotificationResponseDTO> getNotificationsByUser(Long userId);

	// Get unread notifications of a user
	List<NotificationResponseDTO> getUnreadNotifications(Long userId);

	// Get unread notification count
	long getUnreadNotificationCount(Long userId);

	// Mark notification as READ
	NotificationResponseDTO markAsRead(Long notificationId);

	// Delete notification
	void deleteNotification(Long notificationId, Long userId);

}