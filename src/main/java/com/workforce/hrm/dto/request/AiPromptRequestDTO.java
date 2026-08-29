package com.workforce.hrm.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AiPromptRequestDTO {

    @NotBlank(message = "Prompt content cannot be blank")
    @Size(max = 2000, message = "Prompt cannot exceed 2000 characters")
    private String prompt;

    private String context;

    private String targetModule;

    public AiPromptRequestDTO() {
    }

    public AiPromptRequestDTO(String prompt, String context, String targetModule) {
        this.prompt = prompt;
        this.context = context;
        this.targetModule = targetModule;
    }

    public String getPrompt() { return prompt; }
    public void setPrompt(String prompt) { this.prompt = prompt; }
    public String getContext() { return context; }
    public void setContext(String context) { this.context = context; }
    public String getTargetModule() { return targetModule; }
    public void setTargetModule(String targetModule) { this.targetModule = targetModule; }
}
