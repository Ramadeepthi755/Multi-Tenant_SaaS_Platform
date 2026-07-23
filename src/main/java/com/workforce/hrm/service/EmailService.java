package com.workforce.hrm.service;

public interface EmailService {

	void sendEmail(String to, String subject, String body);

}