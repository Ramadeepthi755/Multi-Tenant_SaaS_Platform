import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";
import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";
import Groups2OutlinedIcon from "@mui/icons-material/Groups2Outlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import InsightsOutlinedIcon from "@mui/icons-material/InsightsOutlined";
import AccountTreeOutlinedIcon from "@mui/icons-material/AccountTreeOutlined";
import SecurityOutlinedIcon from "@mui/icons-material/SecurityOutlined";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import PlayCircleOutlineRoundedIcon from "@mui/icons-material/PlayCircleOutlineRounded";
import { useState } from "react";
import { Link } from "react-router-dom";

const features = [
  [Groups2OutlinedIcon, "Employee management", "Keep people, roles, departments and documents in one dependable workspace."],
  [AccessTimeOutlinedIcon, "Attendance", "Track daily attendance, working time and team presence with accountable records."],
  [EventAvailableOutlinedIcon, "Leave workflows", "Give teams a clear way to request, review and act on leave."],
  [PaymentsOutlinedIcon, "Payroll operations", "Organise payroll records and payslips without losing the people context."],
  [AccountTreeOutlinedIcon, "Organisation design", "Build a living view of departments, designations and reporting structure."],
  [InsightsOutlinedIcon, "Reports & analytics", "Turn the operational data your team maintains into useful workforce insight."],
];

const roles = [
  ["HR teams", "Standardise employee administration and give every request a visible owner."],
  ["Managers", "See the team context needed to make timely attendance and leave decisions."],
  ["Employees", "Find personal information, requests and documents without a service-desk detour."],
  ["Administrators", "Manage access, organisation settings and governance from one secure foundation."],
];

