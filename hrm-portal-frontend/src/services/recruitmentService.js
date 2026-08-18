import api from "./api";

// ======================================
// Job Management
// ======================================

// Get All Jobs
export const getJobs = async (params = {}) => {
  const response = await api.get("/recruitment/jobs", {
    params,
  });
  return response.data;
};

// Get Job By ID
export const getJobById = async (id) => {
  const response = await api.get(`/recruitment/jobs/${id}`);
  return response.data;
};

// Create Job
export const createJob = async (jobData) => {
  const response = await api.post(
    "/recruitment/jobs",
    jobData
  );
  return response.data;
};

// Update Job
export const updateJob = async (id, jobData) => {
  const response = await api.put(
    `/recruitment/jobs/${id}`,
    jobData
  );
  return response.data;
};

// Delete Job
export const deleteJob = async (id) => {
  const response = await api.delete(
    `/recruitment/jobs/${id}`
  );
  return response.data;
};

// Close Job
export const closeJob = async (id) => {
  const response = await api.put(
    `/recruitment/jobs/${id}/close`
  );
  return response.data;
};

// Reopen Job
export const reopenJob = async (id) => {
  const response = await api.put(
    `/recruitment/jobs/${id}/reopen`
  );
  return response.data;
};

// ======================================
// Candidate Management
// ======================================

// Get Candidates
export const getCandidates = async (params = {}) => {
  const response = await api.get(
    "/recruitment/candidates",
    { params }
  );
  return response.data;
};

// Get Candidate By ID
export const getCandidateById = async (id) => {
  const response = await api.get(
    `/recruitment/candidates/${id}`
  );
  return response.data;
};

// Add Candidate
export const createCandidate = async (
  candidateData
) => {
  const response = await api.post(
    "/recruitment/candidates",
    candidateData
  );
  return response.data;
};

// Update Candidate
export const updateCandidate = async (
  id,
  candidateData
) => {
  const response = await api.put(
    `/recruitment/candidates/${id}`,
    candidateData
  );
  return response.data;
};

// Delete Candidate
export const deleteCandidate = async (id) => {
  const response = await api.delete(
    `/recruitment/candidates/${id}`
  );
  return response.data;
};

// Upload Resume
export const uploadResume = async (
  candidateId,
  file
) => {

  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    `/recruitment/candidates/${candidateId}/resume`,
    formData,
    {
      headers: {
        "Content-Type":
          "multipart/form-data",
      },
    }
  );

  return response.data;

};

// ======================================
// Interview Management
// ======================================

// Get Interviews
export const getInterviews = async (
  params = {}
) => {
  const response = await api.get(
    "/recruitment/interviews",
    { params }
  );
  return response.data;
};

// Schedule Interview
export const scheduleInterview = async (
  interviewData
) => {
  const response = await api.post(
    "/recruitment/interviews",
    interviewData
  );
  return response.data;
};

// Update Interview
export const updateInterview = async (
  id,
  interviewData
) => {
  const response = await api.put(
    `/recruitment/interviews/${id}`,
    interviewData
  );
  return response.data;
};

// Delete Interview
export const deleteInterview = async (id) => {
  const response = await api.delete(
    `/recruitment/interviews/${id}`
  );
  return response.data;
};

// ======================================
// Offer Letter
// ======================================

// Generate Offer Letter
export const generateOfferLetter = async (
  offerData
) => {
  const response = await api.post(
    "/recruitment/offer",
    offerData
  );
  return response.data;
};

// Download Offer Letter
export const downloadOfferLetter = async (
  candidateId
) => {
  const response = await api.get(
    `/recruitment/offer/${candidateId}/download`,
    {
      responseType: "blob",
    }
  );
  return response.data;
};

// ======================================
// Recruitment Dashboard
// ======================================

// Dashboard Statistics
export const getRecruitmentDashboard =
  async () => {
    const response = await api.get(
      "/recruitment/dashboard"
    );
    return response.data;
  };

// ======================================
// Search & Filters
// ======================================

// Search Jobs
export const searchJobs = async (keyword) => {
  const response = await api.get(
    "/recruitment/jobs/search",
    {
      params: { keyword },
    }
  );
  return response.data;
};

// Search Candidates
export const searchCandidates =
  async (keyword) => {
    const response = await api.get(
      "/recruitment/candidates/search",
      {
        params: { keyword },
      }
    );
    return response.data;
  };