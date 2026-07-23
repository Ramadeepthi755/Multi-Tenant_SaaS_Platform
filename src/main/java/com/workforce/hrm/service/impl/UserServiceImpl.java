package com.workforce.hrm.service.impl;

import com.workforce.hrm.dto.request.ChangePasswordRequest;
import com.workforce.hrm.dto.request.ResetPasswordRequest;
import com.workforce.hrm.dto.request.UserRequestDTO;
import com.workforce.hrm.dto.response.UserResponseDTO;
import com.workforce.hrm.entity.PasswordResetToken;
import com.workforce.hrm.entity.User;
import com.workforce.hrm.repository.PasswordResetTokenRepository;
import com.workforce.hrm.repository.UserRepository;
import com.workforce.hrm.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.GetMapping;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

import jakarta.annotation.PostConstruct;

@Service
public class UserServiceImpl implements UserService {

	
	private UserRepository userRepository;

	private PasswordEncoder passwordEncoder;

	@GetMapping("/test-password")
	public String testPassword() {

		String hash = "$2a$10$uXz/ouPwZTp00IpWiNdKuOrVXMvuSu7ohF2QUHAB6a5R01q4lUm2i";

		return String.valueOf(passwordEncoder.matches("admin123", hash));
	}

	private PasswordResetTokenRepository tokenRepository;

	@Override
	public UserResponseDTO createUser(UserRequestDTO request) {

		User user = new User();

		user.setFullName(request.getFullName());
		user.setEmail(request.getEmail());
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		user.setRole(request.getRole());
		user.setActive(true);

		User savedUser = userRepository.save(user);

		return mapToResponse(savedUser);
	}

	@Override
	public List<UserResponseDTO> getAllUsers() {
		return userRepository.findAll().stream().map(this::mapToResponse).collect(Collectors.toList());
	}

	@Override
	public UserResponseDTO getUserById(Long id) {

		User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not Found"));

		return mapToResponse(user);
	}

	@Override
	public UserResponseDTO updateUser(Long id, UserRequestDTO request) {

		User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not Found"));

		user.setFullName(request.getFullName());
		user.setEmail(request.getEmail());
		user.setRole(request.getRole());

		User updatedUser = userRepository.save(user);

		return mapToResponse(updatedUser);
	}

	@Override
	public void deleteUser(Long id) {

		User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not Found"));

		userRepository.delete(user);
	}

	@Override
	public void lockUser(Long id) {

		User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not Found"));

		user.setAccountLocked(true);
		user.setLockTime(LocalDateTime.now());

		userRepository.save(user);
	}

	@Override
	public void unlockUser(Long id) {

		User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User Not Found"));

		user.setAccountLocked(false);
		user.setFailedAttempts(0);
		user.setLockTime(null);

		userRepository.save(user);
	}

	@Override
	public void changePassword(String email, ChangePasswordRequest request) {

		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User Not Found"));

		if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {

			throw new RuntimeException("Old Password Incorrect");
		}

		user.setPassword(passwordEncoder.encode(request.getNewPassword()));

		userRepository.save(user);
	}

	@Override
	public void forgotPassword(String email) {

		User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User Not Found"));

		String token = UUID.randomUUID().toString();

		PasswordResetToken resetToken = new PasswordResetToken();

		resetToken.setToken(token);
		resetToken.setUser(user);
		resetToken.setExpiryDate(LocalDateTime.now().plusMinutes(30));

		tokenRepository.save(resetToken);

		System.out.println("RESET TOKEN = " + token);
	}

	@Override
	public void resetPassword(ResetPasswordRequest request) {

		PasswordResetToken token = tokenRepository.findByToken(request.getToken())
				.orElseThrow(() -> new RuntimeException("Invalid Token"));

		if (token.getExpiryDate().isBefore(LocalDateTime.now())) {

			throw new RuntimeException("Token Expired");
		}

		User user = token.getUser();

		user.setPassword(passwordEncoder.encode(request.getNewPassword()));

		userRepository.save(user);

		tokenRepository.delete(token);
	}

	private UserResponseDTO mapToResponse(User user) {

		UserResponseDTO dto = new UserResponseDTO();

		dto.setUserId(user.getUserId());
		dto.setFullName(user.getFullName());
		dto.setEmail(user.getEmail());
		dto.setRole(user.getRole());
		dto.setActive(user.isActive());

		return dto;
	}
}