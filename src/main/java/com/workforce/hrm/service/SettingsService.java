package com.workforce.hrm.service;

import java.util.Map;

public interface SettingsService {

    Map<String, Object> getSettings();

    Map<String, Object> getSettings(
            String category
    );

    Map<String, Object> updateSettings(
            String category,
            Map<String, Object> settings
    );
}