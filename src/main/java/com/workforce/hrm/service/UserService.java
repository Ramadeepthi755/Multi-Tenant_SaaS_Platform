package com.workforce.hrm.service;

import com.workforce.hrm.dto.request.ChangePasswordRequest;
import com.workforce.hrm.dto.request.ResetPasswordRequest;
import com.workforce.hrm.dto.request.UserRequestDTO;
import com.workforce.hrm.dto.response.UserResponseDTO;

import java.util.List;

public interface UserService {

	UserResponseDTO createUser(UserRequestDTO request);

	List<UserResponseDTO> getAllUsers();

	UserResponseDTO getUserById(Long id);

	UserResponseDTO updateUser(Long id, UserRequestDTO request);

	void changePassword(String email, ChangePasswordRequest request);

	void deleteUser(Long id);

	void lockUser(Long id);

	void unlockUser(Long id);

	void forgotPassword(String email);

	void resetPassword(ResetPasswordRequest request);
}