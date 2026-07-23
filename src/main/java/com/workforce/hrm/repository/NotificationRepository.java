package com.workforce.hrm.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.workforce.hrm.entity.Notification;
import com.workforce.hrm.entity.User;
import com.workforce.hrm.enums.NotificationStatus;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

	// Get all notifications of a user
	List<Notification> findByUserOrderByCreatedAtDesc(User user);

	// Get unread notifications
	List<Notification> findByUserAndStatusOrderByCreatedAtDesc(User user, NotificationStatus status);

	// Count unread notifications
	long countByUserAndStatus(User user, NotificationStatus status);

	// Delete notification by id and user
	void deleteByNotificationIdAndUser(Long notificationId, User user);
	
	void deleteByUser(User user);
	List<Notification> findTop5ByUserOrderByCreatedAtDesc(User user);

}