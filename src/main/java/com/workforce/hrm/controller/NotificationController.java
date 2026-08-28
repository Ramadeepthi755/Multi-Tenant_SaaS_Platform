package com.workforce.hrm.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import com.workforce.hrm.dto.request.NotificationRequestDTO;
import com.workforce.hrm.dto.response.NotificationResponseDTO;
import com.workforce.hrm.service.NotificationService;
import com.workforce.hrm.security.SecurityUtils;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/notifications")
@Validated
public class NotificationController {

	@Autowired
	private NotificationService notificationService;

	// Create Notification
	@PostMapping
	@PreAuthorize("hasAuthority('NOTIFICATION_SEND')")
	public ResponseEntity<NotificationResponseDTO> createNotification(
			@Valid @RequestBody NotificationRequestDTO requestDTO) {

		NotificationResponseDTO response = notificationService.createNotification(requestDTO);

		return new ResponseEntity<>(response, HttpStatus.CREATED);
	}

	// Get All Notifications of User
	@GetMapping
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<List<NotificationResponseDTO>> getMyNotifications() {
		return ResponseEntity.ok(
				notificationService.getNotificationsByUser(
						SecurityUtils.getCurrentUserId()));
	}

	@GetMapping("/unread-count")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<Long> getMyUnreadNotificationCount() {
		return ResponseEntity.ok(
				notificationService.getUnreadNotificationCount(
						SecurityUtils.getCurrentUserId()));
	}

	@GetMapping("/user/{userId}")
	@PreAuthorize("hasAuthority('NOTIFICATION_READ')")
	public ResponseEntity<List<NotificationResponseDTO>> getNotificationsByUser(@PathVariable Long userId) {
		ensureSelfOrSuperAdmin(userId);

		List<NotificationResponseDTO> response = notificationService.getNotificationsByUser(userId);

		return ResponseEntity.ok(response);
	}

	// Get Unread Notifications
	@GetMapping("/user/{userId}/unread")
	@PreAuthorize("hasAuthority('NOTIFICATION_READ')")
	public ResponseEntity<List<NotificationResponseDTO>> getUnreadNotifications(@PathVariable Long userId) {
		ensureSelfOrSuperAdmin(userId);

		List<NotificationResponseDTO> response = notificationService.getUnreadNotifications(userId);

		return ResponseEntity.ok(response);
	}

	// Get Unread Notification Count
	@GetMapping("/user/{userId}/count")
	@PreAuthorize("hasAuthority('NOTIFICATION_READ')")
	public ResponseEntity<Long> getUnreadNotificationCount(@PathVariable Long userId) {
		ensureSelfOrSuperAdmin(userId);

		long count = notificationService.getUnreadNotificationCount(userId);

		return ResponseEntity.ok(count);
	}

	// Mark Notification as Read
	@PutMapping("/{notificationId}/read")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<NotificationResponseDTO> markAsRead(@PathVariable Long notificationId) {

		NotificationResponseDTO response = notificationService.markAsReadForUser(
				notificationId, SecurityUtils.getCurrentUserId());

		return ResponseEntity.ok(response);
	}

	@PutMapping("/read-all")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<Void> markAllAsRead() {
		notificationService.markAllAsReadForUser(SecurityUtils.getCurrentUserId());
		return ResponseEntity.noContent().build();
	}

	// Delete Notification
	@DeleteMapping("/{notificationId}/user/{userId}")
	@PreAuthorize("hasAuthority('NOTIFICATION_READ')")
	public ResponseEntity<String> deleteNotification(@PathVariable Long notificationId, @PathVariable Long userId) {
		ensureSelfOrSuperAdmin(userId);

		notificationService.deleteNotification(notificationId, userId);

		return ResponseEntity.ok("Notification deleted successfully.");
	}

	@DeleteMapping("/{notificationId}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<Void> deleteMyNotification(@PathVariable Long notificationId) {
		notificationService.deleteNotification(notificationId, SecurityUtils.getCurrentUserId());
		return ResponseEntity.noContent().build();
	}

	private void ensureSelfOrSuperAdmin(Long userId) {
		if (!SecurityUtils.isSuperAdmin()
				&& !userId.equals(SecurityUtils.getCurrentUserId())) {
			throw new org.springframework.security.access.AccessDeniedException(
					"You cannot access another user's notifications.");
		}
	}

}
