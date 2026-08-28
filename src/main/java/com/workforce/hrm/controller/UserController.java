package com.workforce.hrm.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.workforce.hrm.dto.request.ChangePasswordRequest;
import com.workforce.hrm.dto.request.UpdateOwnProfileRequest;
import com.workforce.hrm.dto.request.UserRequestDTO;
import com.workforce.hrm.dto.response.UserResponse;
import com.workforce.hrm.service.UserService;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.MediaTypeFactory;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;


    public UserController(
            UserService userService) {

        this.userService = userService;
    }


    // =========================================================
    // CREATE USER
    // =========================================================

    @PostMapping
    @PreAuthorize("hasAuthority('USER_CREATE')")
    public ResponseEntity<UserResponse>
            createUser(
                    @Valid @RequestBody
                    UserRequestDTO request) {

        UserResponse response =
                userService.createUser(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }


    // =========================================================
    // GET ALL USERS
    // =========================================================

    @GetMapping
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<List<UserResponse>>
            getAllUsers() {

        List<UserResponse> users =
                userService.getAllUsers();

        return ResponseEntity.ok(users);
    }


    // =========================================================
    // GET CURRENT LOGGED-IN USER
    // =========================================================
    //
    // IMPORTANT:
    //
    // This endpoint MUST be declared before:
    //
    // @GetMapping("/{id}")
    //
    // Otherwise /me can be interpreted as an ID.
    //
    // =========================================================

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse>
            getCurrentUser(
                    Authentication authentication) {

        UserResponse response =
                userService.getCurrentUser(
                        authentication.getName());

        return ResponseEntity.ok(response);
    }

    // =========================================================
    // UPDATE CURRENT LOGGED-IN USER
    // =========================================================

    @PutMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<UserResponse> updateCurrentUser(
            Authentication authentication,
            @Valid @RequestBody UpdateOwnProfileRequest request) {

        return ResponseEntity.ok(
                userService.updateCurrentUser(
                        authentication.getName(),
                        request));
    }


    // =========================================================
    // GET USER BY ID
    // =========================================================

    @GetMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_READ')")
    public ResponseEntity<UserResponse>
            getUserById(
                    @PathVariable Long id) {

        UserResponse response =
                userService.getUserById(id);

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // UPDATE USER
    // =========================================================

    @PutMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_UPDATE')")
    public ResponseEntity<UserResponse>
            updateUser(
                    @PathVariable Long id,
                    @Valid @RequestBody
                    UserRequestDTO request) {

        UserResponse response =
                userService.updateUser(
                        id,
                        request);

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // DELETE USER
    // =========================================================

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('USER_DELETE')")
    public ResponseEntity<String>
            deleteUser(
                    @PathVariable Long id) {

        userService.deleteUser(id);

        return ResponseEntity.ok(
                "User Deleted Successfully");
    }


    // =========================================================
    // LOCK USER
    // =========================================================

    @PutMapping("/{id}/lock")
    @PreAuthorize("hasAuthority('USER_UPDATE')")
    public ResponseEntity<String>
            lockUser(
                    @PathVariable Long id) {

        userService.lockUser(id);

        return ResponseEntity.ok(
                "User Locked Successfully");
    }


    // =========================================================
    // UNLOCK USER
    // =========================================================

    @PutMapping("/{id}/unlock")
    @PreAuthorize("hasAuthority('USER_UPDATE')")
    public ResponseEntity<String>
            unlockUser(
                    @PathVariable Long id) {

        userService.unlockUser(id);

        return ResponseEntity.ok(
                "User Unlocked Successfully");
    }


    // =========================================================
    // CHANGE OWN PASSWORD
    // =========================================================

    @PutMapping("/change-password")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String>
            changePassword(
                    Authentication authentication,
                    @Valid @RequestBody
                    ChangePasswordRequest request) {

        userService.changePassword(
                authentication.getName(),
                request);

        return ResponseEntity.ok(
                "Password Changed Successfully");
    }
 // =========================================================
 // UPLOAD OWN PROFILE PHOTO
 // =========================================================

 @PostMapping(
         value = "/me/profile-photo",
         consumes = MediaType.MULTIPART_FORM_DATA_VALUE
 )
 @PreAuthorize("isAuthenticated()")
 public ResponseEntity<String> uploadProfilePhoto(
         Authentication authentication,
         @RequestParam("file") MultipartFile file) {

     String fileName =
             userService.uploadProfilePhoto(
                     authentication.getName(),
                     file);

     return ResponseEntity.ok(fileName);
 }


 // =========================================================
 // DELETE OWN PROFILE PHOTO
 // =========================================================

 @DeleteMapping("/me/profile-photo")
 @PreAuthorize("isAuthenticated()")
 public ResponseEntity<Void> deleteProfilePhoto(
         Authentication authentication) {

     userService.deleteProfilePhoto(
             authentication.getName());

     return ResponseEntity.noContent().build();
 }


 // =========================================================
 // GET OWN PROFILE PHOTO
 // =========================================================

 @GetMapping("/me/profile-photo")
 @PreAuthorize("isAuthenticated()")
 public ResponseEntity<Resource> getProfilePhoto(
         Authentication authentication) {

     String fileName =
             userService.getProfilePhoto(
                     authentication.getName());

     Resource resource =
             userService.loadProfilePhoto(
                     fileName);

     return ResponseEntity.ok()
             .contentType(
                     MediaTypeFactory
                             .getMediaType(
                                     fileName)
                             .orElse(
                                     MediaType.APPLICATION_OCTET_STREAM))
             .body(resource);
 }
}
