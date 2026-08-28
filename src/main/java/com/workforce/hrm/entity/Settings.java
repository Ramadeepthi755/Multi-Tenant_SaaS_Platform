package com.workforce.hrm.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "settings",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_settings_category_company",
            columnNames = {"category", "company_id"}
        )
    }
)
public class Settings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "company_id")
    private Long companyId;

    @Lob
    @Column(
        name = "settings_json",
        nullable = false
    )
    private String settingsJson;

    @Column(
        name = "created_at",
        nullable = false,
        updatable = false
    )
    private LocalDateTime createdAt;

    @Column(
        name = "updated_at",
        nullable = false
    )
    private LocalDateTime updatedAt;

    public Settings() {
    }

    public Settings(
            String category,
            Long companyId,
            String settingsJson
    ) {
        this.category = category;
        this.companyId = companyId;
        this.settingsJson = settingsJson;
    }

    @PrePersist
    protected void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        this.createdAt = now;
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public String getSettingsJson() {
        return settingsJson;
    }

    public void setSettingsJson(String settingsJson) {
        this.settingsJson = settingsJson;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
}