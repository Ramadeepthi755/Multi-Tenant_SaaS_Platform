package com.workforce.hrm.service;

import java.time.LocalDateTime;
import com.workforce.hrm.enums.LoginStatus;

import org.springframework.stereotype.Service;

import com.workforce.hrm.entity.LoginHistory;
import com.workforce.hrm.repository.LoginHistoryRepository;

@Service
public class LoginHistoryService {

	private final LoginHistoryRepository repository;

	public LoginHistoryService(LoginHistoryRepository repository) {
		this.repository = repository;
	}

	public void saveLogin(String email, String status, String ipAddress) {

		LoginHistory history = new LoginHistory();

		history.setEmail(email);
		history.setStatus(LoginStatus.valueOf(status));
		history.setIpAddress(ipAddress);
		history.setLoginTime(LocalDateTime.now());

		repository.save(history);
	}
}