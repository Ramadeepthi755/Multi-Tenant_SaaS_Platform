package com.workforce.hrm.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import com.workforce.hrm.entity.Role;
import com.workforce.hrm.repository.RoleRepository;

@Component
@Order(1)
public class RoleSeeder implements CommandLineRunner {

    private static final Logger log = LoggerFactory.getLogger(RoleSeeder.class);

    private final RoleRepository roleRepository;

    public RoleSeeder(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) {
        ensureRole("SUPER_ADMIN", "System Super Administrator");
        ensureRole("COMPANY_ADMIN", "Company Administrator");
        ensureRole("HR", "Human Resources");
        ensureRole("MANAGER", "Department Manager");
        ensureRole("EMPLOYEE", "Employee");

        log.info("Default roles verified successfully.");
    }

    /**
     * Do not use a table-count guard here. A partially initialized database
     * commonly contains only SUPER_ADMIN, which previously prevented every
     * other system role from ever being created.
     */
    private void ensureRole(String roleName, String description) {

        if (roleRepository.existsByRoleName(roleName)) {
            return;
        }

        Role role = new Role();

        role.setRoleName(roleName);
        role.setDescription(description);
        role.setActive(true);

        roleRepository.save(role);

        log.info("{} role created.", roleName);
    }
}
