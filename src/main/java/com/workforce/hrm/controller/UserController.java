package com.workforce.hrm.controller;

import com.workforce.hrm.dto.request.ChangePasswordRequest;
import com.workforce.hrm.dto.request.UserRequestDTO;
import com.workforce.hrm.dto.response.UserResponseDTO;
import com.workforce.hrm.service.UserService;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

	private UserService userService;

	public UserController(UserService userService) {
		this.userService = userService;
	}

	// Create User
	@PostMapping
	public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserRequestDTO request) {

		return new ResponseEntity<>(userService.createUser(request), HttpStatus.CREATED);
	}

	// Get All Users
	@GetMapping
	public ResponseEntity<List<UserResponseDTO>> getAllUsers() {

		return ResponseEntity.ok(userService.getAllUsers());
	}

	// Get User By Id
	@GetMapping("/{id}")
	public ResponseEntity<UserResponseDTO> getUserById(@PathVariable Long id) {

		return ResponseEntity.ok(userService.getUserById(id));
	}

	// Update User
	@PutMapping("/{id}")
	public ResponseEntity<UserResponseDTO> updateUser(@Valid @PathVariable Long id,
			@RequestBody UserRequestDTO request) {

		return ResponseEntity.ok(userService.updateUser(id, request));
	}

	// Delete User
	@DeleteMapping("/{id}")
	public ResponseEntity<String> deleteUser(@PathVariable Long id) {

		userService.deleteUser(id);

		return ResponseEntity.ok("User Deleted Successfully");
	}

	// Lock User
	@PutMapping("/{id}/lock")
	public ResponseEntity<String> lockUser(@PathVariable Long id) {

		userService.lockUser(id);

		return ResponseEntity.ok("User Locked Successfully");
	}

	// Unlock User
	@PutMapping("/{id}/unlock")
	public ResponseEntity<String> unlockUser(@PathVariable Long id) {

		userService.unlockUser(id);

		return ResponseEntity.ok("User Unlocked Successfully");
	}

	@PutMapping("/change-password")
	public ResponseEntity<String> changePassword(@Valid Authentication authentication,
			@RequestBody ChangePasswordRequest request) {

		userService.changePassword(authentication.getName(), request);

		return ResponseEntity.ok("Password Changed Successfully");
	}
}