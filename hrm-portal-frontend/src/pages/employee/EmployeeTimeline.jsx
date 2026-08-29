import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Chip,
  Stack,
  Alert
} from "@mui/material";
import {
  GitCommit,
  UserPlus,
  ArrowRightLeft,
  Award,
  CheckCircle,
  XCircle,
  Clock,
  User
} from "lucide-react";
import employeeService from "../../services/employeeService";

const getEventIcon = (type) => {
  switch (type) {
    case "ONBOARDING":
    case "NEW_HIRE":
      return <UserPlus className="w-5 h-5 text-emerald-600" />;
    case "TRANSFER":
    case "DEPT_CHANGE":
      return <ArrowRightLeft className="w-5 h-5 text-blue-600" />;
    case "PROMOTION":
    case "DESIG_CHANGE":
      return <Award className="w-5 h-5 text-purple-600" />;
    case "ACTIVE":
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    case "EXIT":
    case "DEACTIVATE":
      return <XCircle className="w-5 h-5 text-rose-600" />;
    default:
      return <GitCommit className="w-5 h-5 text-slate-500" />;
  }
};

const getEventColor = (type) => {
  switch (type) {
    case "ONBOARDING":
    case "NEW_HIRE":
      return "success";
    case "TRANSFER":
    case "DEPT_CHANGE":
      return "info";
    case "PROMOTION":
    case "DESIG_CHANGE":
      return "secondary";
    case "ACTIVE":
      return "success";
    case "EXIT":
    case "DEACTIVATE":
      return "error";
    default:
      return "default";
  }
};

export default function EmployeeTimeline({ employeeId }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!employeeId) return;

    let isMounted = true;
    const fetchTimeline = async () => {
      try {
        setLoading(true);
        setError("");
        const res = await employeeService.getEmployeeTimeline(employeeId);
        if (isMounted) {
          setEvents(res.data || res || []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message || "Failed to load timeline events");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchTimeline();
    return () => {
      isMounted = false;
    };
  }, [employeeId]);

  if (loading) {
    return (
      <Box sx={{ p: 4, display: "flex", justifyContent: "center" }}>
        <CircularProgress size={32} />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="warning" sx={{ my: 2 }}>{error}</Alert>;
  }

  if (!events || events.length === 0) {
    return (
      <Paper sx={{ p: 3, textAlign: "center", bgcolor: "#f8fafc", borderRadius: 2 }}>
        <Clock className="w-8 h-8 text-slate-400 mx-auto mb-2" />
        <Typography variant="body2" color="text.secondary">
          No historical lifecycle events recorded yet for this employee.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ position: "relative", pl: 3, py: 1 }}>
      {/* Vertical Line */}
      <Box
        sx={{
          position: "absolute",
          left: 19,
          top: 8,
          bottom: 8,
          width: 2,
          bgcolor: "#e2e8f0"
        }}
      />

      <Stack spacing={3}>
        {events.map((evt, idx) => (
          <Box key={evt.id || idx} sx={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 2 }}>
            {/* Dot/Icon Badge */}
            <Box
              sx={{
                width: 38,
                height: 38,
                borderRadius: "50%",
                bgcolor: "#ffffff",
                border: "2px solid #cbd5e1",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                zIndex: 1,
                boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
              }}
            >
              {getEventIcon(evt.eventType)}
            </Box>

            {/* Event Content Card */}
            <Paper
              elevation={0}
              sx={{
                flex: 1,
                p: 2,
                borderRadius: 2.5,
                border: "1px solid #e2e8f0",
                bgcolor: "#ffffff"
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.8, flexWrap: "wrap", gap: 1 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={evt.eventType?.replace("_", " ")}
                    size="small"
                    color={getEventColor(evt.eventType)}
                    sx={{ fontWeight: 700, fontSize: "0.75rem" }}
                  />
                  {evt.newState && (
                    <Typography variant="subtitle2" fontWeight={700} color="text.primary">
                      {evt.newState}
                    </Typography>
                  )}
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <Clock className="w-3.5 h-3.5" />
                  {evt.timestamp ? new Date(evt.timestamp).toLocaleString() : "-"}
                </Typography>
              </Box>

              {evt.notes && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1, lineHeight: 1.5 }}>
                  {evt.notes}
                </Typography>
              )}

              {evt.actorEmail && (
                <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <User className="w-3.5 h-3.5" /> Logged by: {evt.actorEmail}
                </Typography>
              )}
            </Paper>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
