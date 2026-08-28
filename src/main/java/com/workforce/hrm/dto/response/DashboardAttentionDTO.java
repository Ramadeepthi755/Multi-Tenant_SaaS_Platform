package com.workforce.hrm.dto.response;

public class DashboardAttentionDTO {
    private String title;
    private String description;
    private String path;
    private String severity;

    public DashboardAttentionDTO() { }

    public DashboardAttentionDTO(String title, String description, String path, String severity) {
        this.title = title;
        this.description = description;
        this.path = path;
        this.severity = severity;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
    public String getSeverity() { return severity; }
    public void setSeverity(String severity) { this.severity = severity; }
}
