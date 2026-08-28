package com.workforce.hrm.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.workforce.hrm.dto.request.EmailRequest;
import com.workforce.hrm.service.EmailService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/email")
public class EmailController {

	private final EmailService emailService;

	public EmailController(EmailService emailService) {
		this.emailService = emailService;
	}

	@PostMapping("/send")
	@PreAuthorize("hasAuthority('NOTIFICATION_SEND')")
	public ResponseEntity<String> sendEmail(@Valid @RequestBody EmailRequest request) {

		emailService.sendEmail(request.getTo(), request.getSubject(), request.getBody());

		return ResponseEntity.ok("Email Sent Successfully");
	}

}
