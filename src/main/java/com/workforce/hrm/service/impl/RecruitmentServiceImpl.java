package com.workforce.hrm.service.impl;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.lowagie.text.Document;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import com.workforce.hrm.dto.request.CandidateRequest;
import com.workforce.hrm.dto.request.InterviewRequest;
import com.workforce.hrm.dto.request.JobOpeningRequest;
import com.workforce.hrm.dto.request.OfferRequest;
import com.workforce.hrm.dto.response.CandidateResponse;
import com.workforce.hrm.dto.response.InterviewResponse;
import com.workforce.hrm.dto.response.JobOpeningResponse;
import com.workforce.hrm.entity.Candidate;
import com.workforce.hrm.entity.Company;
import com.workforce.hrm.entity.Department;
import com.workforce.hrm.entity.Interview;
import com.workforce.hrm.entity.JobOpening;
import com.workforce.hrm.entity.User;
import com.workforce.hrm.enums.CandidateStatus;
import com.workforce.hrm.enums.InterviewStatus;
import com.workforce.hrm.enums.InterviewType;
import com.workforce.hrm.enums.JobStatus;
import com.workforce.hrm.exception.FileStorageException;
import com.workforce.hrm.exception.ResourceNotFoundException;
import com.workforce.hrm.repository.CandidateRepository;
import com.workforce.hrm.repository.CompanyRepository;
import com.workforce.hrm.repository.DepartmentRepository;
import com.workforce.hrm.repository.InterviewRepository;
import com.workforce.hrm.repository.JobOpeningRepository;
import com.workforce.hrm.repository.UserRepository;
import com.workforce.hrm.security.SecurityUtils;
import com.workforce.hrm.service.AuditLogService;
import com.workforce.hrm.service.RecruitmentService;

@Service
@Transactional
public class RecruitmentServiceImpl implements RecruitmentService {

