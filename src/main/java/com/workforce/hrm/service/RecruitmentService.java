package com.workforce.hrm.service;

import java.time.LocalDate;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import com.workforce.hrm.dto.request.CandidateRequest;
import com.workforce.hrm.dto.request.InterviewRequest;
import com.workforce.hrm.dto.request.JobOpeningRequest;
import com.workforce.hrm.dto.request.OfferRequest;
import com.workforce.hrm.dto.response.CandidateResponse;
import com.workforce.hrm.dto.response.InterviewResponse;
import com.workforce.hrm.dto.response.JobOpeningResponse;

public interface RecruitmentService {
    Page<JobOpeningResponse> getJobs(String keyword, Long departmentId, String status, Pageable pageable);
    JobOpeningResponse getJob(Long id);
    JobOpeningResponse createJob(JobOpeningRequest request);
    JobOpeningResponse updateJob(Long id, JobOpeningRequest request);
    JobOpeningResponse closeJob(Long id);
    JobOpeningResponse reopenJob(Long id);
    void deleteJob(Long id);

    Page<CandidateResponse> getCandidates(String keyword, String status, Pageable pageable);
    Page<CandidateResponse> getCandidates(String keyword, String status, LocalDate fromDate,
                                          LocalDate toDate, Pageable pageable);
    CandidateResponse getCandidate(Long id);
    CandidateResponse createCandidate(CandidateRequest request);
    CandidateResponse updateCandidate(Long id, CandidateRequest request);
    CandidateResponse uploadResume(Long id, MultipartFile file);
    byte[] downloadResume(Long id);
    String getResumeFileName(Long id);
    void deleteCandidate(Long id);

    Page<InterviewResponse> getInterviews(String keyword, String interviewType, String status, Pageable pageable);
    InterviewResponse createInterview(InterviewRequest request);
    InterviewResponse updateInterview(Long id, InterviewRequest request);
    void deleteInterview(Long id);

    Map<String, Object> generateOffer(OfferRequest request);
    byte[] downloadOffer(Long candidateId);
    Map<String, Object> getDashboard();
}
