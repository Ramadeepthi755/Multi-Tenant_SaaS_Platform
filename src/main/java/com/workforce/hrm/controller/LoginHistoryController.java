package com.workforce.hrm.controller;

import java.util.List;

import org.springframework.web.bind.annotation.*;

import com.workforce.hrm.entity.LoginHistory;
import com.workforce.hrm.repository.LoginHistoryRepository;

@RestController
@RequestMapping("/api/login-history")
public class LoginHistoryController {

	private final LoginHistoryRepository repository;

	public LoginHistoryController(LoginHistoryRepository repository) {

		this.repository = repository;
	}

	@GetMapping
	public List<LoginHistory> getAllHistory() {
		return repository.findAll();
	}
}