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
        String p = (userPrompt != null) ? userPrompt.toLowerCase(java.util.Locale.ROOT).trim() : "";

        if (p.contains("retention") || p.contains("turnover") || p.contains("attrition")) {
            return "### Enterprise Employee Retention Best Practices\n\n" +
                   "1. **Competitive Total Rewards & Regular Market Benchmarking**: Align base pay, performance bonuses, and health benefits to market percentiles to eliminate compensation-driven attrition.\n" +
                   "2. **Structured Career Progression & Growth Pathways**: Establish transparent promotion matrices, individualized development plans (IDPs), and internal mobility opportunities.\n" +
                   "3. **Proactive Recognition & Transparent Culture**: Implement regular 1-on-1 check-ins, continuous feedback cycles, and wellness/work-life balance initiatives to boost employee engagement.\n\n" +
                   "*(Mode: Analytical Rule Engine)*";
        }

        if (p.contains("leave") || p.contains("vacation") || p.contains("time off") || p.contains("sick")) {
            return "### Standard Company Leave Guidelines\n\n" +
                   "• **Annual Leave Entitlement**: 18 Paid Annual Leaves + 12 Casual/Sick Leaves per calendar year.\n" +
                   "• **Application SLA**: Apply at least 2 business days in advance via the ESS Portal.\n" +
                   "• **Approval Workflow**: Requires one-click review and signoff from both your direct Line Manager and Department HR.\n" +
                   "• **Carryover Rule**: Up to 5 unused annual leave days roll forward into the subsequent calendar year.\n\n" +
                   "*(Mode: Analytical Rule Engine)*";
        }

        if (p.contains("recruitment") || p.contains("hiring") || p.contains("interview") || p.contains("candidate") || p.contains("job")) {
            return "### Enterprise Recruitment & Talent Acquisition Workflow\n\n" +
                   "1. **Requisition & Job Posting**: Define required competencies, compensation band, and publish across internal and external boards.\n" +
                   "2. **Automated Candidate Screening**: Resume screening checks core skill alignment, experience benchmarks, and compliance criteria.\n" +
                   "3. **Structured Interview Stages**: Conduct technical evaluation, cultural assessment, and manage feedback loops directly in the Recruitment Kanban.\n" +
                   "4. **Offer Generation & Onboarding**: Generate digital offer letters and initiate automated employee profile onboarding upon acceptance.\n\n" +
                   "*(Mode: Analytical Rule Engine)*";
        }

        if (p.contains("attendance") || p.contains("working hours") || p.contains("shift") || p.contains("anomaly")) {
            return "### Workforce Attendance & Hours Policy Overview\n\n" +
                   "• **Core Office Hours**: Monday through Friday, 09:00 AM – 06:00 PM with a 1-hour flexible meal window.\n" +
                   "• **Grace Period**: Check-in prior to 09:30 AM is recorded as on-time. Check-ins after 09:30 AM are flagged for supervisor review.\n" +
                   "• **Hybrid / Remote Work**: Up to 2 remote working days per week with prior manager approval.\n" +
                   "• **Real-Time Monitoring**: Daily attendance rosters, late marks, and half-day calculations are automatically synchronized in the Attendance module.\n\n" +
                   "*(Mode: Analytical Rule Engine)*";
        }

        if (p.contains("payroll") || p.contains("salary") || p.contains("payslip") || p.contains("compensation") || p.contains("bonus")) {
            return "### Payroll & Compensation Management Summary\n\n" +
                   "• **Disbursement Cycle**: Monthly payroll is processed on the 28th and credited on the final business day of the month.\n" +
                   "• **Components**: Gross Salary = Base Pay + HRA + Allowances - Statutory Deductions (Tax / PF / Insurance).\n" +
                   "• **Payslips**: Digital payslips with itemized deductions are generated and available for download in the ESS Portal immediately following approval.\n\n" +
                   "*(Mode: Analytical Rule Engine)*";
        }

        if (p.contains("headcount") || p.contains("employee count") || p.contains("how many")) {
            return "### Workforce Demographics & Headcount Overview\n\n" +
                   "• **Directory**: Use the Employee Management tab to view active headcount, departmental distribution, and designation hierarchies.\n" +
                   "• **Analytics**: Real-time workforce metrics and tenant headcounts are tracked dynamically on the Executive Dashboard.\n\n" +
                   "*(Mode: Analytical Rule Engine)*";
        }

        return "### HRM Enterprise Copilot Assistant\n\n" +
               "I am your enterprise HR Assistant. I can assist you with:\n" +
               "• **Workforce Management**: Headcount analytics, employee onboarding, and profile records.\n" +
               "• **Leave & Attendance**: Leave balances, application workflows, and attendance anomaly tracking.\n" +
               "• **Recruitment & Hiring**: Job description generation, resume screening, and interview pipelines.\n" +
               "• **Performance & Payroll**: Appraisal reviews, compensation benchmarks, and policy Q&A.\n\n" +
               "*(Mode: Analytical Rule Engine)*";
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
