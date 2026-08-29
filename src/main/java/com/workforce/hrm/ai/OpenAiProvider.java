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

@Component("openAiProvider")
public class OpenAiProvider implements AiProvider {

    private static final Logger log = LoggerFactory.getLogger(OpenAiProvider.class);
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    @Value("${app.ai.openai.api-key:}")
    private String apiKey;

    @Value("${app.ai.openai.model:gpt-4o-mini}")
    private String model;

    public OpenAiProvider() {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(Duration.ofSeconds(10))
                .build();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public String getProviderName() {
        return "OPENAI";
    }

    @Override
    public boolean isAvailable() {
        if (apiKey != null && !apiKey.trim().isEmpty()) {
            return true;
        }
        String envKey = System.getenv("OPENAI_API_KEY");
        return envKey != null && !envKey.trim().isEmpty();
    }

    private String getResolvedApiKey() {
        String rawKey = (apiKey != null && !apiKey.trim().isEmpty()) ? apiKey.trim() : System.getenv("OPENAI_API_KEY");
        if (rawKey == null || rawKey.trim().isEmpty()) {
            throw new IllegalStateException("OpenAI API key is not configured.");
        }
        
        // Sanitize any accidental wrapping or leading/trailing commands
        String sanitized = rawKey.trim();
        if (sanitized.contains("OPENAI_API_KEY=")) {
            int idx = sanitized.indexOf("OPENAI_API_KEY=");
            sanitized = sanitized.substring(idx + "OPENAI_API_KEY=".length()).trim();
            if (sanitized.startsWith("\"") || sanitized.startsWith("'")) {
                sanitized = sanitized.substring(1);
            }
            if (sanitized.endsWith("\"") || sanitized.endsWith("'")) {
                sanitized = sanitized.substring(0, sanitized.length() - 1);
            }
        }
        
        // Remove quotes or newlines
        sanitized = sanitized.replaceAll("[\r\n\t]", "").trim();
        if (sanitized.startsWith("\"") && sanitized.endsWith("\"")) {
            sanitized = sanitized.substring(1, sanitized.length() - 1).trim();
        }
        
        if (sanitized.isEmpty() || sanitized.contains(" ") || (!sanitized.startsWith("sk-") && !sanitized.startsWith("sess-"))) {
            log.warn("Configured OpenAI API key format is invalid or contains unexpected characters. Fallback should be used.");
            throw new IllegalStateException("Configured OpenAI API key is malformed or invalid.");
        }
        return sanitized;
    }

    @Override
    public String generateText(String systemPrompt, String userPrompt) {
        if (!isAvailable()) {
            throw new IllegalStateException("OpenAI API key is not configured.");
        }

        try {
            Map<String, Object> requestBody = new HashMap<>();
            requestBody.put("model", model);
            requestBody.put("messages", List.of(
                Map.of("role", "system", "content", systemPrompt != null ? systemPrompt : "You are an enterprise HR AI Assistant."),
                Map.of("role", "user", "content", userPrompt)
            ));
            requestBody.put("temperature", 0.3);

            String jsonPayload = objectMapper.writeValueAsString(requestBody);

            String resolvedKey = getResolvedApiKey();
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("https://api.openai.com/v1/chat/completions"))
                    .header("Content-Type", "application/json")
                    .header("Authorization", "Bearer " + resolvedKey)
                    .POST(HttpRequest.BodyPublishers.ofString(jsonPayload))
                    .timeout(Duration.ofSeconds(25))
                    .build();

            HttpResponse<String> response = httpClient.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(response.body());
                JsonNode contentNode = root.path("choices").path(0).path("message").path("content");
                if (contentNode.isMissingNode() || contentNode.asText().trim().isEmpty()) {
                    throw new RuntimeException("OpenAI returned an empty content response.");
                }
                return contentNode.asText();
            } else if (response.statusCode() == 401) {
                log.error("OpenAI API authentication failed (HTTP 401). Verify that OPENAI_API_KEY is valid.");
                throw new RuntimeException("OpenAI authentication failed: Invalid or expired API key.");
            } else if (response.statusCode() == 429) {
                log.error("OpenAI API rate limit or quota exceeded (HTTP 429).");
                throw new RuntimeException("OpenAI rate limit or quota exceeded. Please check your OpenAI account billing.");
            } else {
                log.error("OpenAI API returned non-success HTTP status {}", response.statusCode());
                throw new RuntimeException("OpenAI API returned error HTTP " + response.statusCode());
            }
        } catch (java.net.http.HttpTimeoutException e) {
            log.error("OpenAI API connection/read timeout: {}", e.getMessage());
            throw new RuntimeException("OpenAI request timed out. Please try again later.", e);
        } catch (Exception e) {
            log.error("Error communicating with OpenAI API: {}", e.getMessage());
            throw new RuntimeException("OpenAI invocation failed: " + e.getMessage(), e);
        }
    }

    @Override
    public String generateJobDescription(String roleTitle, String department, String skills, String experience) {
        String systemPrompt = "You are an enterprise HR recruiter expert. Generate a polished, professional job description.";
        String userPrompt = String.format("Generate a full job description for role '%s' in department '%s' requiring experience '%s' and skills '%s'. Include overview, responsibilities, requirements, and benefits.", roleTitle, department, experience, skills);
        return generateText(systemPrompt, userPrompt);
    }

    @Override
    public String screenCandidate(String candidateName, String skills, String experience, String jobTitle, String jobRequirements) {
        String systemPrompt = "You are an AI recruiting assistant. Provide structured resume screening recommendations.";
        String userPrompt = String.format("Screen candidate '%s' with skills '%s' and experience '%s' against job '%s' with requirements '%s'. Provide matching score (0-100%%), strengths, gaps, interview focus questions, and recommendation.", candidateName, skills, experience, jobTitle, jobRequirements);
        return generateText(systemPrompt, userPrompt);
    }

    @Override
    public String summarizePerformance(String employeeName, String designation, String department, Double rating, List<String> reviewNotes) {
        String systemPrompt = "You are an executive HR talent manager assisting performance appraisals.";
        String userPrompt = String.format("Summarize performance for employee '%s' (%s - %s) with rating %.1f/5.0 and review notes: %s. Highlight strengths, development opportunities, and actionable discussion points.", employeeName, designation, department, rating != null ? rating : 4.0, String.join("; ", reviewNotes));
        return generateText(systemPrompt, userPrompt);
    }

    @Override
    public String answerPolicyQuestion(String question, List<String> policyChunks) {
        String systemPrompt = "You are an HR Policy Copilot. Answer questions strictly using the provided authorized company policy context. If the answer is not in the context, explicitly say 'I couldn't find this information in your company's policy documents.'";
        String userPrompt = String.format("Context:\n%s\n\nQuestion: %s", String.join("\n---\n", policyChunks), question);
        return generateText(systemPrompt, userPrompt);
    }
}
