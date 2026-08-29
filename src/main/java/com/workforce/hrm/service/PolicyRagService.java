package com.workforce.hrm.service;

import java.util.List;

public interface PolicyRagService {
    List<String> retrievePolicySnippets(Long companyId, String query);
    String answerPolicyInquiry(String query);
}
