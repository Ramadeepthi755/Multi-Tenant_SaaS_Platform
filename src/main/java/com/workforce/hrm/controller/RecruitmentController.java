package com.workforce.hrm.controller;

import java.util.Map;

import org.springframework.core.io.ByteArrayResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.workforce.hrm.dto.request.CandidateRequest;
import com.workforce.hrm.dto.request.InterviewRequest;
import com.workforce.hrm.dto.request.JobOpeningRequest;
import com.workforce.hrm.dto.request.OfferRequest;
import com.workforce.hrm.dto.response.CandidateResponse;
import com.workforce.hrm.dto.response.InterviewResponse;
import com.workforce.hrm.dto.response.JobOpeningResponse;
import com.workforce.hrm.service.RecruitmentService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/recruitment")
@Validated
public class RecruitmentController {

    private final RecruitmentService recruitmentService;

    public RecruitmentController(RecruitmentService recruitmentService) {
        this.recruitmentService = recruitmentService;
    }

    @GetMapping("/jobs")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','COMPANY_ADMIN','HR','MANAGER')")
    public Page<JobOpeningResponse> getJobs(@RequestParam(required = false) String keyword,
                                            @RequestParam(required = false) Long departmentId,
                                            @RequestParam(required = false) String status,
                                            @RequestParam(defaultValue = "0") int page,
                                            @RequestParam(defaultValue = "20") int size) {
        return recruitmentService.getJobs(keyword, departmentId, status, pageable(page, size));
    }

    @GetMapping("/jobs/search")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','COMPANY_ADMIN','HR','MANAGER')")
    public Page<JobOpeningResponse> searchJobs(@RequestParam String keyword,
                                               @RequestParam(defaultValue = "0") int page,
                                               @RequestParam(defaultValue = "20") int size) {
        return recruitmentService.getJobs(keyword, null, null, pageable(page, size));
    }

    @GetMapping("/jobs/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','COMPANY_ADMIN','HR','MANAGER')")
    public JobOpeningResponse getJob(@PathVariable Long id) {
        return recruitmentService.getJob(id);
    }

    @PostMapping("/jobs")
    @PreAuthorize("hasAnyRole('COMPANY_ADMIN','HR')")
    public ResponseEntity<JobOpeningResponse> createJob(@Valid @RequestBody JobOpeningRequest request) {
        return ResponseEntity.status(201).body(recruitmentService.createJob(request));
    }

    @PutMapping("/jobs/{id}")
    @PreAuthorize("hasAnyRole('COMPANY_ADMIN','HR')")
    public JobOpeningResponse updateJob(@PathVariable Long id, @Valid @RequestBody JobOpeningRequest request) {
        return recruitmentService.updateJob(id, request);
    }

    @PutMapping("/jobs/{id}/close")
    @PreAuthorize("hasAnyRole('COMPANY_ADMIN','HR')")
    public JobOpeningResponse closeJob(@PathVariable Long id) {
        return recruitmentService.closeJob(id);
    }

    @PutMapping("/jobs/{id}/reopen")
    @PreAuthorize("hasAnyRole('COMPANY_ADMIN','HR')")
    public JobOpeningResponse reopenJob(@PathVariable Long id) {
        return recruitmentService.reopenJob(id);
    }

