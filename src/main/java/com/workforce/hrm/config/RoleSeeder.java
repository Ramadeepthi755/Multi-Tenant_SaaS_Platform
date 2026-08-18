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

        if (roleRepository.count() > 0) {
            log.info("Roles already exist. Skipping Role Seeder.");
            return;
        }

        createRole("SUPER_ADMIN", "System Super Administrator");
        createRole("COMPANY_ADMIN", "Company Administrator");
        createRole("HR", "Human Resources");
        createRole("MANAGER", "Department Manager");
        createRole("EMPLOYEE", "Employee");

        log.info("Default Roles Created Successfully.");
    }

    private void createRole(String roleName, String description) {

        Role role = new Role();

        role.setRoleName(roleName);
        role.setDescription(description);
        role.setActive(true);

        roleRepository.save(role);

        log.info("{} role created.", roleName);
    }
}