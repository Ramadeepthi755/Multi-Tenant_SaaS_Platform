import api from "./api";

const subscriptionService = {
  getUsage: async () => {
    const response = await api.get("/subscription/usage");
    return response.data;
  },

  getPlans: async () => {
    const response = await api.get("/subscription/plans");
    return response.data;
  },

  changePlan: async (planCode) => {
    const response = await api.post("/subscription/change-plan", { planCode });
    return response.data;
  }
};

export default subscriptionService;
