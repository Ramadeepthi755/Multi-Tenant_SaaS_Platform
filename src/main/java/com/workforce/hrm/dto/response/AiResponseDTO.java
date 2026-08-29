package com.workforce.hrm.dto.response;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

public class AiResponseDTO {

    private String result;
    private String module;
    private List<String> suggestions;
    private Map<String, Object> metadata;
    private LocalDateTime generatedAt;

    public AiResponseDTO() {
        this.generatedAt = LocalDateTime.now();
    }

    public AiResponseDTO(String result, String module, List<String> suggestions, Map<String, Object> metadata) {
        this.result = result;
        this.module = module;
        this.suggestions = suggestions;
        this.metadata = metadata;
        this.generatedAt = LocalDateTime.now();
    }

    public String getResult() { return result; }
    public void setResult(String result) { this.result = result; }
    public String getModule() { return module; }
    public void setModule(String module) { this.module = module; }
    public List<String> getSuggestions() { return suggestions; }
    public void setSuggestions(List<String> suggestions) { this.suggestions = suggestions; }
    public Map<String, Object> getMetadata() { return metadata; }
    public void setMetadata(Map<String, Object> metadata) { this.metadata = metadata; }
    public LocalDateTime getGeneratedAt() { return generatedAt; }
    public void setGeneratedAt(LocalDateTime generatedAt) { this.generatedAt = generatedAt; }
}
