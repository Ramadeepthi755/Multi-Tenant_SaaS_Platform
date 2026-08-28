import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Grid,
  IconButton,
  Skeleton,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import ApartmentOutlinedIcon from "@mui/icons-material/ApartmentOutlined";
import AssessmentOutlinedIcon from "@mui/icons-material/AssessmentOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import BadgeOutlinedIcon from "@mui/icons-material/BadgeOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import CampaignOutlinedIcon from "@mui/icons-material/CampaignOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import HolidayVillageOutlinedIcon from "@mui/icons-material/HolidayVillageOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import RuleOutlinedIcon from "@mui/icons-material/RuleOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as ChartTooltip,
  XAxis,
  YAxis
} from "recharts";
import { useAuth } from "../../context/AuthContext";
import dashboardService from "../../services/dashboardService";

const CHART_COLORS = ["#2563eb", "#0f766e", "#7c3aed", "#d97706", "#db2777", "#475569"];

const Dashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      setData(await dashboardService.getDashboard());
    } catch (requestError) {
      console.error("Role dashboard request failed", requestError);
      setError(requestError?.response?.data?.message || "We couldn't refresh your dashboard. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const role = data?.role || user?.role;
  const layoutProps = { data, loading, onRefresh: loadDashboard, user };

  return (
    <Box sx={{ pb: 4 }}>
      <DashboardHeader data={data} loading={loading} user={user} onRefresh={loadDashboard} />
      {error && (
        <Alert severity="error" action={<Button color="inherit" size="small" onClick={loadDashboard}>Retry</Button>} sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}
      {role === "SUPER_ADMIN" && <SuperAdminDashboard {...layoutProps} />}
      {role === "COMPANY_ADMIN" && <CompanyAdminDashboard {...layoutProps} />}
      {role === "HR" && <HrDashboard {...layoutProps} />}
      {role === "MANAGER" && <ManagerDashboard {...layoutProps} />}
      {role === "EMPLOYEE" && <EmployeeDashboard {...layoutProps} />}
      {!loading && !error && !role && <EmptyState title="Your dashboard is unavailable" description="Your account does not currently have a supported dashboard role." />}
    </Box>
  );
};

const DashboardHeader = ({ data, loading, user, onRefresh }) => {
  const firstName = (user?.fullName || "there").trim().split(/\s+/)[0];
  const date = new Intl.DateTimeFormat("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).format(new Date());
  return (
    <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", md: "center" }} spacing={2} sx={{ mb: 3.5 }}>
      <Box>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.75 }}>
          <Typography variant="h4" sx={{ fontWeight: 850, letterSpacing: "-0.045em" }}>Good day, {firstName}</Typography>
          {!loading && data?.role && <Chip label={formatLabel(data.role)} size="small" color="primary" variant="outlined" />}
        </Stack>
        <Typography color="text.secondary">{loading ? "Loading your workspace…" : data?.scopeLabel || "Your workspace"}</Typography>
        <Typography variant="caption" color="text.secondary">{date}</Typography>
      </Box>
      <Stack direction="row" spacing={1} alignItems="center">
        {!loading && data?.companyName && <Chip icon={<ApartmentOutlinedIcon />} label={data.companyName} variant="outlined" />}
        <Tooltip title="Refresh dashboard data"><span><IconButton onClick={onRefresh} disabled={loading} color="primary" aria-label="Refresh dashboard"><RefreshOutlinedIcon /></IconButton></span></Tooltip>
      </Stack>
    </Stack>
  );
};

const SuperAdminDashboard = ({ data, loading }) => (
  <Stack spacing={2.5}>
    <KpiGrid loading={loading} data={data} cards={[
      ["totalCompanies", "Companies", ApartmentOutlinedIcon, "/companies", "All tenants on the platform"],
      ["activeCompanies", "Active companies", CheckCircleOutlineOutlinedIcon, "/companies", "Enabled tenant workspaces"],
      ["totalUsers", "Platform users", PeopleAltOutlinedIcon, "/users", "Users across all roles"],
      ["totalEmployees", "Workforce", GroupsOutlinedIcon, "/reports/employees", "Employees across tenants"]
    ]} />
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, lg: 7 }}><ChartPanel title="Workforce by company" subtitle="Employees recorded in each tenant" data={chart(data, "workforceByCompany")} loading={loading} type="bar" /></Grid>
      <Grid size={{ xs: 12, lg: 5 }}><ChartPanel title="Users by role" subtitle="Current platform access composition" data={chart(data, "usersByRole")} loading={loading} type="pie" /></Grid>
    </Grid>
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, lg: 7 }}><ActivityPanel title="Platform activity" data={data?.activities} loading={loading} /></Grid>
      <Grid size={{ xs: 12, lg: 5 }}><ItemPanel title="Recent companies" data={data?.items} loading={loading} emptyText="No companies have been added yet." /></Grid>
    </Grid>
    <AttentionAndActions data={data} loading={loading} actions={[
      ["Add company", "/companies", ApartmentOutlinedIcon], ["Manage users", "/users", PeopleAltOutlinedIcon],
      ["Roles & permissions", "/roles", RuleOutlinedIcon], ["Platform reports", "/reports", AssessmentOutlinedIcon]
    ]} />
  </Stack>
);

