import {
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Paper,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import SmartToyOutlinedIcon from "@mui/icons-material/SmartToyOutlined";
import { useState } from "react";
import aiService from "../../services/aiService";

const QUICK_PROMPTS = [
  "How many total employees are active?",
  "What are the company leave policies?",
  "Analyze today's attendance anomalies",
  "How do I post a new job opening?"
];

const AiCopilotDialog = ({ open, onClose }) => {
  const [prompt, setPrompt] = useState("");
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello! I am your **HRM Enterprise AI Copilot**. How can I help you with workforce metrics, candidate screening, policy questions, or job drafting today?"
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSend = async (userPromptText) => {
    const query = userPromptText || prompt;
    if (!query.trim() || loading) return;

    const newMessages = [...messages, { sender: "user", text: query }];
    setMessages(newMessages);
    setPrompt("");
    setLoading(true);

    try {
      const response = await aiService.askCopilot(query);
      setMessages([
        ...newMessages,
        {
          sender: "ai",
          text: response.result || "No response received.",
          suggestions: response.suggestions
        }
      ]);
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          sender: "ai",
          text: "I encountered an issue processing your request. Please ensure you are logged in with valid role permissions."
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3.5,
          boxShadow: "0 24px 48px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden"
        }
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "primary.main",
          color: "primary.contrastText",
          py: 2
        }}
      >
        <Stack direction="row" spacing={1.5} alignItems="center">
          <AutoAwesomeIcon />
          <Box>
            <Typography variant="h6" fontWeight={850} sx={{ lineHeight: 1.2 }}>
              Enterprise HR AI Copilot
            </Typography>
            <Typography variant="caption" sx={{ opacity: 0.85 }}>
              Tenant-isolated, role-guarded workforce intelligence
            </Typography>
          </Box>
        </Stack>
        <IconButton onClick={onClose} sx={{ color: "inherit" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3, bgcolor: "background.default" }}>
        <Stack spacing={2} sx={{ minHeight: 320, maxHeight: 440, overflowY: "auto", pr: 1 }}>
          {messages.map((m, index) => (
            <Stack
              key={index}
              direction="row"
              spacing={1.5}
              justifyContent={m.sender === "user" ? "flex-end" : "flex-start"}
            >
              {m.sender === "ai" && (
                <Box
                  sx={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    bgcolor: "primary.light",
                    color: "primary.dark",
                    display: "grid",
                    placeItems: "center",
                    flexShrink: 0
                  }}
                >
                  <SmartToyOutlinedIcon fontSize="small" />
                </Box>
              )}
              <Paper
                elevation={0}
                sx={{
                  p: 2,
                  maxWidth: "78%",
                  borderRadius: 2.5,
                  bgcolor: m.sender === "user" ? "primary.main" : "background.paper",
                  color: m.sender === "user" ? "primary.contrastText" : "text.primary",
                  border: m.sender === "user" ? "none" : "1px solid",
                  borderColor: "divider",
                  whiteSpace: "pre-line"
                }}
              >
                <Typography variant="body2" sx={{ lineHeight: 1.6 }}>
                  {m.text}
                </Typography>
                {m.suggestions && m.suggestions.length > 0 && (
                  <Box sx={{ mt: 1.5, display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {m.suggestions.map((s, idx) => (
                      <Chip
                        key={idx}
                        label={s}
                        size="small"
                        clickable
                        onClick={() => handleSend(s)}
                        variant="outlined"
                        color="primary"
                        sx={{ fontWeight: 650, fontSize: 11 }}
                      />
                    ))}
                  </Box>
                )}
              </Paper>
            </Stack>
          ))}
          {loading && (
            <Stack direction="row" spacing={1.5} alignItems="center">
              <CircularProgress size={20} />
              <Typography variant="caption" color="text.secondary">
                Analyzing workforce records…
              </Typography>
            </Stack>
          )}
        </Stack>

        <Divider sx={{ my: 2 }} />

        {/* Quick prompt recommendations */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="caption" color="text.secondary" fontWeight={750} sx={{ mb: 1, display: "block" }}>
            Suggested Queries
          </Typography>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {QUICK_PROMPTS.map((qp, idx) => (
              <Chip
                key={idx}
                label={qp}
                size="small"
                onClick={() => handleSend(qp)}
                sx={{ bgcolor: "background.paper", border: "1px solid", borderColor: "divider", fontSize: 11 }}
              />
            ))}
          </Box>
        </Box>

        <Stack direction="row" spacing={1.5}>
          <TextField
            fullWidth
            size="small"
            placeholder="Ask HR Copilot anything (e.g. employee count, recruitment status)…"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            sx={{ bgcolor: "background.paper", borderRadius: 2 }}
          />
          <Button
            variant="contained"
            endIcon={<SendIcon />}
            onClick={() => handleSend()}
            disabled={!prompt.trim() || loading}
            sx={{ px: 3, borderRadius: 2 }}
          >
            Send
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default AiCopilotDialog;
