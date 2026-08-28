package com.workforce.hrm.dto.response;

public class DashboardItemDTO {
    private String title;
    private String subtitle;
    private String path;
    private String status;

    public DashboardItemDTO() { }

    public DashboardItemDTO(String title, String subtitle, String path, String status) {
        this.title = title;
        this.subtitle = subtitle;
        this.path = path;
        this.status = status;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    public String getPath() { return path; }
    public void setPath(String path) { this.path = path; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
