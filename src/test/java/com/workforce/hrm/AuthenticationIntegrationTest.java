package com.workforce.hrm;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.multipart;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.mock.web.MockMultipartFile;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.workforce.hrm.entity.Role;
import com.workforce.hrm.entity.User;
import com.workforce.hrm.repository.RoleRepository;
import com.workforce.hrm.repository.UserRepository;

/**
 * Exercises the same HTTP flow used by the React client: login, JWT storage,
 * and the authenticated current-user endpoint. The accounts are test fixtures
 * only; no development or production credentials are embedded here.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@TestPropertySource(properties = "file.upload-dir=${java.io.tmpdir}/hrm-portal-profile-test-uploads")
class AuthenticationIntegrationTest {

    private static final String TEST_PASSWORD = "test-password-not-for-production";

    private static final List<String> ROLES = List.of(
            "SUPER_ADMIN", "COMPANY_ADMIN", "HR", "MANAGER", "EMPLOYEE");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @BeforeEach
    void provisionRoleAccounts() {
        for (String roleName : ROLES) {
            String email = roleName.toLowerCase() + ".auth-test@example.test";
            if (userRepository.findByEmail(email).isPresent()) {
                continue;
            }

            Role role = roleRepository.findByRoleName(roleName)
                    .orElseThrow(() -> new IllegalStateException("Missing role " + roleName));

            User user = new User();
            user.setFullName(roleName + " authentication test user");
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(TEST_PASSWORD));
            user.setRole(role);
            user.setActive(true);
            user.setEnabled(true);
            user.setAccountLocked(false);
            user.setAccountExpired(false);
            user.setCredentialsExpired(false);
            user.setFailedAttempts(0);
            userRepository.save(user);
        }
    }

    @Test
    void everySystemRoleCanLoginAndLoadItsCurrentUser() throws Exception {
        for (String roleName : ROLES) {
            String email = roleName.toLowerCase() + ".auth-test@example.test";
            String requestBody = objectMapper.writeValueAsString(
                    new LoginRequestPayload(email, TEST_PASSWORD));

            MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(requestBody))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.token").isNotEmpty())
                    .andExpect(jsonPath("$.user.email").value(email))
                    .andExpect(jsonPath("$.user.role").value(roleName))
                    .andReturn();

            JsonNode response = objectMapper.readTree(loginResult.getResponse().getContentAsString());
            String token = response.path("token").asText();

            mockMvc.perform(get("/api/users/me")
                    .header("Authorization", "Bearer " + token))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.email").value(email))
                    .andExpect(jsonPath("$.role").value(roleName));
        }
    }

    @Test
    void profilePhotoUploadRetrievalReplacementAndDeletionUseAuthenticatedMultipartRequests()
            throws Exception {
        String email = "employee.auth-test@example.test";
        String requestBody = objectMapper.writeValueAsString(
                new LoginRequestPayload(email, TEST_PASSWORD));

        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(requestBody))
                .andExpect(status().isOk())
                .andReturn();

        String token = objectMapper.readTree(
                loginResult.getResponse().getContentAsString())
                .path("token")
                .asText();
        String authorization = "Bearer " + token;

        mockMvc.perform(get("/api/users/me/profile-photo")
                .header("Authorization", authorization))
                .andExpect(status().isNotFound());

        MockMultipartFile initialPhoto = new MockMultipartFile(
                "file",
                "avatar.png",
                MediaType.IMAGE_PNG_VALUE,
                pngSignature());

        mockMvc.perform(multipart("/api/users/me/profile-photo")
                .file(initialPhoto)
                .header("Authorization", authorization))
                .andExpect(status().isOk());

        String initialStoredPhoto = userRepository.findByEmail(email)
                .orElseThrow()
                .getProfilePhoto();

        mockMvc.perform(get("/api/users/me/profile-photo")
                .header("Authorization", authorization))
                .andExpect(status().isOk())
                .andExpect(result -> {
                    String contentType = result.getResponse().getContentType();
                    if (!MediaType.IMAGE_PNG_VALUE.equals(contentType)) {
                        throw new AssertionError("Expected a PNG profile photo response.");
                    }
                });

        MockMultipartFile replacementPhoto = new MockMultipartFile(
                "file",
                "avatar.png",
                MediaType.IMAGE_PNG_VALUE,
                pngSignature());

        mockMvc.perform(multipart("/api/users/me/profile-photo")
                .file(replacementPhoto)
                .header("Authorization", authorization))
                .andExpect(status().isOk());

        String replacementStoredPhoto = userRepository.findByEmail(email)
                .orElseThrow()
                .getProfilePhoto();

        if (initialStoredPhoto.equals(replacementStoredPhoto)) {
            throw new AssertionError("Profile photo replacement did not persist a new file name.");
        }

        MockMultipartFile invalidPhoto = new MockMultipartFile(
                "file",
                "avatar.svg",
                "image/svg+xml",
                "<svg/>".getBytes());

        mockMvc.perform(multipart("/api/users/me/profile-photo")
                .file(invalidPhoto)
                .header("Authorization", authorization))
                .andExpect(status().isBadRequest());

        mockMvc.perform(delete("/api/users/me/profile-photo")
                .header("Authorization", authorization))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/users/me/profile-photo")
                .header("Authorization", authorization))
                .andExpect(status().isNotFound());
    }

    private byte[] pngSignature() {
        return new byte[]{
                (byte) 0x89,
                0x50,
                0x4E,
                0x47,
                0x0D,
                0x0A,
                0x1A,
                0x0A
        };
    }

    private record LoginRequestPayload(String email, String password) {
    }
}