const CompanyAdminDashboard = ({ data, loading }) => (
  <Stack spacing={2.5}>
    <KpiGrid loading={loading} data={data} cards={[
      ["totalEmployees", "Total employees", PeopleAltOutlinedIcon, "/employees", "Company workforce"],
      ["activeEmployees", "Active employees", CheckCircleOutlineOutlinedIcon, "/employees", "Currently active profiles"],
      ["departments", "Departments", ApartmentOutlinedIcon, "/departments", "Configured teams"],
      ["pendingLeaves", "Pending HR actions", RuleOutlinedIcon, "/leave", "Leave decisions awaiting review"]
    ]} />
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, lg: 7 }}><ChartPanel title="Employee growth" subtitle="New employee profiles by month" data={chart(data, "employeeGrowth")} loading={loading} type="line" /></Grid>
      <Grid size={{ xs: 12, lg: 5 }}><ChartPanel title="Department distribution" subtitle="Current workforce composition" data={chart(data, "departmentDistribution")} loading={loading} type="pie" /></Grid>
    </Grid>
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, lg: 7 }}><ActivityPanel title="Company activity" data={data?.activities} loading={loading} /></Grid>
      <Grid size={{ xs: 12, lg: 5 }}><ItemPanel title="Recent employees" data={data?.items} loading={loading} emptyText="Employee activity will appear as your team grows." /></Grid>
    </Grid>
    <AttentionAndActions data={data} loading={loading} actions={[
      ["Add employee", "/employees", PeopleAltOutlinedIcon], ["Add department", "/departments", ApartmentOutlinedIcon],
      ["Add designation", "/designations", BadgeOutlinedIcon], ["View reports", "/reports", AssessmentOutlinedIcon]
    ]} />
  </Stack>
);

const HrDashboard = ({ data, loading }) => (
  <Stack spacing={2.5}>
    <KpiGrid loading={loading} data={data} cards={[
      ["totalEmployees", "Total employees", PeopleAltOutlinedIcon, "/employees", "Company workforce"],
      ["presentToday", "Present today", CheckCircleOutlineOutlinedIcon, "/attendance", "Recorded as present today"],
      ["pendingLeaves", "Leave approvals", RuleOutlinedIcon, "/leave", "Requests awaiting a decision"],
      ["openRecruitment", "Recruitment pipeline", WorkOutlineOutlinedIcon, "/recruitment", "Active candidate records"]
    ]} />
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, lg: 6 }}><ChartPanel title="Today's attendance" subtitle="Recorded attendance statuses" data={chart(data, "attendance")} loading={loading} type="bar" /></Grid>
      <Grid size={{ xs: 12, lg: 6 }}><ChartPanel title="Recruitment pipeline" subtitle="Candidate status distribution" data={chart(data, "recruitment")} loading={loading} type="bar" /></Grid>
    </Grid>
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, lg: 7 }}><ActivityPanel title="Recent HR activity" data={data?.activities} loading={loading} /></Grid>
      <Grid size={{ xs: 12, lg: 5 }}><ItemPanel title="Upcoming holidays" data={data?.items} loading={loading} emptyText="No upcoming holidays are configured." /></Grid>
    </Grid>
    <AttentionAndActions data={data} loading={loading} actions={[
      ["Add employee", "/employees", PeopleAltOutlinedIcon], ["Review leave", "/leave", RuleOutlinedIcon],
      ["Add holiday", "/holidays", CalendarMonthOutlinedIcon], ["Open recruitment", "/recruitment", WorkOutlineOutlinedIcon]
    ]} />
  </Stack>
);

