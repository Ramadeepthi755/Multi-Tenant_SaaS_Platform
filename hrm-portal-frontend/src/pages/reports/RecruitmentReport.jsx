import WorkOutlineOutlinedIcon
  from "@mui/icons-material/WorkOutlineOutlined";

import ReportDataPage
  from "../../components/reports/ReportDataPage";

import ReportStatusChip
  from "../../components/reports/ReportStatusChip";

import reportService
  from "../../services/reportService";

import {
  formatReportDate,
  normalizeRecruitmentReport
} from "../../utils/reportUtils";


const recruitmentStatuses = [
  ["APPLIED", "Applied"],
  ["SHORTLISTED", "Shortlisted"],
  ["INTERVIEW_SCHEDULED", "Interview scheduled"],
  ["SELECTED", "Selected"],
  ["REJECTED", "Rejected"],
  ["JOINED", "Joined"]
].map(([value, label]) => ({ value, label }));


const RecruitmentReport = () => (
  <ReportDataPage
    title="Recruitment Report"
    subtitle="Track candidate pipeline activity using live recruitment data."
    icon={<WorkOutlineOutlinedIcon />}
    reportType="recruitment"
    initialFilters={{
      search: "",
      status: "",
      fromDate: "",
      toDate: ""
    }}
    load={reportService.getRecruitmentReport}
    normalize={normalizeRecruitmentReport}
    filterProps={{
      showSearch: true,
      showStatus: true,
      showFromDate: true,
      showToDate: true,
      statusOptions: recruitmentStatuses
    }}
    columns={[
      { key: "candidateName", label: "Candidate" },
      { key: "email", label: "Email" },
      { key: "experience", label: "Experience" },
      { key: "currentCompany", label: "Current Company" },
      {
        key: "appliedAt",
        label: "Applied",
        render: row => formatReportDate(row.appliedAt)
      },
      {
        key: "status",
        label: "Status",
        render: row => <ReportStatusChip status={row.status} />
      }
    ]}
    emptyTitle="No recruitment records"
    emptyMessage="No candidates match the selected report filters."
  />
);


export default RecruitmentReport;
