import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  LinearProgress,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert
} from "@mui/material";
import {
  CreditCard,
  Users,
  Shield,
  HardDrive,
  Cpu,
  CheckCircle2,
  Sparkles,
  ArrowUpRight
} from "lucide-react";
import subscriptionService from "../../services/subscriptionService";

export default function SubscriptionDashboard() {
  const [usage, setUsage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [upgrading, setUpgrading] = useState(false);

  const loadSubscription = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await subscriptionService.getUsage();
      setUsage(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load subscription metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSubscription();
  }, []);

  const handlePlanUpgrade = async (planCode) => {
    try {
      setUpgrading(true);
      await subscriptionService.changePlan(planCode);
      setUpgradeModalOpen(false);
      await loadSubscription();
    } catch (err) {
      alert(err.response?.data?.message || "Could not change subscription plan");
    } finally {
      setUpgrading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  const empPercent = usage?.employeeLimit ? Math.min(100, Math.round((usage.currentEmployees / usage.employeeLimit) * 100)) : 0;
  const aiPercent = usage?.aiMonthlyQuota ? Math.min(100, Math.round((usage.aiUsageThisMonth / usage.aiMonthlyQuota) * 100)) : 0;
  const storagePercent = usage?.storageLimitMb ? Math.min(100, Math.round((usage.storageUsedMb / usage.storageLimitMb) * 100)) : 0;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: "auto" }}>
      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700} sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CreditCard className="w-6 h-6 text-indigo-600" />
            SaaS Plan & Subscription Quotas
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Manage your organization's multi-tenant licensing, user capacity, and AI quotas.
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<Sparkles className="w-4 h-4" />}
          onClick={() => setUpgradeModalOpen(true)}
          sx={{ background: "linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)", textTransform: "none", borderRadius: 2 }}
        >
          Change Plan
        </Button>
      </Box>

      {/* Plan Status Banner */}
      <Card sx={{ mb: 3, background: "linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)", borderRadius: 3, border: "1px solid #e2e8f0" }}>
        <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", py: 2.5 }}>
          <Box>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 0.5 }}>
              <Typography variant="h6" fontWeight={700}>
                {usage?.planName || "Enterprise Plan"}
              </Typography>
              <Chip label={usage?.status || "ACTIVE"} color="success" size="small" sx={{ fontWeight: 600 }} />
            </Box>
            <Typography variant="body2" color="text.secondary">
              Renewal Date: {usage?.renewalDate || "Continuous SaaS license"}
            </Typography>
          </Box>
          <Box sx={{ textAlign: "right" }}>
            <Typography variant="caption" color="text.secondary" display="block">
              Billing Cycle
            </Typography>
            <Typography variant="subtitle2" fontWeight={600}>
              Monthly Auto-Renew
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Quota KPI Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Employee Capacity */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%", borderRadius: 3, border: "1px solid #e2e8f0" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                  Employee Capacity
                </Typography>
                <Users className="w-5 h-5 text-indigo-600" />
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {usage?.currentEmployees} <Typography component="span" variant="body1" color="text.secondary">/ {usage?.employeeLimit}</Typography>
              </Typography>
              <LinearProgress variant="determinate" value={empPercent} sx={{ my: 1.5, height: 8, borderRadius: 4 }} />
              <Typography variant="caption" color="text.secondary">
                {empPercent}% capacity utilized across active departments
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* AI Copilot Usage */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%", borderRadius: 3, border: "1px solid #e2e8f0" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                  AI Intelligence Quota
                </Typography>
                <Cpu className="w-5 h-5 text-purple-600" />
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {usage?.aiUsageThisMonth} <Typography component="span" variant="body1" color="text.secondary">/ {usage?.aiMonthlyQuota}</Typography>
              </Typography>
              <LinearProgress variant="determinate" value={aiPercent} color="secondary" sx={{ my: 1.5, height: 8, borderRadius: 4 }} />
              <Typography variant="caption" color="text.secondary">
                {aiPercent}% monthly requests (Resets on next renewal)
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Storage Quota */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: "100%", borderRadius: 3, border: "1px solid #e2e8f0" }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary" fontWeight={600}>
                  Document Storage
                </Typography>
                <HardDrive className="w-5 h-5 text-blue-600" />
              </Box>
              <Typography variant="h4" fontWeight={700}>
                {usage?.storageUsedMb} MB <Typography component="span" variant="body1" color="text.secondary">/ {usage?.storageLimitMb} MB</Typography>
              </Typography>
              <LinearProgress variant="determinate" value={storagePercent} color="info" sx={{ my: 1.5, height: 8, borderRadius: 4 }} />
              <Typography variant="caption" color="text.secondary">
                Vault for resumes, payslips, and compliance contracts
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Plan Upgrade Dialog */}
      <Dialog open={upgradeModalOpen} onClose={() => setUpgradeModalOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>Choose Subscription Tier</DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2}>
            {usage?.availablePlans?.map((plan) => (
              <Grid item xs={12} md={4} key={plan.planCode}>
                <Card
                  sx={{
                    p: 2,
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: 3,
                    border: usage?.planCode === plan.planCode ? "2px solid #4f46e5" : "1px solid #e2e8f0",
                    background: usage?.planCode === plan.planCode ? "#f5f3ff" : "#ffffff"
                  }}
                >
                  <Box>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography variant="h6" fontWeight={700}>
                        {plan.name}
                      </Typography>
                      {usage?.planCode === plan.planCode && (
                        <Chip label="Current" size="small" color="primary" />
                      )}
                    </Box>
                    <Typography variant="h5" fontWeight={800} color="primary.main" sx={{ mb: 1 }}>
                      ${plan.priceMonthly} <Typography component="span" variant="body2" color="text.secondary">/ mo</Typography>
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      {plan.description}
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
                      <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CheckCircle2 className="w-4 h-4 text-green-600" /> Up to {plan.employeeLimit} employees
                      </Typography>
                      <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CheckCircle2 className="w-4 h-4 text-green-600" /> {plan.aiMonthlyQuota} AI requests/month
                      </Typography>
                      <Typography variant="caption" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CheckCircle2 className="w-4 h-4 text-green-600" /> {plan.storageLimitMb} MB document storage
                      </Typography>
                    </Box>
                  </Box>
                  <Button
                    variant={usage?.planCode === plan.planCode ? "outlined" : "contained"}
                    disabled={upgrading || usage?.planCode === plan.planCode}
                    onClick={() => handlePlanUpgrade(plan.planCode)}
                    fullWidth
                    sx={{ textTransform: "none", borderRadius: 2 }}
                  >
                    {usage?.planCode === plan.planCode ? "Active Tier" : "Select Plan"}
                  </Button>
                </Card>
              </Grid>
            ))}
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpgradeModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
