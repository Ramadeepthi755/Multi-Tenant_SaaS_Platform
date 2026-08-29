import api from "./api";

const aiService = {
  askCopilot: async (prompt, context = "", targetModule = "GENERAL") => {
    const response = await api.post("/ai/copilot", { prompt, context, targetModule });
    return response.data;
  },

  generateJobDescription: async (roleTitle, departmentName, requiredSkills, experience) => {
    const response = await api.post("/ai/generate-job-description", null, {
      params: { roleTitle, departmentName, requiredSkills, experience }
    });
    return response.data;
  },

  screenCandidate: async (candidateId) => {
    const response = await api.get(`/ai/screen-candidate/${candidateId}`);
    return response.data;
  },

  getPerformanceSummary: async (employeeId) => {
    const response = await api.get(`/ai/performance-summary/${employeeId}`);
    return response.data;
  },

  getAttendanceAnomalies: async () => {
    const response = await api.get("/ai/attendance-anomalies");
    return response.data;
  },

  askPolicy: async (question) => {
    const response = await api.post("/ai/policy-qa", { question });
    return response.data;
  }
};

export default aiService;
