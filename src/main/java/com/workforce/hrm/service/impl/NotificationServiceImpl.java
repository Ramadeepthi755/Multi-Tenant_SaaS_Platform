package com.workforce.hrm.service.impl;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.workforce.hrm.dto.request.NotificationRequestDTO;
import com.workforce.hrm.dto.response.NotificationResponseDTO;
import com.workforce.hrm.entity.Notification;
import com.workforce.hrm.entity.User;
import com.workforce.hrm.enums.NotificationStatus;
import com.workforce.hrm.repository.NotificationRepository;
import com.workforce.hrm.repository.UserRepository;
import com.workforce.hrm.service.NotificationService;
import com.workforce.hrm.exception.ResourceNotFoundException;

import jakarta.persistence.EntityNotFoundException;

@Service
public class NotificationServiceImpl implements NotificationService {

	@Autowired
	private NotificationRepository notificationRepository;

	@Autowired
	private UserRepository userRepository;

	@Override
	public NotificationResponseDTO createNotification(NotificationRequestDTO requestDTO) {

		User user = userRepository.findById(requestDTO.getUserId())
				.orElseThrow(() -> new EntityNotFoundException("User not found"));

		Notification notification = new Notification();
		notification.setTitle(requestDTO.getTitle());
		notification.setMessage(requestDTO.getMessage());
		notification.setUser(user);

		Notification savedNotification = notificationRepository.save(notification);

		return mapToResponse(savedNotification);
	}

	@Override
	public List<NotificationResponseDTO> getNotificationsByUser(Long userId) {

		User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));

		return notificationRepository.findByUserOrderByCreatedAtDesc(user).stream().map(this::mapToResponse)
				.collect(Collectors.toList());
	}

	@Override
	public List<NotificationResponseDTO> getUnreadNotifications(Long userId) {

		User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));

		return notificationRepository.findByUserAndStatusOrderByCreatedAtDesc(user, NotificationStatus.UNREAD).stream()
				.map(this::mapToResponse).collect(Collectors.toList());
	}

	@Override
	public long getUnreadNotificationCount(Long userId) {

		User user = userRepository.findById(userId).orElseThrow(() -> new EntityNotFoundException("User not found"));

		return notificationRepository.countByUserAndStatus(user, NotificationStatus.UNREAD);
	}

	@Override
	public NotificationResponseDTO markAsRead(Long notificationId) {

		Notification notification = notificationRepository.findById(notificationId)
				.orElseThrow(() -> new EntityNotFoundException("Notification not found"));

		notification.setStatus(NotificationStatus.READ);

		Notification updatedNotification = notificationRepository.save(notification);

		return mapToResponse(updatedNotification);
	}

	@Override
	public NotificationResponseDTO markAsReadForUser(Long notificationId, Long userId) {

		User user = getUser(userId);
		Notification notification = notificationRepository.findById(notificationId)
				.orElseThrow(() -> new ResourceNotFoundException("Notification not found."));

		if (!notification.getUser().getUserId().equals(user.getUserId())) {
			throw new org.springframework.security.access.AccessDeniedException(
					"You cannot update another user's notification.");
		}

		notification.setStatus(NotificationStatus.READ);
		return mapToResponse(notificationRepository.save(notification));
	}

	@Override
	public void markAllAsReadForUser(Long userId) {
		User user = getUser(userId);
		notificationRepository.findByUserAndStatusOrderByCreatedAtDesc(
				user, NotificationStatus.UNREAD)
				.forEach(notification -> notification.setStatus(NotificationStatus.READ));
	}

	@Override
	public void deleteNotification(Long notificationId, Long userId) {

		User user = getUser(userId);

		notificationRepository.deleteByNotificationIdAndUser(notificationId, user);
	}

	private User getUser(Long userId) {
		return userRepository.findById(userId)
				.orElseThrow(() -> new ResourceNotFoundException("User not found."));
	}

	private NotificationResponseDTO mapToResponse(Notification notification) {

		NotificationResponseDTO response = new NotificationResponseDTO();

		response.setNotificationId(notification.getNotificationId());
		response.setTitle(notification.getTitle());
		response.setMessage(notification.getMessage());
		response.setStatus(notification.getStatus());
		response.setCreatedAt(notification.getCreatedAt());

		return response;
	}
}