    @DeleteMapping("/jobs/{id}")
    @PreAuthorize("hasAnyRole('COMPANY_ADMIN','HR')")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        recruitmentService.deleteJob(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/candidates")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','COMPANY_ADMIN','HR','MANAGER')")
    public Page<CandidateResponse> getCandidates(@RequestParam(required = false) String keyword,
                                                 @RequestParam(required = false) String status,
                                                 @RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "20") int size) {
        return recruitmentService.getCandidates(keyword, status, pageable(page, size));
    }

    @GetMapping("/candidates/search")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','COMPANY_ADMIN','HR','MANAGER')")
    public Page<CandidateResponse> searchCandidates(@RequestParam String keyword,
                                                    @RequestParam(defaultValue = "0") int page,
                                                    @RequestParam(defaultValue = "20") int size) {
        return recruitmentService.getCandidates(keyword, null, pageable(page, size));
    }

    @GetMapping("/candidates/{id}")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','COMPANY_ADMIN','HR','MANAGER')")
    public CandidateResponse getCandidate(@PathVariable Long id) {
        return recruitmentService.getCandidate(id);
    }

    @PostMapping("/candidates")
    @PreAuthorize("hasAnyRole('COMPANY_ADMIN','HR')")
    public ResponseEntity<CandidateResponse> createCandidate(@Valid @RequestBody CandidateRequest request) {
        return ResponseEntity.status(201).body(recruitmentService.createCandidate(request));
    }

    @PutMapping("/candidates/{id}")
    @PreAuthorize("hasAnyRole('COMPANY_ADMIN','HR')")
    public CandidateResponse updateCandidate(@PathVariable Long id, @Valid @RequestBody CandidateRequest request) {
        return recruitmentService.updateCandidate(id, request);
    }

    @PutMapping("/candidates/{id}/status")
    @PreAuthorize("hasAnyRole('COMPANY_ADMIN','HR')")
    public CandidateResponse updateCandidateStatus(@PathVariable Long id, @RequestBody Map<String, String> payload) {
        String statusStr = payload.get("status");
        CandidateResponse existing = recruitmentService.getCandidate(id);
        com.workforce.hrm.enums.CandidateStatus targetStatus = statusStr != null
                ? com.workforce.hrm.enums.CandidateStatus.valueOf(statusStr.toUpperCase())
                : existing.status();

        CandidateRequest req = new CandidateRequest(
                existing.fullName(),
                existing.email(),
                existing.phone(),
                existing.experience(),
                existing.skills(),
                existing.currentCompany(),
                existing.expectedSalary(),
                existing.noticePeriod(),
                targetStatus
        );
        return recruitmentService.updateCandidate(id, req);
    }

    @PostMapping(value = "/candidates/{id}/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    @PreAuthorize("hasAnyRole('COMPANY_ADMIN','HR')")
    public CandidateResponse uploadResume(@PathVariable Long id, @RequestPart("file") MultipartFile file) {
        return recruitmentService.uploadResume(id, file);
    }

    @GetMapping("/candidates/{id}/resume")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','COMPANY_ADMIN','HR','MANAGER')")
    public ResponseEntity<ByteArrayResource> downloadResume(@PathVariable Long id) {
        byte[] bytes = recruitmentService.downloadResume(id);
        String fileName = recruitmentService.getResumeFileName(id);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_OCTET_STREAM)
                .header(HttpHeaders.CONTENT_DISPOSITION, ContentDisposition.attachment().filename(fileName).build().toString())
                .body(new ByteArrayResource(bytes));
    }

    @DeleteMapping("/candidates/{id}")
    @PreAuthorize("hasAnyRole('COMPANY_ADMIN','HR')")
    public ResponseEntity<Void> deleteCandidate(@PathVariable Long id) {
        recruitmentService.deleteCandidate(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/interviews")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','COMPANY_ADMIN','HR','MANAGER')")
    public Page<InterviewResponse> getInterviews(@RequestParam(required = false) String keyword,
                                                 @RequestParam(required = false) String interviewType,
                                                 @RequestParam(required = false) String status,
                                                 @RequestParam(defaultValue = "0") int page,
                                                 @RequestParam(defaultValue = "20") int size) {
        return recruitmentService.getInterviews(keyword, interviewType, status, pageable(page, size));
    }

    @PostMapping("/interviews")
    @PreAuthorize("hasAnyRole('COMPANY_ADMIN','HR')")
    public ResponseEntity<InterviewResponse> createInterview(@Valid @RequestBody InterviewRequest request) {
        return ResponseEntity.status(201).body(recruitmentService.createInterview(request));
    }

    @PutMapping("/interviews/{id}")
    @PreAuthorize("hasAnyRole('COMPANY_ADMIN','HR')")
    public InterviewResponse updateInterview(@PathVariable Long id, @Valid @RequestBody InterviewRequest request) {
        return recruitmentService.updateInterview(id, request);
    }

    @DeleteMapping("/interviews/{id}")
    @PreAuthorize("hasAnyRole('COMPANY_ADMIN','HR')")
    public ResponseEntity<Void> deleteInterview(@PathVariable Long id) {
        recruitmentService.deleteInterview(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/offer")
    @PreAuthorize("hasAnyRole('COMPANY_ADMIN','HR')")
    public Map<String, Object> generateOffer(@Valid @RequestBody OfferRequest request) {
        return recruitmentService.generateOffer(request);
    }

    @GetMapping("/offer/{candidateId}/download")
    @PreAuthorize("hasAnyRole('COMPANY_ADMIN','HR')")
    public ResponseEntity<byte[]> downloadOffer(@PathVariable Long candidateId) {
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=offer-" + candidateId + ".pdf")
                .body(recruitmentService.downloadOffer(candidateId));
    }

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyRole('SUPER_ADMIN','COMPANY_ADMIN','HR','MANAGER')")
    public Map<String, Object> dashboard() {
        return recruitmentService.getDashboard();
    }

    private Pageable pageable(int page, int size) {
        int normalizedPage = Math.max(page, 0);
        int normalizedSize = Math.min(Math.max(size, 1), 100);
        return PageRequest.of(normalizedPage, normalizedSize, Sort.by(Sort.Direction.DESC, "createdAt"));
    }
}
