import TrendingUpOutlinedIcon
  from "@mui/icons-material/TrendingUpOutlined";

import ReportDataPage
  from "../../components/reports/ReportDataPage";

import ReportStatusChip
  from "../../components/reports/ReportStatusChip";

import reportService
  from "../../services/reportService";

import {
  formatReportDate,
  normalizePerformanceReport
} from "../../utils/reportUtils";


const PerformanceReport = () => (
  <ReportDataPage
    title="Performance Report"
    subtitle="Review persisted performance-review results by employee and cycle."
    icon={<TrendingUpOutlinedIcon />}
    reportType="performance"
    initialFilters={{
      search: "",
      employeeId: "",
      departmentId: "",
      status: "",
      fromDate: "",
      toDate: ""
    }}
    load={reportService.getPerformanceReport}
    normalize={normalizePerformanceReport}
    filterProps={{
      showSearch: true,
      showEmployee: true,
      showDepartment: true,
      showStatus: true,
      showFromDate: true,
      showToDate: true,
      statusOptions: [
        { value: "DRAFT", label: "Draft" },
        { value: "SUBMITTED", label: "Submitted" },
        { value: "COMPLETED", label: "Completed" }
      ]
    }}
    columns={[
      { key: "employeeCode", label: "Employee ID" },
      { key: "employeeName", label: "Employee" },
      { key: "department", label: "Department" },
      { key: "cycleName", label: "Review Cycle" },
      {
        key: "reviewDate",
        label: "Review Date",
        render: row => formatReportDate(row.reviewDate)
      },
      { key: "rating", label: "Rating", align: "right" },
      {
        key: "status",
        label: "Status",
        render: row => <ReportStatusChip status={row.status} />
      }
    ]}
    emptyTitle="No performance reviews"
    emptyMessage="There are no persisted performance reviews for the selected filters."
  />
);


export default PerformanceReport;
