package com.workforce.hrm.service.impl;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.workforce.hrm.dto.request.ChangePasswordRequest;
import com.workforce.hrm.dto.request.ResetPasswordRequest;
import com.workforce.hrm.dto.request.UserRequestDTO;
import com.workforce.hrm.dto.response.UserResponse;
import com.workforce.hrm.entity.Company;
import com.workforce.hrm.entity.PasswordResetToken;
import com.workforce.hrm.entity.Role;
import com.workforce.hrm.entity.User;
import com.workforce.hrm.mapper.UserMapper;
import com.workforce.hrm.repository.CompanyRepository;
import com.workforce.hrm.repository.PasswordResetTokenRepository;
import com.workforce.hrm.repository.RoleRepository;
import com.workforce.hrm.repository.UserRepository;
import com.workforce.hrm.security.SecurityUtils;
import com.workforce.hrm.service.AuditLogService;
import com.workforce.hrm.service.UserService;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import com.workforce.hrm.service.FileStorageService;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final RoleRepository roleRepository;
    private final CompanyRepository companyRepository;
    private final PasswordResetTokenRepository tokenRepository;
    private final AuditLogService auditLogService;
    private final FileStorageService fileStorageService;

    public UserServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            RoleRepository roleRepository,
            CompanyRepository companyRepository,
            PasswordResetTokenRepository tokenRepository,
            AuditLogService auditLogService,FileStorageService fileStorageService) {

        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
        this.companyRepository = companyRepository;
        this.tokenRepository = tokenRepository;
        this.auditLogService = auditLogService;
        this.fileStorageService =fileStorageService;
    }

    // =========================================================
    // CREATE USER
    // =========================================================

    @Override
    public UserResponse createUser(
            UserRequestDTO request) {

        if (request.getPassword() == null ||
                request.getPassword().isBlank()) {

            throw new RuntimeException(
                    "Password is required");
        }

        if (userRepository.existsByEmail(
                request.getEmail())) {

            throw new RuntimeException(
                    "Email Already Exists");
        }

        Role role =
                roleRepository
                        .findById(request.getRoleId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Role Not Found"));

        // Prevent illegal role assignment
        validateRoleAssignment(role);

        Company company =
                resolveCompanyForCreate(request);

        User user =
                UserMapper.toEntity(
                        request,
                        role,
                        company);

        user.setPassword(
                passwordEncoder.encode(
                        request.getPassword()));

        User savedUser =
                userRepository.save(user);

        auditLogService.saveLog(
                "CREATE",
                "USER",
                "Created User : "
                        + savedUser.getEmail(),
                "SYSTEM");

        return UserMapper.toResponse(savedUser);
    }

    // =========================================================
    // GET ALL USERS
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {

        List<User> users;

        if (SecurityUtils.isSuperAdmin()) {

            users =
                    userRepository.findAll();

        } else {

            Long companyId =
                    getRequiredCurrentCompanyId();

            users =
                    userRepository
                            .findByCompanyId(
                                    companyId);
        }

        return users
                .stream()
                .map(UserMapper::toResponse)
                .toList();
    }

    // =========================================================
    // GET CURRENT LOGGED-IN USER
    // =========================================================
    //
    // Used by:
    //
    // GET /api/users/me
    //
    // The email comes from the authenticated
    // Spring Security principal.
    //
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public UserResponse getCurrentUser(
            String email) {

        if (email == null ||
                email.isBlank()) {

            throw new RuntimeException(
                    "Authenticated user email is required");
        }

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Current User Not Found"));

        return UserMapper.toResponse(user);
    }

    // =========================================================
    // GET USER BY ID
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public UserResponse getUserById(
            Long id) {

        User user =
                getUserAndValidateAccess(id);

        return UserMapper.toResponse(user);
    }

    // =========================================================
    // UPDATE USER
    // =========================================================

    @Override
    public UserResponse updateUser(
            Long id,
            UserRequestDTO request) {

        User user =
                getUserAndValidateAccess(id);

        Role role =
                roleRepository
                        .findById(
                                request.getRoleId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Role Not Found"));

        validateRoleAssignment(role);

        // -----------------------------------------------------
        // EMAIL DUPLICATE CHECK
        // -----------------------------------------------------

        userRepository
                .findByEmail(request.getEmail())
                .ifPresent(existingUser -> {

                    if (!existingUser
                            .getUserId()
                            .equals(user.getUserId())) {

                        throw new RuntimeException(
                                "Email Already Exists");
                    }
                });

        /*
         * Company is intentionally NOT passed.
         *
         * Normal user update cannot move a user
         * from Company A to Company B.
         */
        UserMapper.updateEntity(
                user,
                request,
                role);

        /*
         * UserRequestDTO currently requires password.
         * We still keep this check so the service
         * remains safe if DTO validation is relaxed later.
         */
        if (request.getPassword() != null &&
                !request.getPassword().isBlank()) {

            user.setPassword(
                    passwordEncoder.encode(
                            request.getPassword()));
        }

        User updatedUser =
                userRepository.save(user);

        auditLogService.saveLog(
                "UPDATE",
                "USER",
                "Updated User : "
                        + updatedUser.getEmail(),
                "SYSTEM");

        return UserMapper.toResponse(updatedUser);
    }

    // =========================================================
    // DELETE USER
    // =========================================================

    @Override
    public void deleteUser(Long id) {

        User user =
                getUserAndValidateAccess(id);

        /*
         * Prevent a logged-in user from accidentally
         * deleting their own account.
         */
        preventSelfAdministrativeAction(
                user,
                "delete");

        userRepository.delete(user);

        auditLogService.saveLog(
                "DELETE",
                "USER",
                "Deleted User : "
                        + user.getEmail(),
                "SYSTEM");
    }

    // =========================================================
    // LOCK USER
    // =========================================================

    @Override
    public void lockUser(Long id) {

        User user =
                getUserAndValidateAccess(id);

        preventSelfAdministrativeAction(
                user,
                "lock");

        user.setAccountLocked(true);
        user.setLockTime(
                LocalDateTime.now());

        userRepository.save(user);

        auditLogService.saveLog(
                "LOCK",
                "USER",
                "Locked User : "
                        + user.getEmail(),
                "SYSTEM");
    }

    // =========================================================
    // UNLOCK USER
    // =========================================================

    @Override
    public void unlockUser(Long id) {

        User user =
                getUserAndValidateAccess(id);

        user.setAccountLocked(false);
        user.setFailedAttempts(0);
        user.setLockTime(null);

        userRepository.save(user);

        auditLogService.saveLog(
                "UNLOCK",
                "USER",
                "Unlocked User : "
                        + user.getEmail(),
                "SYSTEM");
    }

    // =========================================================
    // CHANGE OWN PASSWORD
    // =========================================================

    @Override
    public void changePassword(
            String email,
            ChangePasswordRequest request) {

        /*
         * Email comes from authenticated principal,
         * not from arbitrary frontend userId.
         */
        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User Not Found"));

        if (!passwordEncoder.matches(
                request.getOldPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "Old Password Incorrect");
        }

        if (passwordEncoder.matches(
                request.getNewPassword(),
                user.getPassword())) {

            throw new RuntimeException(
                    "New password cannot be same as old password");
        }

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()));

        userRepository.save(user);

        auditLogService.saveLog(
                "CHANGE_PASSWORD",
                "USER",
                "Changed Password : "
                        + user.getEmail(),
                "SYSTEM");
    }

    // =========================================================
    // FORGOT PASSWORD
    // =========================================================

    @Override
    public void forgotPassword(
            String email) {

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "User Not Found"));

        tokenRepository
                .findByUser(user)
                .ifPresent(
                        tokenRepository::delete);

        String token =
                UUID.randomUUID()
                        .toString();

        PasswordResetToken resetToken =
                new PasswordResetToken();

        resetToken.setToken(token);
        resetToken.setUser(user);

        resetToken.setExpiryDate(
                LocalDateTime.now()
                        .plusMinutes(30));

        tokenRepository.save(
                resetToken);

        /*
         * Development only.
         *
         * Later replace with EmailService.
         */
        System.out.println(
                "RESET TOKEN = " + token);
    }

    // =========================================================
    // RESET PASSWORD
    // =========================================================

    @Override
    public void resetPassword(
            ResetPasswordRequest request) {

        PasswordResetToken token =
                tokenRepository
                        .findByToken(
                                request.getToken())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Invalid Token"));

        if (token.getExpiryDate()
                .isBefore(
                        LocalDateTime.now())) {

            tokenRepository.delete(token);

            throw new RuntimeException(
                    "Token Expired");
        }

        User user =
                token.getUser();

        user.setPassword(
                passwordEncoder.encode(
                        request.getNewPassword()));

        userRepository.save(user);

        auditLogService.saveLog(
                "RESET_PASSWORD",
                "USER",
                "Reset Password : "
                        + user.getEmail(),
                "SYSTEM");

        /*
         * Token becomes invalid after successful use.
         */
        tokenRepository.delete(token);
    }

    // =========================================================
    // GET USER + TENANT VALIDATION
    // =========================================================

    private User getUserAndValidateAccess(
            Long userId) {

        if (userId == null) {

            throw new RuntimeException(
                    "User ID is required");
        }

        // SUPER_ADMIN can access users globally
        if (SecurityUtils.isSuperAdmin()) {

            return userRepository
                    .findById(userId)
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "User Not Found"));
        }

        Long companyId =
                getRequiredCurrentCompanyId();

        /*
         * Company condition is part of query.
         *
         * Company A cannot retrieve
         * Company B user.
         */
        return userRepository
                .findByUserIdAndCompanyId(
                        userId,
                        companyId)
                .orElseThrow(() ->
                        new AccessDeniedException(
                                "User not found or access denied"));
    }

    // =========================================================
    // RESOLVE COMPANY FOR USER CREATION
    // =========================================================

    private Company resolveCompanyForCreate(
            UserRequestDTO request) {

        /*
         * SUPER_ADMIN:
         *
         * Can explicitly choose the target company.
         */
        if (SecurityUtils.isSuperAdmin()) {

            if (request.getCompanyId() == null) {

                throw new RuntimeException(
                        "Company ID is required when Super Admin creates a company user");
            }

            return companyRepository
                    .findById(
                            request.getCompanyId())
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Company Not Found"));
        }

        /*
         * COMPANY_ADMIN / HR etc:
         *
         * Ignore request.companyId completely.
         *
         * Company always comes from authenticated
         * user's tenant.
         */
        Long companyId =
                getRequiredCurrentCompanyId();

        return companyRepository
                .findById(companyId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Company Not Found"));
    }

    // =========================================================
    // ROLE ASSIGNMENT SECURITY
    // =========================================================

    private void validateRoleAssignment(
            Role targetRole) {

        if (targetRole == null ||
                targetRole.getRoleName() == null) {

            throw new RuntimeException(
                    "Invalid Role");
        }

        String roleName =
                targetRole
                        .getRoleName()
                        .trim()
                        .toUpperCase();

        /*
         * SUPER_ADMIN can assign any existing role.
         */
        if (SecurityUtils.isSuperAdmin()) {
            return;
        }

        /*
         * No company-level user should ever be
         * able to create/promote someone to
         * SUPER_ADMIN.
         */
        if ("SUPER_ADMIN".equals(roleName)) {

            throw new AccessDeniedException(
                    "Only Super Admin can assign SUPER_ADMIN role");
        }
    }

    // =========================================================
    // CURRENT COMPANY
    // =========================================================

    private Long getRequiredCurrentCompanyId() {

        Long companyId =
                SecurityUtils
                        .getCurrentCompanyId();

        if (companyId == null) {

            throw new AccessDeniedException(
                    "No company assigned to current user");
        }

        return companyId;
    }

    // =========================================================
    // PREVENT SELF DELETE / SELF LOCK
    // =========================================================

    private void preventSelfAdministrativeAction(
            User targetUser,
            String action) {

        Authentication authentication =
                SecurityContextHolder
                        .getContext()
                        .getAuthentication();

        if (authentication == null ||
                !authentication.isAuthenticated()) {

            throw new AccessDeniedException(
                    "Authentication required");
        }

        String currentEmail =
                authentication.getName();

        if (currentEmail != null &&
                targetUser.getEmail() != null &&
                currentEmail.equalsIgnoreCase(
                        targetUser.getEmail())) {

            throw new AccessDeniedException(
                    "You cannot "
                            + action
                            + " your own account");
        }
    }
 // =========================================================
 // UPLOAD OWN PROFILE PHOTO
 // =========================================================

 @Override
 @Transactional
 public String uploadProfilePhoto(
         String email,
         MultipartFile file) {

     if (file == null ||
             file.isEmpty()) {

         throw new IllegalArgumentException(
                 "Please select a profile photo.");
     }

     String contentType =
             file.getContentType();

     if (contentType == null ||
             !contentType.startsWith("image/")) {

         throw new IllegalArgumentException(
                 "Only image files are allowed.");
     }

     long maxSize =
             5 * 1024 * 1024;

     if (file.getSize() > maxSize) {

         throw new IllegalArgumentException(
                 "Profile photo must be less than 5 MB.");
     }

     User user =
             userRepository
                     .findByEmail(email)
                     .orElseThrow(() ->
                             new RuntimeException(
                                     "User Not Found"));

     String oldPhoto =
             user.getProfilePhoto();

     String newPhoto =
             fileStorageService
                     .storeFile(file);

     user.setProfilePhoto(
             newPhoto);

     userRepository.save(user);

     if (oldPhoto != null &&
             !oldPhoto.isBlank()) {

         try {

             fileStorageService
                     .deleteFile(oldPhoto);

         } catch (Exception ex) {

             /*
              * Do not fail the upload just because
              * deleting an old photo failed.
              */
             System.err.println(
                     "Unable to delete old profile photo: "
                     + ex.getMessage());
         }
     }

     return newPhoto;
 }


 // =========================================================
 // GET PROFILE PHOTO FILE NAME
 // =========================================================

 @Override
 @Transactional(readOnly = true)
 public String getProfilePhoto(
         String email) {

     User user =
             userRepository
                     .findByEmail(email)
                     .orElseThrow(() ->
                             new RuntimeException(
                                     "User Not Found"));

     String photo =
             user.getProfilePhoto();

     if (photo == null ||
             photo.isBlank()) {

         throw new RuntimeException(
                 "Profile photo not found.");
     }

     return photo;
 }


 // =========================================================
 // LOAD PROFILE PHOTO
 // =========================================================

 @Override
 public Resource loadProfilePhoto(
         String fileName) {

     return fileStorageService
             .loadFile(fileName);
 }
}