const ManagerDashboard = ({ data, loading }) => (
  <Stack spacing={2.5}>
    <KpiGrid loading={loading} data={data} cards={[
      ["teamSize", "Team size", GroupsOutlinedIcon, "/employees", "Members in your department"],
      ["presentToday", "Present today", CheckCircleOutlineOutlinedIcon, "/attendance", "Team attendance records"],
      ["pendingLeaves", "Leave approvals", RuleOutlinedIcon, "/leave", "Team requests awaiting review"],
      ["performanceReviews", "Performance reviews", TrendingUpOutlinedIcon, "/reports/performance", "Reviews in your team"]
    ]} />
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, lg: 7 }}><ChartPanel title="Team attendance" subtitle="Today's authorised team records" data={chart(data, "teamAttendance")} loading={loading} type="bar" /></Grid>
      <Grid size={{ xs: 12, lg: 5 }}><ItemPanel title="Your team" data={data?.items} loading={loading} emptyText="No other team members are assigned to your department." /></Grid>
    </Grid>
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, lg: 7 }}><ActivityPanel title="Your recent management activity" data={data?.activities} loading={loading} /></Grid>
      <Grid size={{ xs: 12, lg: 5 }}><AttentionPanel data={data?.attention} loading={loading} /></Grid>
    </Grid>
    <QuickActions actions={[["Review leave", "/leave", RuleOutlinedIcon], ["Team attendance", "/attendance", EventAvailableOutlinedIcon], ["My team", "/employees", GroupsOutlinedIcon], ["Performance reports", "/reports/performance", TrendingUpOutlinedIcon]]} />
  </Stack>
);

const EmployeeDashboard = ({ data, loading }) => (
  <Stack spacing={2.5}>
    <PersonalAttendance data={data} loading={loading} />
    <KpiGrid loading={loading} data={data} cards={[
      ["approvedLeaveDaysThisYear", "Approved leave days", CalendarMonthOutlinedIcon, "/leave", "Used this calendar year"],
      ["pendingLeaveRequests", "Pending requests", RuleOutlinedIcon, "/leave", "Awaiting a decision"],
      ["payslips", "Payslips", PaymentsOutlinedIcon, "/payroll", "Available payroll records"],
      ["documents", "My documents", DescriptionOutlinedIcon, "/documents", "Personal uploaded documents"]
    ]} />
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, lg: 6 }}><ChartPanel title="My leave requests" subtitle="Your recorded request statuses" data={chart(data, "leaveRequests")} loading={loading} type="pie" /></Grid>
      <Grid size={{ xs: 12, lg: 6 }}><ItemPanel title="Upcoming holidays" data={data?.items} loading={loading} emptyText="No upcoming holidays are configured." /></Grid>
    </Grid>
    <Grid container spacing={2.5}>
      <Grid size={{ xs: 12, lg: 7 }}><ActivityPanel title="My notifications" data={data?.activities} loading={loading} /></Grid>
      <Grid size={{ xs: 12, lg: 5 }}><AttentionPanel data={data?.attention} loading={loading} emptyText="You're all caught up." /></Grid>
    </Grid>
    <QuickActions actions={[["My attendance", "/attendance", EventAvailableOutlinedIcon], ["Apply for leave", "/leave", CalendarMonthOutlinedIcon], ["View payslips", "/payroll", PaymentsOutlinedIcon], ["My profile", "/profile", PersonOutlineOutlinedIcon]]} />
  </Stack>
);

