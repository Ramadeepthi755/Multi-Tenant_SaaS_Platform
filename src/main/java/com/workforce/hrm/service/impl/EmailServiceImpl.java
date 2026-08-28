package com.workforce.hrm.service.impl;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.mail.MailException;

import com.workforce.hrm.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

	private final JavaMailSender mailSender;
	private final String fromAddress;

	public EmailServiceImpl(
			JavaMailSender mailSender,
			@Value("${app.mail.from:no-reply@hrm-portal.local}") String fromAddress) {
		this.mailSender = mailSender;
		this.fromAddress = fromAddress;
	}

	@Override
	public void sendEmail(String to, String subject, String body) {

		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom(fromAddress);
		message.setTo(to);
		message.setSubject(subject);
		message.setText(body);

		try {
			mailSender.send(message);
		} catch (MailException exception) {
			throw new IllegalStateException("Email delivery failed.", exception);
		}
	}
}
