package com.workforce.hrm.service;

import com.workforce.hrm.dto.request.ChangePasswordRequest;
import com.workforce.hrm.dto.request.ResetPasswordRequest;
import com.workforce.hrm.dto.request.UpdateOwnProfileRequest;
import com.workforce.hrm.dto.request.UserRequestDTO;
import com.workforce.hrm.dto.response.UserResponse;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import org.springframework.core.io.Resource;
public interface UserService {

    // =========================================================
    // CREATE USER
    // =========================================================

    UserResponse createUser(
            UserRequestDTO request);


    // =========================================================
    // GET ALL USERS
    // =========================================================

    List<UserResponse> getAllUsers();


    // =========================================================
    // GET USER BY ID
    // =========================================================

    UserResponse getUserById(
            Long id);


    // =========================================================
    // GET CURRENT LOGGED-IN USER
    // =========================================================

    UserResponse getCurrentUser(
            String email);

    UserResponse updateCurrentUser(
            String email,
            UpdateOwnProfileRequest request);


    // =========================================================
    // UPDATE USER
    // =========================================================

    UserResponse updateUser(
            Long id,
            UserRequestDTO request);


    // =========================================================
    // DELETE USER
    // =========================================================

    void deleteUser(
            Long id);


    // =========================================================
    // LOCK USER
    // =========================================================

    void lockUser(
            Long id);


    // =========================================================
    // UNLOCK USER
    // =========================================================

    void unlockUser(
            Long id);


    // =========================================================
    // CHANGE PASSWORD
    // =========================================================

    void changePassword(
            String email,
            ChangePasswordRequest request);


    // =========================================================
    // FORGOT PASSWORD
    // =========================================================

    void forgotPassword(
            String email);


    // =========================================================
    // RESET PASSWORD
    // =========================================================

    void resetPassword(
            ResetPasswordRequest request);
    
 // =========================================================
 // PROFILE PHOTO
 // =========================================================

 String uploadProfilePhoto(
         String email,
         MultipartFile file);

 String getProfilePhoto(
         String email);

 void deleteProfilePhoto(
         String email);

Resource loadProfilePhoto(
        String fileName);
}
