package com.workforce.hrm.service.impl;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.workforce.hrm.service.EmailService;

@Service
public class EmailServiceImpl implements EmailService {

	@Autowired
	private JavaMailSender mailSender;

	@Override
	public void sendEmail(String to, String subject, String body) {

		System.out.println("TO      : " + to);
		System.out.println("SUBJECT : " + subject);
		System.out.println("BODY    : " + body);

		SimpleMailMessage message = new SimpleMailMessage();
		message.setFrom("ramadeepthibadireddy@gmail.com");
		message.setTo(to);
		message.setSubject(subject);
		message.setText(body);

		System.out.println("Actual TO   = " + java.util.Arrays.toString(message.getTo()));
		System.out.println("Actual FROM = " + message.getFrom());

		mailSender.send(message);

		System.out.println("EMAIL SENT SUCCESSFULLY");
	}
}
