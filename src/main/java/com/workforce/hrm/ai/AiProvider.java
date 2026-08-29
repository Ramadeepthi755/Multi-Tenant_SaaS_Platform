package com.workforce.hrm.ai;

import java.util.List;
import java.util.Map;

public interface AiProvider {

    String getProviderName();

    boolean isAvailable();

    String generateText(String systemPrompt, String userPrompt);

    String generateJobDescription(String roleTitle, String department, String skills, String experience);

    String screenCandidate(String candidateName, String skills, String experience, String jobTitle, String jobRequirements);

    String summarizePerformance(String employeeName, String designation, String department, Double rating, List<String> reviewNotes);

    String answerPolicyQuestion(String question, List<String> policyChunks);
}