const Landing = () => {
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  return (
  <Box sx={{ bgcolor: "#fbfdff", color: "#0f172a", overflow: "hidden" }}>
    <Box component="header" sx={{ borderBottom: "1px solid #e8eef7", bgcolor: "rgba(251,253,255,.92)", backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 10 }}>
      <Container maxWidth="xl" sx={{ height: 72, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 2 }}>
        <Stack direction="row" spacing={1.25} alignItems="center">
          <Box sx={{ width: 34, height: 34, display: "grid", placeItems: "center", borderRadius: 2, bgcolor: "#2563eb", color: "white", fontWeight: 900 }}>H</Box>
          <Typography fontWeight={850} letterSpacing="-.04em">Horizon HR</Typography>
        </Stack>
        <Stack direction="row" spacing={3} sx={{ display: { xs: "none", md: "flex" } }}>
          {[["Features", "#features"], ["Solutions", "#solutions"], ["Pricing", "#pricing"], ["About", "#about"], ["Contact", "#contact"]].map(([label, href]) => (
            <Typography key={label} component="a" href={href} variant="body2" sx={{ color: "#475569", fontWeight: 650, "&:hover": { color: "primary.main" } }}>{label}</Typography>
          ))}
        </Stack>
        <Stack direction="row" spacing={1} alignItems="center">
          <Button component={Link} to="/login" color="inherit" sx={{ display: { xs: "none", sm: "inline-flex" } }}>Log in</Button>
          <Button component={Link} to="/login" variant="contained" endIcon={<ArrowForwardRoundedIcon />} sx={{ px: 2.25 }}>Get started</Button>
          <IconButton aria-label={mobileNavigationOpen ? "Close navigation" : "Open navigation"} aria-expanded={mobileNavigationOpen} onClick={() => setMobileNavigationOpen(open => !open)} sx={{ display: { md: "none" } }}><MenuRoundedIcon /></IconButton>
        </Stack>
      </Container>
      {mobileNavigationOpen && <Box sx={{ display: { md: "none" }, borderTop: "1px solid #e8eef7", bgcolor: "#fbfdff" }}><Container maxWidth="xl" sx={{ py: 2 }}><Stack spacing={1.25}>{[["Features", "#features"], ["Solutions", "#solutions"], ["Pricing", "#pricing"], ["About", "#about"], ["Contact", "#contact"]].map(([label, href]) => <Typography key={label} component="a" href={href} onClick={() => setMobileNavigationOpen(false)} sx={{ py: .5, color: "#334155", fontWeight: 700 }}>{label}</Typography>)}<Button component={Link} to="/login" onClick={() => setMobileNavigationOpen(false)} variant="outlined">Log in</Button></Stack></Container></Box>}
    </Box>

    <Box component="main">
      <Container maxWidth="xl" sx={{ pt: { xs: 8, md: 13 }, pb: { xs: 9, md: 14 } }}>
        <Grid container spacing={{ xs: 6, lg: 8 }} alignItems="center">
          <Grid size={{ xs: 12, lg: 6 }}>
            <Chip label="Modern workforce operations" size="small" sx={{ bgcolor: "#eaf2ff", color: "#1d4ed8", fontWeight: 750, mb: 2.5 }} />
            <Typography component="h1" sx={{ fontSize: { xs: "2.9rem", sm: "3.7rem", lg: "4.35rem" }, lineHeight: 1.03, fontWeight: 900, letterSpacing: "-.065em", maxWidth: 690 }}>
              One focused platform for your entire workforce.
            </Typography>
            <Typography sx={{ fontSize: { xs: "1.06rem", md: "1.2rem" }, color: "#475569", maxWidth: 590, mt: 3, lineHeight: 1.7 }}>
              Horizon HR brings everyday people operations into a single, role-aware workspace—so your HR team can spend less time chasing updates and more time supporting people.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 4 }}>
              <Button component={Link} to="/login" variant="contained" size="large" endIcon={<ArrowForwardRoundedIcon />}>Enter your workspace</Button>
              <Button component="a" href="#how-it-works" variant="outlined" size="large" startIcon={<PlayCircleOutlineRoundedIcon />}>See how it works</Button>
            </Stack>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2.5} sx={{ mt: 4, color: "#475569" }}>
              {["Role-based access", "Real operational data", "Responsive by design"].map((item) => <Stack key={item} direction="row" spacing={.75} alignItems="center"><CheckCircleRoundedIcon color="primary" fontSize="small" /><Typography variant="body2" fontWeight={650}>{item}</Typography></Stack>)}
            </Stack>
          </Grid>
          <Grid size={{ xs: 12, lg: 6 }}>
            <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, border: "1px solid #dbe7f7", borderRadius: 5, boxShadow: "0 28px 80px rgba(15, 23, 42, .14)", bgcolor: "#fff" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}><Box><Typography fontWeight={800}>Your authenticated workspace</Typography><Typography variant="body2" color="text.secondary">Live workforce data appears after sign in.</Typography></Box><Chip label="Role-aware access" size="small" color="primary" variant="outlined" /></Stack>
              <Grid container spacing={1.5}>{[["Employee records", "#2563eb"], ["Attendance", "#0f9f6e"], ["Leave workflows", "#d97706"]].map(([label, color]) => <Grid key={label} size={{ xs: 12, sm: 4 }}><Box sx={{ p: 1.75, bgcolor: "#f8fafc", borderRadius: 3, borderLeft: `3px solid ${color}` }}><Typography variant="caption" color="text.secondary">{label}</Typography><Skeleton width="58%" height={34} sx={{ mt: .25 }} /></Box></Grid>)}</Grid>
              <Grid container spacing={1.5} sx={{ mt: .25 }}>
                <Grid size={{ xs: 12, md: 7 }}><Box sx={{ p: 2, minHeight: 190, border: "1px solid #edf1f7", borderRadius: 3 }}><Typography fontWeight={750} variant="body2">Attendance analytics</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Trends reflect only recorded attendance in your authorised scope.</Typography><Stack spacing={1.15} sx={{ mt: 2 }}>{[1, 2, 3].map(item => <Skeleton key={item} variant="rounded" height={18} width={`${100 - item * 16}%`} />)}</Stack></Box></Grid>
                <Grid size={{ xs: 12, md: 5 }}><Box sx={{ p: 2, minHeight: 190, border: "1px solid #edf1f7", borderRadius: 3 }}><Typography fontWeight={750} variant="body2">Action centre</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>Approvals and notifications are assigned by role.</Typography><Stack spacing={1.2} sx={{ mt: 2 }}>{["Requests", "Onboarding", "Documents"].map(item => <Stack key={item} direction="row" justifyContent="space-between" alignItems="center"><Typography variant="caption" fontWeight={650}>{item}</Typography><Chip size="small" label="Secure" sx={{ height: 21, fontSize: 11 }} /></Stack>)}</Stack></Box></Grid>
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>

      <Box id="features" sx={{ py: { xs: 8, md: 12 }, bgcolor: "#f4f8ff" }}>
        <Container maxWidth="xl"><Box sx={{ maxWidth: 680, mb: 5 }}><Typography color="primary" fontWeight={800} variant="overline">The operating system for people teams</Typography><Typography variant="h2" sx={{ mt: 1 }}>Everything your team needs to move work forward.</Typography><Typography color="text.secondary" sx={{ mt: 1.25 }}>Start with the foundations that keep employee operations accurate, accessible and accountable.</Typography></Box><Grid container spacing={2}>{features.map(([Icon, title, description]) => <Grid key={title} size={{ xs: 12, sm: 6, lg: 4 }}><Paper elevation={0} sx={{ p: 3, height: "100%", border: "1px solid #e1e9f5", borderRadius: 4, transition: "transform .2s", "&:hover": { transform: "translateY(-4px)" } }}><Box sx={{ width: 44, height: 44, display: "grid", placeItems: "center", borderRadius: 2.5, bgcolor: "#eaf2ff", color: "#2563eb" }}><Icon /></Box><Typography variant="h6" sx={{ mt: 2 }}>{title}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{description}</Typography></Paper></Grid>)}</Grid></Container>
      </Box>

      <Container id="how-it-works" maxWidth="xl" sx={{ py: { xs: 8, md: 13 } }}>
        <Grid container spacing={6} alignItems="center"><Grid size={{ xs: 12, md: 5 }}><Typography color="primary" fontWeight={800} variant="overline">A clearer rhythm of work</Typography><Typography variant="h2" sx={{ mt: 1 }}>From setup to insight, without the admin drag.</Typography><Typography color="text.secondary" sx={{ mt: 2 }}>Horizon HR puts the right next action in front of the right person while keeping the source data in one place.</Typography></Grid><Grid size={{ xs: 12, md: 7 }}><Stack spacing={1.5}>{[["01", "Shape your organisation", "Set up company structure, departments, designations and access."], ["02", "Bring employee data together", "Maintain the records that power attendance, leave, documents and payroll."], ["03", "Keep requests moving", "Make approval status visible to HR, managers and employees."], ["04", "Learn from the work", "Use real operational activity to guide your next people decision."]].map(([number, title, copy]) => <Stack key={number} direction="row" spacing={2} sx={{ p: 2.25, border: "1px solid #e7edf5", borderRadius: 3, bgcolor: "white" }}><Typography color="primary" fontWeight={900}>{number}</Typography><Box><Typography fontWeight={800}>{title}</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .35 }}>{copy}</Typography></Box></Stack>)}</Stack></Grid></Grid>
      </Container>

      <Box id="solutions" sx={{ py: { xs: 8, md: 12 }, bgcolor: "#0f172a", color: "white" }}><Container maxWidth="xl"><Box sx={{ maxWidth: 670, mb: 5 }}><Typography color="#93c5fd" fontWeight={800} variant="overline">One system, tuned to each role</Typography><Typography variant="h2" sx={{ mt: 1 }}>A better experience for everyone involved.</Typography></Box><Grid container spacing={2}>{roles.map(([title, description]) => <Grid key={title} size={{ xs: 12, sm: 6, lg: 3 }}><Box sx={{ p: 3, height: "100%", border: "1px solid #334155", borderRadius: 4, bgcolor: "rgba(255,255,255,.04)" }}><SecurityOutlinedIcon sx={{ color: "#93c5fd" }} /><Typography variant="h6" sx={{ mt: 2 }}>{title}</Typography><Typography variant="body2" sx={{ mt: 1, color: "#cbd5e1" }}>{description}</Typography></Box></Grid>)}</Grid></Container></Box>

      <Container id="about" maxWidth="xl" sx={{ py: { xs: 8, md: 12 } }}><Grid container spacing={3}>{[["One platform", "A shared workplace for the people processes that span every team."], ["Role-aware", "Access is designed around responsibility—not just a hidden navigation item."], ["Built for clarity", "Real information, deliberate empty states, and no pretend actions."]].map(([value, label]) => <Grid key={value} size={{ xs: 12, md: 4 }}><Box sx={{ p: { xs: 2.5, md: 3.5 }, borderLeft: "3px solid #2563eb" }}><Typography variant="h3">{value}</Typography><Typography color="text.secondary" sx={{ mt: 1 }}>{label}</Typography></Box></Grid>)}</Grid></Container>

      <Box id="pricing" sx={{ py: { xs: 8, md: 12 }, bgcolor: "#f4f8ff" }}><Container maxWidth="md"><Box textAlign="center" sx={{ mb: 5 }}><Typography color="primary" fontWeight={800} variant="overline">Simple pricing, when you are ready</Typography><Typography variant="h2" sx={{ mt: 1 }}>Choose the plan that matches your organisation.</Typography><Typography color="text.secondary" sx={{ mt: 1.25 }}>Pricing is presented for planning only. Subscription billing is not enabled in this portal.</Typography></Box><Grid container spacing={2}>{[["Foundation", "For a focused people-ops hub", ["Employee directory", "Attendance & leave", "Organisation structure"]], ["Growth", "For connected HR operations", ["Everything in Foundation", "Payroll records", "Workforce analytics"]], ["Enterprise", "For governed workforce operations", ["Everything in Growth", "Advanced controls", "Dedicated implementation"]]].map(([title, tagline, items], index) => <Grid key={title} size={{ xs: 12, md: 4 }}><Paper elevation={0} sx={{ p: 3, height: "100%", border: index === 1 ? "2px solid #2563eb" : "1px solid #dce6f3", borderRadius: 4 }}><Typography fontWeight={850} variant="h5">{title}</Typography><Typography color="text.secondary" variant="body2" sx={{ mt: 1, minHeight: 42 }}>{tagline}</Typography><Typography sx={{ mt: 3, fontSize: "1.5rem", fontWeight: 850 }}>Talk to us</Typography><Stack spacing={1.1} sx={{ mt: 2.5 }}>{items.map(item => <Stack key={item} direction="row" spacing={1} alignItems="center"><CheckCircleRoundedIcon color="success" fontSize="small" /><Typography variant="body2">{item}</Typography></Stack>)}</Stack><Button component="a" href="#contact" fullWidth variant={index === 1 ? "contained" : "outlined"} sx={{ mt: 3 }}>Discuss this plan</Button></Paper></Grid>)}</Grid></Container></Box>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}><Box textAlign="center" sx={{ mb: 5 }}><Typography color="primary" fontWeight={800} variant="overline">Frequently asked questions</Typography><Typography variant="h2" sx={{ mt: 1 }}>The essentials, answered.</Typography></Box><Stack spacing={1.25}>{[["Is Horizon HR a public employee directory?", "No. The workspace is designed for authenticated users and role-aware access."], ["Does the portal use made-up operational data?", "No. Internal dashboards and lists are intended to use the data maintained in the application, with clear empty states where none exists."], ["Can we subscribe or pay through the portal?", "Not yet. Pricing is informational until subscription billing is intentionally enabled."], ["Can our branding be changed?", "Yes. The product name, colours and logo treatment are structured to be straightforward to customise."]].map(([question, answer]) => <Paper key={question} elevation={0} sx={{ p: 2.5, border: "1px solid #e5edf7", borderRadius: 3 }}><Typography fontWeight={800}>{question}</Typography><Typography color="text.secondary" variant="body2" sx={{ mt: .75 }}>{answer}</Typography></Paper>)}</Stack></Container>

      <Box id="contact" sx={{ bgcolor: "#2563eb", color: "white", py: { xs: 7, md: 10 } }}><Container maxWidth="md" sx={{ textAlign: "center" }}><Typography variant="h2">Make people operations feel lighter.</Typography><Typography sx={{ mt: 1.5, color: "#dbeafe" }}>Give your team a clear, secure home for the work that keeps the organisation moving.</Typography><Button component={Link} to="/login" variant="contained" color="inherit" endIcon={<ArrowForwardRoundedIcon />} sx={{ mt: 3, bgcolor: "white", color: "#1d4ed8", "&:hover": { bgcolor: "#eff6ff" } }}>Get started</Button></Container></Box>
    </Box>

    <Box component="footer" sx={{ bgcolor: "#0b1220", color: "#cbd5e1", py: 5 }}><Container maxWidth="xl"><Grid container spacing={3}><Grid size={{ xs: 12, md: 4 }}><Stack direction="row" spacing={1} alignItems="center"><Box sx={{ width: 28, height: 28, display: "grid", placeItems: "center", borderRadius: 1.5, bgcolor: "#2563eb", color: "white", fontSize: 13, fontWeight: 900 }}>H</Box><Typography color="white" fontWeight={800}>Horizon HR</Typography></Stack><Typography variant="body2" sx={{ mt: 1.5, maxWidth: 300 }}>A practical workspace for modern workforce operations.</Typography></Grid><Grid size={{ xs: 6, md: 2 }}><Typography color="white" fontWeight={750} variant="body2">Product</Typography><Stack spacing={.75} sx={{ mt: 1.25 }}>{["Features", "Solutions", "Pricing"].map(x => <Typography key={x} component="a" href={`#${x.toLowerCase()}`} variant="body2">{x}</Typography>)}</Stack></Grid><Grid size={{ xs: 6, md: 2 }}><Typography color="white" fontWeight={750} variant="body2">Company</Typography><Stack spacing={.75} sx={{ mt: 1.25 }}>{["About", "Contact", "Careers"].map(x => <Typography key={x} variant="body2">{x}</Typography>)}</Stack></Grid><Grid size={{ xs: 6, md: 2 }}><Typography color="white" fontWeight={750} variant="body2">Resources</Typography><Stack spacing={.75} sx={{ mt: 1.25 }}>{["Help centre", "System status", "Security"].map(x => <Typography key={x} variant="body2">{x}</Typography>)}</Stack></Grid><Grid size={{ xs: 6, md: 2 }}><Typography color="white" fontWeight={750} variant="body2">Legal</Typography><Stack spacing={.75} sx={{ mt: 1.25 }}>{["Privacy", "Terms", "Accessibility"].map(x => <Typography key={x} variant="body2">{x}</Typography>)}</Stack></Grid></Grid><Divider sx={{ borderColor: "#243047", my: 4 }} /><Typography variant="caption" sx={{ color: "#94a3b8" }}>© {new Date().getFullYear()} Horizon HR. Built for people-first operations.</Typography></Container></Box>
  </Box>
  );
};

export default Landing;
