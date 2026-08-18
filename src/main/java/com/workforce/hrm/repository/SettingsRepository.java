package com.workforce.hrm.repository;

import com.workforce.hrm.entity.Settings;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SettingsRepository
        extends JpaRepository<Settings, Long> {

    Optional<Settings> findByCategoryAndCompanyId(
            String category,
            Long companyId
    );
}