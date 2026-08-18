package com.workforce.hrm.service.impl;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.workforce.hrm.entity.Settings;
import com.workforce.hrm.repository.SettingsRepository;
import com.workforce.hrm.service.SettingsService;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

@Service
@Transactional
public class SettingsServiceImpl
        implements SettingsService {

    private final SettingsRepository settingsRepository;
    private final ObjectMapper objectMapper;

    public SettingsServiceImpl(
            SettingsRepository settingsRepository,
            ObjectMapper objectMapper
    ) {
        this.settingsRepository = settingsRepository;
        this.objectMapper = objectMapper;
    }

    // =========================================================
    // GET ALL SETTINGS
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getSettings() {

        Map<String, Object> result =
                new LinkedHashMap<>();

        result.put(
                "company",
                getSettings("company")
        );

        result.put(
                "general",
                getSettings("general")
        );

        result.put(
                "attendance",
                getSettings("attendance")
        );

        result.put(
                "leave",
                getSettings("leave")
        );

        result.put(
                "payroll",
                getSettings("payroll")
        );

        result.put(
                "notifications",
                getSettings("notifications")
        );

        result.put(
                "security",
                getSettings("security")
        );

        return result;
    }

    // =========================================================
    // GET SETTINGS BY CATEGORY
    // =========================================================

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getSettings(
            String category
    ) {

        String normalizedCategory =
                normalizeCategory(category);

        Optional<Settings> optional =
                settingsRepository
                        .findByCategoryAndCompanyId(
                                normalizedCategory,
                                null
                        );

        if (optional.isEmpty()) {
            return new LinkedHashMap<>();
        }

        return readJson(
                optional.get().getSettingsJson()
        );
    }

    // =========================================================
    // UPDATE SETTINGS
    // =========================================================

    @Override
    public Map<String, Object> updateSettings(
            String category,
            Map<String, Object> settings
    ) {

        String normalizedCategory =
                normalizeCategory(category);

        Map<String, Object> incoming =
                settings == null
                        ? new LinkedHashMap<>()
                        : new LinkedHashMap<>(settings);

        Optional<Settings> optional =
                settingsRepository
                        .findByCategoryAndCompanyId(
                                normalizedCategory,
                                null
                        );

        Settings entity;

        if (optional.isPresent()) {

            entity = optional.get();

            Map<String, Object> existing =
                    readJson(
                            entity.getSettingsJson()
                    );

            existing.putAll(incoming);

            entity.setSettingsJson(
                    writeJson(existing)
            );

        } else {

            entity = new Settings();

            entity.setCategory(
                    normalizedCategory
            );

            entity.setCompanyId(null);

            entity.setSettingsJson(
                    writeJson(incoming)
            );
        }

        Settings saved =
                settingsRepository.save(entity);

        return readJson(
                saved.getSettingsJson()
        );
    }

    // =========================================================
    // NORMALIZE CATEGORY
    // =========================================================

    private String normalizeCategory(
            String category
    ) {

        if (category == null ||
                category.isBlank()) {

            throw new IllegalArgumentException(
                    "Settings category is required."
            );
        }

        return category
                .trim()
                .toLowerCase();
    }

    // =========================================================
    // JSON -> MAP
    // =========================================================

    private Map<String, Object> readJson(
            String json
    ) {

        if (json == null ||
                json.isBlank()) {

            return new LinkedHashMap<>();
        }

        try {

            return objectMapper.readValue(
                    json,
                    new TypeReference<
                            Map<String, Object>
                    >() {}
            );

        } catch (Exception exception) {

            throw new IllegalStateException(
                    "Unable to read stored settings.",
                    exception
            );
        }
    }

    // =========================================================
    // MAP -> JSON
    // =========================================================

    private String writeJson(
            Map<String, Object> data
    ) {

        try {

            return objectMapper.writeValueAsString(
                    data
            );

        } catch (Exception exception) {

            throw new IllegalStateException(
                    "Unable to save settings.",
                    exception
            );
        }
    }
}