import {
  Button,
  Stack
} from "@mui/material";

import DownloadOutlinedIcon
  from "@mui/icons-material/DownloadOutlined";

import RefreshOutlinedIcon
  from "@mui/icons-material/RefreshOutlined";

import {
  useState
} from "react";

import reportService
  from "../../services/reportService";


const ReportActions = ({
  reportType,
  filters,
  onRefresh,
  loading,
  onError
}) => {

  const [exporting, setExporting] =
    useState(false);

  const download = async () => {

    setExporting(true);

    try {

      const content =
        await reportService.exportReport(
          reportType,
          filters,
          "csv"
        );

      const url = URL.createObjectURL(
        new Blob([content], {
          type: "text/csv;charset=utf-8"
        })
      );

      const link = document.createElement("a");
      link.href = url;
      link.download = `${reportType}-report.csv`;
      link.click();
      URL.revokeObjectURL(url);

    } catch (requestError) {

      onError?.(
        requestError?.response?.data?.message ||
        "Unable to export this report."
      );

    } finally {

      setExporting(false);

    }

  };


  return (
    <Stack direction="row" spacing={1}>

      <Button
        variant="outlined"
        startIcon={<DownloadOutlinedIcon />}
        onClick={download}
        disabled={loading || exporting}
        sx={{ fontWeight: 800 }}
      >
        {exporting ? "Exporting" : "Export CSV"}
      </Button>

      <Button
        variant="outlined"
        startIcon={<RefreshOutlinedIcon />}
        onClick={onRefresh}
        disabled={loading}
        sx={{ fontWeight: 800 }}
      >
        Refresh
      </Button>

    </Stack>
  );
};


export default ReportActions;
