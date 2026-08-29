package com.workforce.hrm.dto.response;

import java.time.LocalDateTime;

public class PermissionResponseDTO {

    private Long permissionId;
    private String permissionName;
    private String description;
    private String module;
    private LocalDateTime createdAt;

    public PermissionResponseDTO() {
    }

    public PermissionResponseDTO(Long permissionId, String permissionName, String description, String module, LocalDateTime createdAt) {
        this.permissionId = permissionId;
        this.permissionName = permissionName;
        this.description = description;
        this.module = module;
        this.createdAt = createdAt;
    }

    public Long getPermissionId() {
        return permissionId;
    }

    public void setPermissionId(Long permissionId) {
        this.permissionId = permissionId;
    }

    public String getPermissionName() {
        return permissionName;
    }

    public void setPermissionName(String permissionName) {
        this.permissionName = permissionName;
    }

    public String getName() {
        return permissionName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getModule() {
        return module;
    }

    public void setModule(String module) {
        this.module = module;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
