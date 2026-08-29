package com.workforce.hrm.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component("anthropicAiProvider")
public class AnthropicAiProvider implements AiProvider {

    private static final Logger log = LoggerFactory.getLogger(AnthropicAiProvider.class);
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    @Value("${app.ai.anthropic.api-key:${ANTHROPIC_API_KEY:}}")
    private String apiKey;

    @Value("${app.ai.anthropic.model:claude-3-5-sonnet-20241022}")
    private String model;

    public AnthropicAiProvider() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public String getProviderName() {
        return "ANTHROPIC";
    }

    @Override
    public boolean isAvailable() {
        return apiKey != null && !apiKey.trim().isEmpty();
    }

    @Override
    public String generateText(String systemPrompt, String userPrompt) {
        if (!isAvailable()) {
            throw new IllegalStateException("Anthropic API key is not configured.");
        }

        try {
            Map<String, Object> requestBody = Map.of(
                "model", model,
                "max_tokens", 1024,
                "system", systemPrompt != null ? systemPrompt : "You are an enterprise HR AI Copilot.",
                "messages", List.of(Map.of("role", "user", "content", userPrompt))
            );

            String jsonPayload = objectMapper.writeValueAsString(requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.anthropic.com/v1/messages"))
                    .header("Content-Type", "application/json")
                    .header("x-api-key", apiKey.trim())
                    .header("anthropic-version", "2023-06-01")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .timeout(Duration.ofSeconds(25))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                JsonNode root = objectMapper.readTree(response.body());
                return root.path("content").path(0).path("text").asText();
            } else {
                log.error("Anthropic API error HTTP {}: {}", response.statusCode(), response.body());
                throw new RuntimeException("Anthropic API returned status " + response.statusCode());
            }
        } catch (Exception e) {
            log.error("Error communicating with Anthropic API: {}", e.getMessage());
            throw new RuntimeException("Anthropic invocation failed: " + e.getMessage(), e);
        }
    }

    @Override
    public String generateJobDescription(String roleTitle, String department, String skills, String experience) {
        String systemPrompt = "You are a professional corporate talent acquisition specialist.";
        String userPrompt = String.format("Generate Job Description for %s in %s requiring %s and skills: %s", roleTitle, department, experience, skills);
        return generateText(systemPrompt, userPrompt);
    }

    @Override
    public String screenCandidate(String candidateName, String skills, String experience, String jobTitle, String jobRequirements) {
        String systemPrompt = "You are an expert AI recruiting assistant.";
        String userPrompt = String.format("Candidate: %s\nSkills: %s\nExperience: %s\nJob Title: %s\nRequirements: %s\nScreen candidate.", candidateName, skills, experience, jobTitle, jobRequirements);
        return generateText(systemPrompt, userPrompt);
    }

    @Override
    public String summarizePerformance(String employeeName, String designation, String department, Double rating, List<String> reviewNotes) {
        String systemPrompt = "You are an HR leadership advisor.";
        String userPrompt = String.format("Employee: %s\nDesignation: %s\nDepartment: %s\nRating: %.1f\nNotes: %s\nSummarize performance appraisal.", employeeName, designation, department, rating != null ? rating : 4.0, String.join("; ", reviewNotes));
        return generateText(systemPrompt, userPrompt);
    }

    @Override
    public String answerPolicyQuestion(String question, List<String> policyChunks) {
        String systemPrompt = "You are an HR Policy Copilot. Answer only from authorized context. If not found, say 'I couldn't find this information in your company's policy documents.'";
        String userPrompt = String.format("Context:\n%s\n\nQuestion: %s", String.join("\n---\n", policyChunks), question);
        return generateText(systemPrompt, userPrompt);
    }
}
