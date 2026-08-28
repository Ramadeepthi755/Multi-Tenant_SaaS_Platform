package com.workforce.hrm.dto.response;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * A role-scoped dashboard payload. The server owns both the role decision and
 * the data scope; clients never submit a company id or employee id to obtain
 * dashboard information.
 */
public class RoleDashboardResponseDTO {

    private String role;
    private String scopeLabel;
    private String companyName;
    private LocalDateTime generatedAt;
    private Map<String, Long> metrics = new LinkedHashMap<>();
    private Map<String, String> details = new LinkedHashMap<>();
    private Map<String, List<ChartDataDTO>> charts = new LinkedHashMap<>();
    private List<DashboardActivityDTO> activities = new ArrayList<>();
    private List<DashboardAttentionDTO> attention = new ArrayList<>();
    private List<DashboardItemDTO> items = new ArrayList<>();

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    public String getScopeLabel() { return scopeLabel; }
    public void setScopeLabel(String scopeLabel) { this.scopeLabel = scopeLabel; }
    public String getCompanyName() { return companyName; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
    public Map<String, Long> getMetrics() { return metrics; }
    public void setMetrics(Map<String, Long> metrics) { this.metrics = metrics; }
    public Map<String, String> getDetails() { return details; }
    public void setDetails(Map<String, String> details) { this.details = details; }
    public Map<String, List<ChartDataDTO>> getCharts() { return charts; }
    public void setCharts(Map<String, List<ChartDataDTO>> charts) { this.charts = charts; }
    public List<DashboardActivityDTO> getActivities() { return activities; }
    public void setActivities(List<DashboardActivityDTO> activities) { this.activities = activities; }
    public List<DashboardAttentionDTO> getAttention() { return attention; }
    public void setAttention(List<DashboardAttentionDTO> attention) { this.attention = attention; }
    public List<DashboardItemDTO> getItems() { return items; }
    public void setItems(List<DashboardItemDTO> items) { this.items = items; }
}
