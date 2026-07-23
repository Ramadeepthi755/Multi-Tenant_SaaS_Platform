package com.workforce.hrm;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

public class PasswordGenerator {

	private static final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

	public static void main(String[] args) {

		String password = "admin123";

		System.out.println("Password : " + password);
		System.out.println("Encoded  : " + encoder.encode(password));
	}
}