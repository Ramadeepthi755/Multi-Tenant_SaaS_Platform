package com.workforce.hrm.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component("geminiAiProvider")
public class GeminiAiProvider implements AiProvider {

    private static final Logger log = LoggerFactory.getLogger(GeminiAiProvider.class);
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    @Value("${app.ai.gemini.api-key:${GEMINI_API_KEY:}}")
    private String apiKey;

    @Value("${app.ai.gemini.model:gemini-1.5-flash}")
    private String model;

    public GeminiAiProvider() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public String getProviderName() {
        return "GEMINI";
    }

    @Override
    public boolean isAvailable() {
        return apiKey != null && !apiKey.trim().isEmpty();
    }

    @Override
    public String generateText(String systemPrompt, String userPrompt) {
        if (!isAvailable()) {
            throw new IllegalStateException("Google Gemini API key is not configured.");
        }

        try {
            String url = String.format("https://generativelanguage.googleapis.com/v1beta/models/%s:generateContent?key=%s", model, apiKey.trim());

            Map<String, Object> textPart = Map.of("text", (systemPrompt != null ? systemPrompt + "\n\n" : "") + userPrompt);
            Map<String, Object> contentMap = Map.of("parts", List.of(textPart));
            Map<String, Object> requestBody = Map.of("contents", List.of(contentMap));

            String jsonPayload = objectMapper.writeValueAsString(requestBody);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(url))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .timeout(Duration.ofSeconds(25))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() >= 200 && response.statusCode() < 300) {
                JsonNode root = objectMapper.readTree(response.body());
                return root.path("candidates").path(0).path("content").path("parts").path(0).path("text").asText();
            } else {
                log.error("Gemini API error HTTP {}: {}", response.statusCode(), response.body());
                throw new RuntimeException("Gemini API returned status " + response.statusCode());
            }
        } catch (Exception e) {
            log.error("Error communicating with Gemini API: {}", e.getMessage());
            throw new RuntimeException("Gemini invocation failed: " + e.getMessage(), e);
        }
    }

    @Override
    public String generateJobDescription(String roleTitle, String department, String skills, String experience) {
        String systemPrompt = "You are an enterprise HR recruitment expert. Produce comprehensive, well-structured job descriptions.";
        String userPrompt = String.format("Job Title: %s\nDepartment: %s\nExperience: %s\nSkills: %s\n\nGenerate full Job Description.", roleTitle, department, experience, skills);
        return generateText(systemPrompt, userPrompt);
    }

    @Override
    public String screenCandidate(String candidateName, String skills, String experience, String jobTitle, String jobRequirements) {
        String systemPrompt = "You are an expert AI recruiter evaluating candidate resumes for hiring managers.";
        String userPrompt = String.format("Candidate: %s\nSkills: %s\nExperience: %s\nJob Title: %s\nJob Requirements: %s\n\nProvide structured candidate evaluation with match score and strengths/gaps.", candidateName, skills, experience, jobTitle, jobRequirements);
        return generateText(systemPrompt, userPrompt);
    }

    @Override
    public String summarizePerformance(String employeeName, String designation, String department, Double rating, List<String> reviewNotes) {
        String systemPrompt = "You are an HR leadership advisor creating constructive, objective performance summaries.";
        String userPrompt = String.format("Employee: %s\nDesignation: %s\nDepartment: %s\nRating: %.1f\nNotes: %s\n\nGenerate appraisal summary and growth suggestions.", employeeName, designation, department, rating != null ? rating : 4.0, String.join("; ", reviewNotes));
        return generateText(systemPrompt, userPrompt);
    }

    @Override
    public String answerPolicyQuestion(String question, List<String> policyChunks) {
        String systemPrompt = "You are an authorized HR Policy Assistant. Answer only with the provided context. If no relevant info exists, reply 'I couldn't find this information in your company's policy documents.'";
        String userPrompt = String.format("Context:\n%s\n\nQuestion: %s", String.join("\n---\n", policyChunks), question);
        return generateText(systemPrompt, userPrompt);
    }
}
