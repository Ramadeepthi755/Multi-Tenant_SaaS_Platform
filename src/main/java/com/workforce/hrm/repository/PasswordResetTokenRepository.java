package com.workforce.hrm.repository;

import com.workforce.hrm.entity.PasswordResetToken;
import com.workforce.hrm.entity.User;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {

	Optional<PasswordResetToken> findByToken(String token);
	Optional<PasswordResetToken> findByUser(User user);
	void deleteByUser(User user);
	
}