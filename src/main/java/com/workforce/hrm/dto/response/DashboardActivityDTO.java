package com.workforce.hrm.dto.response;

import java.time.LocalDateTime;

public class DashboardActivityDTO {
    private String title;
    private String description;
    private String module;
    private LocalDateTime occurredAt;

    public DashboardActivityDTO() { }

    public DashboardActivityDTO(String title, String description, String module, LocalDateTime occurredAt) {
        this.title = title;
        this.description = description;
        this.module = module;
        this.occurredAt = occurredAt;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getModule() { return module; }
    public void setModule(String module) { this.module = module; }
    public LocalDateTime getOccurredAt() { return occurredAt; }
    public void setOccurredAt(LocalDateTime occurredAt) { this.occurredAt = occurredAt; }
}
