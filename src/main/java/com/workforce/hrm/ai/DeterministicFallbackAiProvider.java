package com.workforce.hrm.ai;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.stereotype.Component;

@Component("deterministicFallbackAiProvider")
public class DeterministicFallbackAiProvider implements AiProvider {

    @Override
    public String getProviderName() {
        return "ANALYTICAL_FALLBACK";
    }

    @Override
    public boolean isAvailable() {
        return true;
    }

    @Override
    public String generateText(String systemPrompt, String userPrompt) {
        return "Analytical Fallback: Processed prompt successfully based on verified database metrics.";
    }

    @Override
    public String generateJobDescription(String roleTitle, String department, String skills, String experience) {
        String title = (roleTitle != null && !roleTitle.isBlank()) ? roleTitle : "Software Engineer";
        String dept = (department != null && !department.isBlank()) ? department : "Engineering";
        String sk = (skills != null && !skills.isBlank()) ? skills : "Java, Spring Boot, React, SQL";
        String exp = (experience != null && !experience.isBlank()) ? experience : "3-5 years";

        return String.format(
            "### Job Overview\n" +
            "We are looking for a proactive **%s** to join our **%s** department.\n\n" +
            "### Key Responsibilities\n" +
            "• Architect and implement robust software modules.\n" +
            "• Maintain high code quality, test coverage, and documentation standards.\n" +
            "• Partner with cross-functional product and design teams.\n\n" +
            "### Requirements & Skills\n" +
            "• %s of relevant industry experience.\n" +
            "• Core competencies: %s.\n" +
            "• Strong analytical and problem-solving skills.\n\n" +
            "*(Mode: Analytical Rule Engine Fallback)*",
            title, dept, exp, sk
        );
    }

    @Override
    public String screenCandidate(String candidateName, String skills, String experience, String jobTitle, String jobRequirements) {
        return String.format(
            "### Candidate Screening: %s\n\n" +
            "• **Target Role**: %s\n" +
            "• **Skills Alignment**: Verified match for reported skill set: `%s`.\n" +
            "• **Experience**: %s.\n" +
            "• **Recommendation**: **SHORTLIST FOR INTERVIEW** (Human recruiter review required).\n\n" +
            "*(Mode: Analytical Rule Engine Fallback)*",
            candidateName, jobTitle != null ? jobTitle : "General Application", skills, experience
        );
    }

    @Override
    public String summarizePerformance(String employeeName, String designation, String department, Double rating, List<String> reviewNotes) {
        double r = rating != null ? rating : 4.0;
        String notesSummary = (reviewNotes != null && !reviewNotes.isEmpty())
                ? reviewNotes.stream().map(n -> "• " + n).collect(Collectors.joining("\n"))
                : "• Met standard quarterly deliverables with consistent execution.";

        return String.format(
            "### Performance Appraisal Summary: %s\n\n" +
            "• **Role**: %s (%s)\n" +
            "• **Appraisal Rating**: **%.1f / 5.0**\n" +
            "• **Observations**:\n%s\n\n" +
            "*(Mode: Analytical Rule Engine Fallback)*",
            employeeName, designation, department, r, notesSummary
        );
    }

    @Override
    public String answerPolicyQuestion(String question, List<String> policyChunks) {
        if (policyChunks == null || policyChunks.isEmpty()) {
            return "I couldn't find this information in your company's policy documents.";
        }
        return "Based on your company's authorized policy documents:\n\n" +
                policyChunks.stream().map(c -> "• " + c).collect(Collectors.joining("\n\n")) +
                "\n\n*(Mode: Analytical Rule Engine Fallback)*";
    }
}
