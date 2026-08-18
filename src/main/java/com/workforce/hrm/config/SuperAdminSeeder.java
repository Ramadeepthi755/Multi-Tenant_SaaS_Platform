package com.workforce.hrm.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.workforce.hrm.entity.Role;
import com.workforce.hrm.entity.User;
import com.workforce.hrm.repository.RoleRepository;
import com.workforce.hrm.repository.UserRepository;

@Component
@Order(4)
public class SuperAdminSeeder implements CommandLineRunner {

    private static final Logger log =
            LoggerFactory.getLogger(SuperAdminSeeder.class);

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    public SuperAdminSeeder(UserRepository userRepository,
                            RoleRepository roleRepository,
                            PasswordEncoder passwordEncoder) {

        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        if (userRepository.findByEmail("admin@gmail.com").isPresent()) {
            log.info("Super Admin already exists. Skipping SuperAdmin Seeder.");
            return;
        }

        Role superAdminRole = roleRepository.findByRoleName("SUPER_ADMIN")
                .orElseThrow(() ->
                        new RuntimeException("SUPER_ADMIN role not found. Run RoleSeeder first."));

        User user = new User();

        user.setFullName("Super Admin");
        user.setEmail("admin@gmail.com");

        // Default Password
        user.setPassword(passwordEncoder.encode("admin123"));

        user.setRole(superAdminRole);

        user.setActive(true);
        user.setEnabled(true);
        user.setAccountLocked(false);
        user.setAccountExpired(false);
        user.setCredentialsExpired(false);
        user.setFailedAttempts(0);

        userRepository.save(user);

        log.info("=======================================");
        log.info("SUPER ADMIN CREATED SUCCESSFULLY");
        log.info("Email    : admin@gmail.com");
        log.info("Password : admin123");
        log.info("=======================================");
    }
}