const PersonalAttendance = ({ data, loading }) => {
  const navigate = useNavigate();
  const detail = data?.details || {};
  return (
    <Card sx={{ overflow: "hidden", borderColor: "primary.100", background: "linear-gradient(135deg, rgba(37,99,235,0.10), rgba(15,118,110,0.06))" }}>
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" spacing={2} alignItems={{ md: "center" }}>
          <Box>
            <Typography variant="overline" color="primary.main" fontWeight={800}>Today&apos;s attendance</Typography>
            {loading ? <Skeleton width={220} height={44} /> : <Typography variant="h4" fontWeight={850}>{detail.attendanceStatus || "No attendance recorded today"}</Typography>}
            {!loading && <Typography color="text.secondary" sx={{ mt: 0.5 }}>Check-in {detail.checkIn || "—"} · Check-out {detail.checkOut || "—"} · {detail.workingHours || "—"} working hours</Typography>}
          </Box>
          <Button variant="contained" startIcon={<EventAvailableOutlinedIcon />} onClick={() => navigate("/attendance")}>Open attendance</Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

const KpiGrid = ({ cards, data, loading }) => <Grid container spacing={2.25}>{cards.map(([key, title, Icon, path, subtitle]) => <Grid key={key} size={{ xs: 12, sm: 6, lg: 3 }}><KpiCard title={title} value={metric(data, key)} subtitle={subtitle} icon={Icon} path={path} loading={loading} /></Grid>)}</Grid>;

const KpiCard = ({ title, value, subtitle, icon: Icon, path, loading }) => {
  const navigate = useNavigate();
  return <Card onClick={() => navigate(path)} sx={{ height: "100%", cursor: "pointer", "&:hover": { borderColor: "primary.light" } }}><CardContent sx={{ p: 2.5, "&:last-child": { pb: 2.5 } }}><Stack direction="row" justifyContent="space-between"><Box><Typography variant="body2" color="text.secondary" fontWeight={700}>{title}</Typography>{loading ? <Skeleton width={86} height={45} /> : <Typography variant="h4" fontWeight={850} sx={{ mt: 0.5, letterSpacing: "-0.04em" }}>{formatNumber(value)}</Typography>}<Typography variant="caption" color="text.secondary">{subtitle}</Typography></Box><Box sx={{ width: 46, height: 46, display: "grid", placeItems: "center", borderRadius: 2.5, color: "primary.main", bgcolor: "primary.50" }}><Icon /></Box></Stack></CardContent></Card>;
};

const ChartPanel = ({ title, subtitle, data, type, loading }) => <Panel title={title} subtitle={subtitle}>{loading ? <Skeleton variant="rounded" height={260} /> : data.length === 0 ? <EmptyState compact title="No data yet" description="This chart will populate once records are available." /> : <Box sx={{ height: 270 }}>{type === "line" && <ResponsiveContainer><LineChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="label" tickLine={false} axisLine={false} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} /><ChartTooltip /><Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} /></LineChart></ResponsiveContainer>}{type === "bar" && <ResponsiveContainer><BarChart data={data}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="label" tickLine={false} axisLine={false} /><YAxis allowDecimals={false} tickLine={false} axisLine={false} /><ChartTooltip /><Bar dataKey="value" radius={[7, 7, 0, 0]} fill="#2563eb" /></BarChart></ResponsiveContainer>}{type === "pie" && <ResponsiveContainer><PieChart><Pie data={data} dataKey="value" nameKey="label" innerRadius={65} outerRadius={96} paddingAngle={3}>{data.map((entry, index) => <Cell key={entry.label} fill={CHART_COLORS[index % CHART_COLORS.length]} />)}</Pie><ChartTooltip /></PieChart></ResponsiveContainer>}</Box>}</Panel>;

const ActivityPanel = ({ title, data, loading }) => <Panel title={title}>{loading ? <Skeleton variant="rounded" height={240} /> : !data?.length ? <EmptyState compact title="No activity yet" description="New activity will appear here." /> : <Stack divider={<Divider flexItem />} spacing={0}>{data.map((activity, index) => <Stack key={`${activity.title}-${index}`} direction="row" spacing={1.5} sx={{ py: 1.35 }}><Box sx={{ mt: 0.4, width: 9, height: 9, borderRadius: "50%", bgcolor: "primary.main", flexShrink: 0 }} /><Box minWidth={0}><Typography fontWeight={750}>{activity.title}</Typography><Typography variant="body2" color="text.secondary" noWrap>{activity.description}</Typography><Typography variant="caption" color="text.secondary">{formatTimestamp(activity.occurredAt)}</Typography></Box></Stack>)}</Stack>}</Panel>;

