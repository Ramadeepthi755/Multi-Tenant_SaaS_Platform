import {
  Box,
  Chip,
  Dialog,
  Divider,
  InputAdornment,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  TextField,
  Typography
} from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import BeachAccessOutlinedIcon from "@mui/icons-material/BeachAccessOutlined";
import FolderOutlinedIcon from "@mui/icons-material/FolderOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import AutoAwesomeOutlinedIcon from "@mui/icons-material/AutoAwesomeOutlined";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const COMMAND_ITEMS = [
  { id: "dash", title: "Go to Dashboard", category: "Navigation", path: "/dashboard", icon: DashboardOutlinedIcon, shortcut: "G D" },
  { id: "emp", title: "View Employees", category: "Workforce", path: "/employees", icon: PeopleAltOutlinedIcon, shortcut: "G E" },
  { id: "dept", title: "View Departments", category: "Organization", path: "/departments", icon: ApartmentOutlinedIcon },
  { id: "desig", title: "View Designations", category: "Organization", path: "/designations", icon: BadgeOutlinedIcon },
  { id: "att", title: "Attendance & Clock In/Out", category: "Time & Attendance", path: "/attendance", icon: AccessTimeOutlinedIcon, shortcut: "G A" },
  { id: "leave", title: "Leave Management & Approvals", category: "Time & Attendance", path: "/leave", icon: EventAvailableOutlinedIcon, shortcut: "G L" },
  { id: "pay", title: "Payroll & Payslips", category: "Finance", path: "/payroll", icon: PaymentsOutlinedIcon, shortcut: "G P" },
  { id: "hol", title: "Company Holidays Calendar", category: "Organization", path: "/holidays", icon: BeachAccessOutlinedIcon },
  { id: "doc", title: "Document Vault", category: "Workforce", path: "/documents", icon: FolderOutlinedIcon },
  { id: "rec", title: "Recruitment & Jobs Pipeline", category: "Talent", path: "/recruitment", icon: WorkOutlineOutlinedIcon },
  { id: "rep", title: "Reports & Analytics Center", category: "Intelligence", path: "/reports", icon: AssessmentOutlinedIcon, shortcut: "G R" },
  { id: "notif", title: "System Notifications", category: "General", path: "/notifications", icon: NotificationsOutlinedIcon },
  { id: "prof", title: "My User Profile", category: "General", path: "/profile", icon: PersonOutlineOutlinedIcon },
  { id: "set", title: "System & Company Settings", category: "General", path: "/settings", icon: SettingsOutlinedIcon }
];

const CommandPalette = ({ open, onClose }) => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        onClose ? onClose(!open) : null;
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  const filtered = COMMAND_ITEMS.filter((item) =>
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (path) => {
    if (onClose) onClose(false);
    setSearch("");
    if (path) navigate(path);
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        if (onClose) onClose(false);
        setSearch("");
      }}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3.5,
          boxShadow: "0 24px 48px -12px rgba(0, 0, 0, 0.25)",
          overflow: "hidden",
          mt: { xs: 4, sm: 8 },
          verticalAlign: "top"
        }
      }}
    >
      <Box sx={{ p: 2, pb: 1.5, bgcolor: "background.paper" }}>
        <TextField
          autoFocus
          fullWidth
          variant="standard"
          placeholder="Type a command or search destination… (e.g. Leave, Payroll, AI)"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <SearchOutlinedIcon color="primary" sx={{ mr: 1, fontSize: 24 }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Chip label="ESC" size="small" variant="outlined" sx={{ fontWeight: 700, fontSize: 11 }} />
              </InputAdornment>
            ),
            sx: { fontSize: 16, fontWeight: 600 }
          }}
        />
      </Box>
      <Divider />
      <Box sx={{ maxHeight: 380, overflowY: "auto", p: 1 }}>
        {filtered.length === 0 ? (
          <Box sx={{ py: 4, textAlign: "center", color: "text.secondary" }}>
            <Typography variant="body2">No matching actions or destinations found.</Typography>
          </Box>
        ) : (
          <List disablePadding>
            {filtered.map((item) => {
              const Icon = item.icon;
              return (
                <ListItemButton
                  key={item.id}
                  onClick={() => handleSelect(item.path)}
                  sx={{
                    borderRadius: 2,
                    mb: 0.5,
                    py: 1,
                    px: 1.5,
                    "&:hover": { bgcolor: "action.hover" }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 38, color: "primary.main" }}>
                    <Icon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.title}
                    secondary={item.category}
                    primaryTypographyProps={{ fontWeight: 700, fontSize: 14 }}
                    secondaryTypographyProps={{ fontSize: 12 }}
                  />
                  {item.shortcut && (
                    <Chip label={item.shortcut} size="small" sx={{ height: 20, fontSize: 10, fontWeight: 750, bgcolor: "action.selected" }} />
                  )}
                </ListItemButton>
              );
            })}
          </List>
        )}
      </Box>
      <Divider />
      <Box sx={{ p: 1.5, px: 2, display: "flex", justifyContent: "space-between", alignItems: "center", bgcolor: "background.default" }}>
        <Typography variant="caption" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
          <AutoAwesomeOutlinedIcon sx={{ fontSize: 14, color: "primary.main" }} /> Enterprise Quick Command Palette
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Logged in as <b>{user?.role || "USER"}</b>
        </Typography>
      </Box>
    </Dialog>
  );
};

export default CommandPalette;
