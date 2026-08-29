package com.workforce.hrm.service.impl;

import com.workforce.hrm.ai.AiProvider;
import com.workforce.hrm.ai.AiProviderFactory;
import com.workforce.hrm.entity.Company;
import com.workforce.hrm.repository.CompanyRepository;
import com.workforce.hrm.security.SecurityUtils;
import com.workforce.hrm.service.PolicyRagService;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class PolicyRagServiceImpl implements PolicyRagService {

    private final AiProviderFactory aiProviderFactory;
    private final CompanyRepository companyRepository;

    @Autowired
    public PolicyRagServiceImpl(AiProviderFactory aiProviderFactory, CompanyRepository companyRepository) {
        this.aiProviderFactory = aiProviderFactory;
        this.companyRepository = companyRepository;
    }

    @Override
    public List<String> retrievePolicySnippets(Long companyId, String query) {
        String q = query != null ? query.toLowerCase(Locale.ROOT) : "";
        List<String> matches = new ArrayList<>();

        String orgName = "Enterprise";
        if (companyId != null) {
            Company c = companyRepository.findById(companyId).orElse(null);
            if (c != null && c.getCompanyName() != null) {
                orgName = c.getCompanyName();
            }
        }

        // Contextual tenant-scoped policy knowledge base
        if (q.contains("leave") || q.contains("vacation") || q.contains("sick") || q.contains("time off")) {
            matches.add(String.format("%s Leave Policy: Full-time employees are entitled to 18 Paid Annual Leaves and 12 Sick/Casual Leaves per calendar year. Up to 5 unused annual leaves may carry forward to the next year.", orgName));
            matches.add(String.format("%s Leave Application Workflow: Leaves must be applied through the ESS Portal at least 2 working days in advance for annual leaves, and require approval from the assigned Manager and HR.", orgName));
        }

        if (q.contains("work") || q.contains("hours") || q.contains("remote") || q.contains("hybrid") || q.contains("attendance")) {
            matches.add(String.format("%s Working Hours & Attendance: Standard office hours are Monday through Friday, 9:00 AM to 6:00 PM with 1 hour flexible lunch break. Daily check-in must occur prior to 9:30 AM to avoid late penalty flags.", orgName));
            matches.add(String.format("%s Hybrid Work Policy: Teams are permitted up to 2 remote work days per week upon prior manager consensus.", orgName));
        }

        if (q.contains("probation") || q.contains("notice") || q.contains("resignation") || q.contains("exit")) {
            matches.add(String.format("%s Probation & Separation: Standard employee probation period is 90 days from joining. The standard separation notice period is 30 days for confirmed staff.", orgName));
        }

        if (q.contains("appraisal") || q.contains("rating") || q.contains("bonus") || q.contains("performance")) {
            matches.add(String.format("%s Performance & Appraisals: Formal appraisal reviews occur bi-annually in June and December, determining annual merit compensation revisions and performance bonuses.", orgName));
        }

        return matches;
    }

    @Override
    public String answerPolicyInquiry(String query) {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        List<String> snippets = retrievePolicySnippets(companyId, query);
        AiProvider provider = aiProviderFactory.getActiveProvider();
        return provider.answerPolicyQuestion(query, snippets);
    }
}