const ItemPanel = ({ title, data, loading, emptyText }) => { const navigate = useNavigate(); return <Panel title={title}>{loading ? <Skeleton variant="rounded" height={240} /> : !data?.length ? <EmptyState compact title="Nothing to show yet" description={emptyText} /> : <Stack divider={<Divider flexItem />} spacing={0}>{data.map((item, index) => <Stack key={`${item.title}-${index}`} direction="row" justifyContent="space-between" alignItems="center" sx={{ py: 1.35, cursor: item.path ? "pointer" : "default" }} onClick={() => item.path && navigate(item.path)}><Box minWidth={0}><Typography fontWeight={750} noWrap>{item.title}</Typography><Typography variant="body2" color="text.secondary" noWrap>{item.subtitle}</Typography></Box><Chip label={formatLabel(item.status)} size="small" variant="outlined" /></Stack>)}</Stack>}</Panel>; };

const AttentionAndActions = ({ data, loading, actions }) => <Grid container spacing={2.5}><Grid size={{ xs: 12, lg: 5 }}><AttentionPanel data={data?.attention} loading={loading} /></Grid><Grid size={{ xs: 12, lg: 7 }}><QuickActions actions={actions} /></Grid></Grid>;

const AttentionPanel = ({ data, loading, emptyText = "No urgent items need your attention." }) => { const navigate = useNavigate(); return <Panel title="Action centre" subtitle="Items that need follow-up">{loading ? <Skeleton variant="rounded" height={190} /> : !data?.length ? <EmptyState compact title="You&apos;re all caught up" description={emptyText} /> : <Stack spacing={1}>{data.map((item, index) => <Card key={`${item.title}-${index}`} variant="outlined" onClick={() => navigate(item.path)} sx={{ boxShadow: "none", cursor: "pointer", "&:hover": { borderColor: item.severity === "warning" ? "warning.main" : "primary.main" } }}><CardContent sx={{ py: 1.2, "&:last-child": { pb: 1.2 } }}><Typography fontWeight={750}>{item.title}</Typography><Typography variant="body2" color="text.secondary">{item.description}</Typography></CardContent></Card>)}</Stack>}</Panel>; };

const QuickActions = ({ actions }) => { const navigate = useNavigate(); return <Panel title="Quick actions" subtitle="Common tasks for your role"><Grid container spacing={1.25}>{actions.map(([label, path, Icon]) => <Grid key={path} size={{ xs: 12, sm: 6 }}><Button fullWidth variant="outlined" startIcon={<Icon />} onClick={() => navigate(path)} sx={{ justifyContent: "flex-start", minHeight: 48 }}>{label}</Button></Grid>)}</Grid></Panel>; };

const Panel = ({ title, subtitle, children }) => <Card sx={{ height: "100%", "&:hover": { transform: "none" } }}><CardContent sx={{ p: { xs: 2, sm: 2.5 }, "&:last-child": { pb: { xs: 2, sm: 2.5 } } }}>{title && <Box sx={{ mb: 2 }}><Typography fontWeight={800}>{title}</Typography>{subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}</Box>}{children}</CardContent></Card>;

const EmptyState = ({ title, description, compact = false }) => <Stack alignItems="center" justifyContent="center" textAlign="center" spacing={0.75} sx={{ minHeight: compact ? 170 : 280, px: 2 }}><CampaignOutlinedIcon color="disabled" sx={{ fontSize: compact ? 31 : 44 }} /><Typography fontWeight={750}>{title}</Typography><Typography variant="body2" color="text.secondary" sx={{ maxWidth: 330 }}>{description}</Typography></Stack>;

const metric = (data, key) => data?.metrics?.[key] ?? 0;
const chart = (data, key) => Array.isArray(data?.charts?.[key]) ? data.charts[key] : [];
const formatNumber = value => Number(value || 0).toLocaleString("en-IN");
const formatLabel = value => String(value || "—").toLowerCase().split("_").map(word => word ? word[0].toUpperCase() + word.slice(1) : word).join(" ");
const formatTimestamp = value => value ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", hour: "numeric", minute: "2-digit" }).format(new Date(value)) : "Recently";

export default Dashboard;