    private final JobOpeningRepository jobRepository;
    private final CandidateRepository candidateRepository;
    private final InterviewRepository interviewRepository;
    private final CompanyRepository companyRepository;
    private final DepartmentRepository departmentRepository;
    private final UserRepository userRepository;
    private final AuditLogService auditLogService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    public RecruitmentServiceImpl(JobOpeningRepository jobRepository,
                                  CandidateRepository candidateRepository,
                                  InterviewRepository interviewRepository,
                                  CompanyRepository companyRepository,
                                  DepartmentRepository departmentRepository,
                                  UserRepository userRepository,
                                  AuditLogService auditLogService) {
        this.jobRepository = jobRepository;
        this.candidateRepository = candidateRepository;
        this.interviewRepository = interviewRepository;
        this.companyRepository = companyRepository;
        this.departmentRepository = departmentRepository;
        this.userRepository = userRepository;
        this.auditLogService = auditLogService;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<JobOpeningResponse> getJobs(String keyword, Long departmentId, String status, Pageable pageable) {
        return jobRepository.search(readCompanyScope(), departmentId, parseJobStatus(status), normalize(keyword), pageable)
                .map(this::toJobResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public JobOpeningResponse getJob(Long id) {
        return toJobResponse(requireJob(id));
    }

    @Override
    public JobOpeningResponse createJob(JobOpeningRequest request) {
        Company company = requireWritableCompany();
        JobOpening job = new JobOpening();
        job.setCompany(company);
        applyJob(job, request, company);
        JobOpening saved = jobRepository.save(job);
        audit("CREATE", "Created job opening " + saved.getJobTitle());
        return toJobResponse(saved);
    }

    @Override
    public JobOpeningResponse updateJob(Long id, JobOpeningRequest request) {
        JobOpening job = requireJob(id);
        applyJob(job, request, job.getCompany());
        JobOpening saved = jobRepository.save(job);
        audit("UPDATE", "Updated job opening " + saved.getJobTitle());
        return toJobResponse(saved);
    }

    @Override
    public JobOpeningResponse closeJob(Long id) {
        JobOpening job = requireJob(id);
        job.setStatus(JobStatus.CLOSED);
        audit("CLOSE", "Closed job opening " + job.getJobTitle());
        return toJobResponse(jobRepository.save(job));
    }

    @Override
    public JobOpeningResponse reopenJob(Long id) {
        JobOpening job = requireJob(id);
        job.setStatus(JobStatus.OPEN);
        audit("REOPEN", "Reopened job opening " + job.getJobTitle());
        return toJobResponse(jobRepository.save(job));
    }

    @Override
    public void deleteJob(Long id) {
        JobOpening job = requireJob(id);
        String title = job.getJobTitle();
        jobRepository.delete(job);
        audit("DELETE", "Deleted job opening " + title);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CandidateResponse> getCandidates(String keyword, String status, Pageable pageable) {
        return getCandidates(keyword, status, null, null, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<CandidateResponse> getCandidates(String keyword, String status, LocalDate fromDate,
            LocalDate toDate, Pageable pageable) {
        if (fromDate != null && toDate != null && fromDate.isAfter(toDate)) {
            throw new IllegalArgumentException("From date cannot be after to date");
        }
        return candidateRepository.search(readCompanyScope(), parseCandidateStatus(status), normalize(keyword),
                        fromDate == null ? null : fromDate.atStartOfDay(),
                        toDate == null ? null : toDate.plusDays(1).atStartOfDay(), pageable)
                .map(this::toCandidateResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public CandidateResponse getCandidate(Long id) {
        return toCandidateResponse(requireCandidate(id));
    }

    @Override
    public CandidateResponse createCandidate(CandidateRequest request) {
        Candidate candidate = new Candidate();
        candidate.setCompany(requireWritableCompany());
        applyCandidate(candidate, request);
        Candidate saved = candidateRepository.save(candidate);
        audit("CREATE", "Added candidate " + saved.getFullName());
        return toCandidateResponse(saved);
    }

    @Override
    public CandidateResponse updateCandidate(Long id, CandidateRequest request) {
        Candidate candidate = requireCandidate(id);
        applyCandidate(candidate, request);
        Candidate saved = candidateRepository.save(candidate);
        audit("UPDATE", "Updated candidate " + saved.getFullName());
        return toCandidateResponse(saved);
    }

    @Override
    public CandidateResponse uploadResume(Long id, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Resume file is required");
        }
        Candidate candidate = requireCandidate(id);
        Path directory = resumeDirectory();
        String originalName = sanitizeFileName(file.getOriginalFilename());
        String storedName = UUID.randomUUID() + "_" + originalName;
        Path target = directory.resolve(storedName).normalize();
        if (!target.startsWith(directory)) {
            throw new FileStorageException("Invalid resume file path");
        }
        try {
            Files.createDirectories(directory);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            deleteResumeFile(candidate.getResumeFileName());
        } catch (IOException exception) {
            throw new FileStorageException("Unable to store candidate resume", exception);
        }
        candidate.setResumeFileName(storedName);
        candidate.setResumeOriginalFileName(originalName);
        Candidate saved = candidateRepository.save(candidate);
        audit("UPLOAD", "Uploaded resume for candidate " + saved.getFullName());
        return toCandidateResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] downloadResume(Long id) {
        Candidate candidate = requireCandidate(id);
        if (candidate.getResumeFileName() == null || candidate.getResumeFileName().isBlank()) {
            throw new ResourceNotFoundException("Candidate does not have an uploaded resume");
        }
        Path file = resumeDirectory().resolve(candidate.getResumeFileName()).normalize();
        if (!file.startsWith(resumeDirectory()) || !Files.exists(file)) {
            throw new ResourceNotFoundException("Candidate resume file was not found");
        }
        try {
            return Files.readAllBytes(file);
        } catch (IOException exception) {
            throw new FileStorageException("Unable to read candidate resume", exception);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public String getResumeFileName(Long id) {
        Candidate candidate = requireCandidate(id);
        return candidate.getResumeOriginalFileName() == null || candidate.getResumeOriginalFileName().isBlank()
                ? "resume" : candidate.getResumeOriginalFileName();
    }

    @Override
    public void deleteCandidate(Long id) {
        Candidate candidate = requireCandidate(id);
        String name = candidate.getFullName();
        deleteResumeFile(candidate.getResumeFileName());
        candidateRepository.delete(candidate);
        audit("DELETE", "Deleted candidate " + name);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<InterviewResponse> getInterviews(String keyword, String interviewType, String status, Pageable pageable) {
        return interviewRepository.search(readCompanyScope(), parseInterviewType(interviewType),
                        parseInterviewStatus(status), normalize(keyword), pageable)
                .map(this::toInterviewResponse);
    }

    @Override
    public InterviewResponse createInterview(InterviewRequest request) {
        Company company = requireWritableCompany();
        Interview interview = new Interview();
        interview.setCompany(company);
        applyInterview(interview, request, company);
        Candidate candidate = interview.getCandidate();
        if (candidate.getStatus() == CandidateStatus.APPLIED || candidate.getStatus() == CandidateStatus.SHORTLISTED) {
            candidate.setStatus(CandidateStatus.INTERVIEW_SCHEDULED);
            candidateRepository.save(candidate);
        }
        Interview saved = interviewRepository.save(interview);
        audit("SCHEDULE", "Scheduled interview for " + candidate.getFullName());
        return toInterviewResponse(saved);
    }

    @Override
    public InterviewResponse updateInterview(Long id, InterviewRequest request) {
        Interview interview = requireInterview(id);
        applyInterview(interview, request, interview.getCompany());
        Interview saved = interviewRepository.save(interview);
        audit("UPDATE", "Updated interview for " + saved.getCandidate().getFullName());
        return toInterviewResponse(saved);
    }

    @Override
    public void deleteInterview(Long id) {
        Interview interview = requireInterview(id);
        String name = interview.getCandidate().getFullName();
        interviewRepository.delete(interview);
        audit("DELETE", "Deleted interview for " + name);
    }

    @Override
    public Map<String, Object> generateOffer(OfferRequest request) {
        Candidate candidate = requireCandidate(request.candidateId());
        candidate.setStatus(CandidateStatus.SELECTED);
        candidateRepository.save(candidate);
        Map<String, Object> result = new LinkedHashMap<>();
        result.put("candidateId", candidate.getCandidateId());
        result.put("candidateName", candidate.getFullName());
        result.put("status", candidate.getStatus());
        result.put("message", "Offer prepared. Download it to review and send.");
        audit("OFFER", "Prepared offer for candidate " + candidate.getFullName());
        return result;
    }

    @Override
    @Transactional(readOnly = true)
    public byte[] downloadOffer(Long candidateId) {
        Candidate candidate = requireCandidate(candidateId);
        if (candidate.getStatus() != CandidateStatus.SELECTED && candidate.getStatus() != CandidateStatus.JOINED) {
            throw new IllegalStateException("Generate an offer before downloading it");
        }
        try (ByteArrayOutputStream output = new ByteArrayOutputStream()) {
            Document document = new Document();
            PdfWriter.getInstance(document, output);
            document.open();
            document.add(new Paragraph("OFFER LETTER"));
            document.add(new Paragraph("\nDear " + candidate.getFullName() + ","));
            document.add(new Paragraph("\nWe are pleased to confirm that you have been selected to join "
                    + candidate.getCompany().getCompanyName() + "."));
            document.add(new Paragraph("\nPlease contact our HR team to finalize your employment details."));
            document.close();
            return output.toByteArray();
        } catch (Exception exception) {
            throw new IllegalStateException("Unable to generate offer letter", exception);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getDashboard() {
        Long companyId = readCompanyScope();
        List<Candidate> candidates = companyId == null ? candidateRepository.findAll()
                : candidateRepository.search(companyId, null, null, null, null, Pageable.unpaged()).getContent();
        List<JobOpening> jobs = companyId == null ? jobRepository.findAll()
                : jobRepository.search(companyId, null, null, null, Pageable.unpaged()).getContent();
        List<Interview> interviews = companyId == null ? interviewRepository.findAll()
                : interviewRepository.search(companyId, null, null, null, Pageable.unpaged()).getContent();

        Map<String, Object> dashboard = new LinkedHashMap<>();
        dashboard.put("openJobs", jobs.stream().filter(job -> job.getStatus() == JobStatus.OPEN).count());
        dashboard.put("totalCandidates", candidates.size());
        dashboard.put("todayInterviews", interviews.stream().filter(interview -> LocalDate.now().equals(interview.getInterviewDate())).count());
        dashboard.put("offersSent", candidates.stream().filter(candidate -> candidate.getStatus() == CandidateStatus.SELECTED).count());
        dashboard.put("joinedEmployees", candidates.stream().filter(candidate -> candidate.getStatus() == CandidateStatus.JOINED).count());

        List<Map<String, Object>> candidateStatus = new ArrayList<>();
        for (CandidateStatus status : CandidateStatus.values()) {
            long count = candidates.stream().filter(candidate -> candidate.getStatus() == status).count();
            if (count > 0) {
                candidateStatus.add(Map.of("name", status.name(), "value", count));
            }
        }
        dashboard.put("candidateStatus", candidateStatus);

        List<Map<String, Object>> monthlyHiring = new ArrayList<>();
        for (int offset = 5; offset >= 0; offset--) {
            YearMonth month = YearMonth.now().minusMonths(offset);
            long count = candidates.stream()
                    .filter(candidate -> candidate.getStatus() == CandidateStatus.JOINED)
                    .filter(candidate -> YearMonth.from(candidate.getUpdatedAt()).equals(month))
                    .count();
            monthlyHiring.add(Map.of("month", month.toString(), "count", count));
        }
        dashboard.put("monthlyHiring", monthlyHiring);

        Map<String, Long> jobsByDepartment = new LinkedHashMap<>();
        jobs.stream().forEach(job -> jobsByDepartment.merge(
                job.getDepartment() == null ? "Unassigned" : job.getDepartment().getDepartmentName(),
                1L, Long::sum));
        dashboard.put("departmentHiring", jobsByDepartment.entrySet().stream()
                .map(entry -> Map.of("department", entry.getKey(), "count", entry.getValue())).toList());

        List<Map<String, Object>> activities = new ArrayList<>();
        candidates.stream().sorted(Comparator.comparing(Candidate::getUpdatedAt).reversed()).limit(5)
                .forEach(candidate -> activities.add(Map.of("title", "Candidate " + candidate.getStatus(),
                        "description", candidate.getFullName(), "time", candidate.getUpdatedAt().toString())));
        dashboard.put("recentActivities", activities);
        return dashboard;
    }

    private void applyJob(JobOpening job, JobOpeningRequest request, Company company) {
        job.setJobTitle(request.jobTitle().trim());
        job.setDescription(request.description());
        job.setRequiredSkills(request.requiredSkills());
        job.setExperience(request.experience());
        job.setSalary(request.salary());
        job.setVacancies(request.vacancies());
        job.setEmploymentType(request.employmentType());
        job.setStatus(request.status() == null ? JobStatus.OPEN : request.status());
        job.setDepartment(resolveDepartment(request.departmentId(), company));
    }

    private void applyCandidate(Candidate candidate, CandidateRequest request) {
        candidate.setFullName(request.fullName().trim());
        candidate.setEmail(request.email().trim().toLowerCase());
        candidate.setPhone(request.phone());
        candidate.setExperience(request.experience());
        candidate.setSkills(request.skills());
        candidate.setCurrentCompany(request.currentCompany());
        candidate.setExpectedSalary(request.expectedSalary());
        candidate.setNoticePeriod(request.noticePeriod());
        candidate.setStatus(request.status() == null ? CandidateStatus.APPLIED : request.status());
    }

    private void applyInterview(Interview interview, InterviewRequest request, Company company) {
        Candidate candidate = candidateRepository.findById(request.candidateId())
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));
        assertTenant(candidate.getCompany());
        User interviewer = userRepository.findById(request.interviewerId())
                .orElseThrow(() -> new ResourceNotFoundException("Interviewer not found"));
        if (!SecurityUtils.isSuperAdmin() && (interviewer.getCompany() == null
                || !company.getId().equals(interviewer.getCompany().getId()))) {
            throw new AccessDeniedException("Interviewer belongs to another company");
        }
        interview.setCandidate(candidate);
        interview.setInterviewer(interviewer);
        interview.setInterviewType(request.interviewType());
        interview.setInterviewDate(request.interviewDate());
        interview.setInterviewTime(request.interviewTime());
        interview.setMeetingLink(request.meetingLink());
        interview.setLocation(request.location());
        interview.setStatus(request.status() == null ? InterviewStatus.SCHEDULED : request.status());
        interview.setFeedback(request.feedback());
        interview.setRating(request.rating());
    }

    private Department resolveDepartment(Long departmentId, Company company) {
        if (departmentId == null) {
            return null;
        }
        return departmentRepository.findByDepartmentIdAndCompanyId(departmentId, company.getId())
                .orElseThrow(() -> new AccessDeniedException("Department is not available in this company"));
    }

    private JobOpening requireJob(Long id) {
        JobOpening job = jobRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Job opening not found"));
        assertTenant(job.getCompany());
        return job;
    }

    private Candidate requireCandidate(Long id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Candidate not found"));
        assertTenant(candidate.getCompany());
        return candidate;
    }

    private Interview requireInterview(Long id) {
        Interview interview = interviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Interview not found"));
        assertTenant(interview.getCompany());
        return interview;
    }

    private Company requireWritableCompany() {
        Long companyId = SecurityUtils.getCurrentCompanyId();
        if (companyId == null) {
            throw new AccessDeniedException("Select a tenant company before changing recruitment data");
        }
        return companyRepository.findById(companyId)
                .orElseThrow(() -> new ResourceNotFoundException("Current company not found"));
    }

    private Long readCompanyScope() {
        return SecurityUtils.isSuperAdmin() ? null : requireWritableCompany().getId();
    }

    private void assertTenant(Company company) {
        if (!SecurityUtils.isSuperAdmin()) {
            Long companyId = requireWritableCompany().getId();
            if (company == null || !companyId.equals(company.getId())) {
                throw new AccessDeniedException("Resource belongs to another company");
            }
        }
    }

    private JobOpeningResponse toJobResponse(JobOpening job) {
        Department department = job.getDepartment();
        return new JobOpeningResponse(job.getJobId(), job.getJobTitle(),
                department == null ? null : department.getDepartmentId(),
                department == null ? null : department.getDepartmentName(), job.getDescription(), job.getRequiredSkills(),
                job.getExperience(), job.getSalary(), job.getVacancies(), job.getEmploymentType(), job.getStatus(), job.getCreatedAt());
    }

    private CandidateResponse toCandidateResponse(Candidate candidate) {
        String resumeUrl = candidate.getResumeFileName() == null ? null
                : "/api/recruitment/candidates/" + candidate.getCandidateId() + "/resume";
        return new CandidateResponse(candidate.getCandidateId(), candidate.getFullName(), candidate.getEmail(), candidate.getPhone(),
                candidate.getExperience(), candidate.getSkills(), candidate.getCurrentCompany(), candidate.getExpectedSalary(),
                candidate.getNoticePeriod(), candidate.getStatus(), resumeUrl, candidate.getResumeOriginalFileName(), candidate.getCreatedAt());
    }

    private InterviewResponse toInterviewResponse(Interview interview) {
        return new InterviewResponse(interview.getInterviewId(), interview.getCandidate().getCandidateId(),
                interview.getCandidate().getFullName(), interview.getInterviewer().getUserId(), interview.getInterviewer().getFullName(),
                interview.getInterviewType(), interview.getInterviewDate(), interview.getInterviewTime(), interview.getMeetingLink(),
                interview.getLocation(), interview.getStatus(), interview.getFeedback(), interview.getRating());
    }

    private Path resumeDirectory() {
        return Paths.get(uploadDir, "recruitment").toAbsolutePath().normalize();
    }

    private void deleteResumeFile(String fileName) {
        if (fileName == null || fileName.isBlank()) {
            return;
        }
        try {
            Path file = resumeDirectory().resolve(fileName).normalize();
            if (file.startsWith(resumeDirectory())) {
                Files.deleteIfExists(file);
            }
        } catch (IOException ignored) {
            // The database record is still valid; a later maintenance job can remove orphaned files.
        }
    }

    private String sanitizeFileName(String value) {
        String fileName = value == null || value.isBlank() ? "resume" : Paths.get(value).getFileName().toString();
        if (fileName.length() > 250) {
            throw new IllegalArgumentException("Resume filename is too long");
        }
        return fileName;
    }

    private String normalize(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    private JobStatus parseJobStatus(String value) { return parseEnum(value, JobStatus.class); }
    private CandidateStatus parseCandidateStatus(String value) { return parseEnum(value, CandidateStatus.class); }
    private InterviewStatus parseInterviewStatus(String value) { return parseEnum(value, InterviewStatus.class); }
    private InterviewType parseInterviewType(String value) { return parseEnum(value, InterviewType.class); }

    private <T extends Enum<T>> T parseEnum(String value, Class<T> enumType) {
        if (value == null || value.isBlank()) return null;
        try { return Enum.valueOf(enumType, value.trim().toUpperCase()); }
        catch (IllegalArgumentException exception) { throw new IllegalArgumentException("Unsupported " + enumType.getSimpleName() + ": " + value); }
    }

    private void audit(String action, String details) {
        auditLogService.saveLog(action, "RECRUITMENT", details, "SYSTEM");
    }
}
