import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Tooltip
} from "@mui/material";
import {
  UserCheck,
  Calendar,
  Sparkles,
  ArrowRight,
  RefreshCw,
  Eye,
  FileText
} from "lucide-react";
import { getCandidates, updateCandidateStatus } from "../../services/recruitmentService";
import aiService from "../../services/aiService";

const PIPELINE_COLUMNS = [
  { key: "APPLIED", label: "Applied", color: "#64748b" },
  { key: "SCREENING", label: "Screening", color: "#3b82f6" },
  { key: "SHORTLISTED", label: "Shortlisted", color: "#8b5cf6" },
  { key: "INTERVIEW", label: "Interview", color: "#eab308" },
  { key: "OFFER", label: "Offer", color: "#06b6d4" },
  { key: "HIRED", label: "Hired", color: "#22c55e" },
  { key: "REJECTED", label: "Rejected", color: "#ef4444" }
];

export default function RecruitmentKanban() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [screeningModal, setScreeningModal] = useState({ open: false, candidate: null, analysis: null, loading: false });

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await getCandidates({ page: 0, size: 100 });
      setCandidates(res.content || []);
    } catch (err) {
      console.error("Failed to load candidate pipeline", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleStatusChange = async (candidateId, nextStatus) => {
    try {
      await updateCandidateStatus(candidateId, nextStatus);
      await loadData();
    } catch (err) {
      alert("Failed to advance candidate status: " + (err.response?.data?.message || err.message));
    }
  };

  const handleAiScreen = async (candidate) => {
    try {
      setScreeningModal({ open: true, candidate, analysis: null, loading: true });
      const res = await aiService.screenCandidate(candidate.candidateId);
      const text = res.result || res.data?.result || res.message || res.data?.message || JSON.stringify(res);
      setScreeningModal({ open: true, candidate, analysis: text, loading: false });
    } catch (err) {
      setScreeningModal({
        open: true,
        candidate,
        analysis: "Could not complete automated AI screening. Reason: " + (err.response?.data?.message || err.message),
        loading: false
      });
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Recruitment ATS Pipeline
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Visual recruitment pipeline with real-time status transitions and AI resume screening.
          </Typography>
        </Box>
        <Button startIcon={<RefreshCw className="w-4 h-4" />} onClick={loadData} variant="outlined">
          Refresh Pipeline
        </Button>
      </Box>

      {/* Kanban Board Container */}
      <Box sx={{ display: "flex", gap: 2, overflowX: "auto", pb: 2, minHeight: "70vh" }}>
        {PIPELINE_COLUMNS.map((col) => {
          const colCandidates = candidates.filter((c) => (c.status || "APPLIED") === col.key);
          return (
            <Box
              key={col.key}
              sx={{
                flex: "0 0 280px",
                backgroundColor: "#f8fafc",
                borderRadius: 3,
                p: 2,
                border: "1px solid #e2e8f0",
                display: "flex",
                flexDirection: "column"
              }}
            >
              {/* Column Header */}
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="subtitle2" fontWeight={700} sx={{ color: col.color }}>
                  {col.label}
                </Typography>
                <Chip label={colCandidates.length} size="small" sx={{ fontWeight: 600, height: 22 }} />
              </Box>

              {/* Candidate Cards */}
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, flexGrow: 1 }}>
                {colCandidates.map((candidate) => (
                  <Card
                    key={candidate.candidateId}
                    sx={{
                      borderRadius: 2,
                      border: "1px solid #e2e8f0",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                      "&:hover": { boxShadow: "0 4px 6px rgba(0,0,0,0.08)" }
                    }}
                  >
                    <CardContent sx={{ p: 2, "&:last-child": { pb: 2 } }}>
                      <Typography variant="subtitle2" fontWeight={700} noWrap>
                        {candidate.fullName}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" noWrap>
                        {candidate.jobOpening?.jobTitle || "General Applicant"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                        Exp: {candidate.experience || "N/A"} • Notice: {candidate.noticePeriodDays || 0}d
                      </Typography>

                      {/* Action Bar */}
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1.5, pt: 1, borderTop: "1px dashed #e2e8f0" }}>
                        <Tooltip title="AI Screening Assistant">
                          <IconButton size="small" color="primary" onClick={() => handleAiScreen(candidate)}>
                            <Sparkles className="w-4 h-4 text-purple-600" />
                          </IconButton>
                        </Tooltip>

                        {/* Fast Status Mover */}
                        {col.key !== "HIRED" && col.key !== "REJECTED" && (
                          <Button
                            size="small"
                            endIcon={<ArrowRight className="w-3 h-3" />}
                            sx={{ textTransform: "none", fontSize: "0.75rem", p: "2px 6px" }}
                            onClick={() => {
                              const nextIdx = PIPELINE_COLUMNS.findIndex((c) => c.key === col.key) + 1;
                              if (nextIdx < PIPELINE_COLUMNS.length) {
                                handleStatusChange(candidate.candidateId, PIPELINE_COLUMNS[nextIdx].key);
                              }
                            }}
                          >
                            Advance
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                ))}

                {colCandidates.length === 0 && (
                  <Box sx={{ p: 2, textAlign: "center", border: "1px dashed #cbd5e1", borderRadius: 2 }}>
                    <Typography variant="caption" color="text.secondary">
                      No candidates
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>

      {/* AI Candidate Screening Modal */}
      <Dialog open={screeningModal.open} onClose={() => setScreeningModal({ ...screeningModal, open: false })} maxWidth="md" fullWidth>
        <DialogTitle sx={{ display: "flex", alignItems: "center", gap: 1, fontWeight: 700 }}>
          <Sparkles className="w-5 h-5 text-purple-600" />
          AI-Assisted Candidate Screening: {screeningModal.candidate?.fullName}
        </DialogTitle>
        <DialogContent dividers>
          {screeningModal.loading ? (
            <Box sx={{ p: 4, textAlign: "center" }}>
              <CircularProgress size={32} sx={{ mb: 2 }} />
              <Typography variant="body2" color="text.secondary">
                Analyzing resume, experience, and core competencies against job specifications...
              </Typography>
            </Box>
          ) : (
            <Box>
              <Typography variant="body1" sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6, fontSize: "0.95rem" }}>
                {screeningModal.analysis}
              </Typography>
              <Box sx={{ mt: 3, p: 1.5, backgroundColor: "#f8fafc", borderRadius: 2, border: "1px solid #e2e8f0" }}>
                <Typography variant="caption" color="text.secondary">
                  ⚠️ AI-Assisted Recommendation only. Final employment decisions remain under the review of the human hiring authority.
                </Typography>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setScreeningModal({ ...screeningModal, open: false })}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
