package com.workforce.hrm.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.workforce.hrm.dto.request.NotificationRequestDTO;
import com.workforce.hrm.dto.response.NotificationResponseDTO;
import com.workforce.hrm.service.NotificationService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/notifications")
@Validated
public class NotificationController {

	@Autowired
	private NotificationService notificationService;

	// Create Notification
	@PostMapping
	public ResponseEntity<NotificationResponseDTO> createNotification(
			@Valid @RequestBody NotificationRequestDTO requestDTO) {

		NotificationResponseDTO response = notificationService.createNotification(requestDTO);

		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	// Get All Notifications of User
	@GetMapping("/user/{userId}")
	public ResponseEntity<List<NotificationResponseDTO>> getNotificationsByUser(@PathVariable Long userId) {

		List<NotificationResponseDTO> response = notificationService.getNotificationsByUser(userId);

		return ResponseEntity.ok(response);
	}

	// Get Unread Notifications
	@GetMapping("/user/{userId}/unread")
	public ResponseEntity<List<NotificationResponseDTO>> getUnreadNotifications(@PathVariable Long userId) {

		List<NotificationResponseDTO> response = notificationService.getUnreadNotifications(userId);

		return ResponseEntity.ok(response);
	}

	// Get Unread Notification Count
	@GetMapping("/user/{userId}/count")
	public ResponseEntity<Long> getUnreadNotificationCount(@PathVariable Long userId) {

		long count = notificationService.getUnreadNotificationCount(userId);

		return ResponseEntity.ok(count);
	}

	// Mark Notification as Read
	@PutMapping("/{notificationId}/read")
	public ResponseEntity<NotificationResponseDTO> markAsRead(@PathVariable Long notificationId) {

		NotificationResponseDTO response = notificationService.markAsRead(notificationId);

		return ResponseEntity.ok(response);
	}

	// Delete Notification
	@DeleteMapping("/{notificationId}/user/{userId}")
	public ResponseEntity<String> deleteNotification(@PathVariable Long notificationId, @PathVariable Long userId) {

		notificationService.deleteNotification(notificationId, userId);

		return ResponseEntity.ok("Notification deleted successfully.");
	}

}