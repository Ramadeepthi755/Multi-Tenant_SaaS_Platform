import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  InputAdornment,
  MenuItem,
  Pagination,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography
} from "@mui/material";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RefreshOutlinedIcon from "@mui/icons-material/RefreshOutlined";
import FilterListOutlinedIcon from "@mui/icons-material/FilterListOutlined";

import {
  useCallback,
  useEffect,
  useState
} from "react";

import CompanyTable from "../../components/company/CompanyTable";
import CompanyForm from "../../components/company/CompanyForm";
import CompanyViewDrawer from "../../components/company/CompanyViewDrawer";
import DeleteCompanyDialog from "../../components/company/DeleteCompanyDialog";

import companyService from "../../services/companyService";

import {
  normalizeCompanyPage
} from "../../utils/companyUtils";

import PermissionButton from "../../components/permissions/PermissionButton";

import usePermissions from "../../hooks/usePermissions";


const CompanyList = () => {

  const {
    can
  } = usePermissions();


  // ==========================================================
  // DATA
  // ==========================================================

  const [companies, setCompanies] = useState([]);

  const [page, setPage] = useState(0);

  const [totalPages, setTotalPages] = useState(0);

  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");


  // ==========================================================
  // FILTERS
  // ==========================================================

  const [searchInput, setSearchInput] = useState("");

  const [search, setSearch] = useState("");

  const [status, setStatus] = useState("");

  const [sortBy, setSortBy] = useState("id");

  const [direction, setDirection] = useState("asc");


  // ==========================================================
  // SELECTION
  // ==========================================================

  const [selectedIds, setSelectedIds] = useState([]);


  // ==========================================================
  // FORM
  // ==========================================================

  const [formOpen, setFormOpen] = useState(false);

  const [formMode, setFormMode] = useState("create");

  const [selectedCompany, setSelectedCompany] = useState(null);

  const [formLoading, setFormLoading] = useState(false);

  const [formError, setFormError] = useState("");


  // ==========================================================
  // VIEW
  // ==========================================================

  const [viewOpen, setViewOpen] = useState(false);

  const [viewCompany, setViewCompany] = useState(null);


  // ==========================================================
  // DELETE
  // ==========================================================

  const [deleteOpen, setDeleteOpen] = useState(false);

  const [deleteCompany, setDeleteCompany] = useState(null);

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [deleteError, setDeleteError] = useState("");


  // ==========================================================
  // TOAST
  // ==========================================================

  const [toast, setToast] = useState({
    open: false,
    message: "",
    severity: "success"
  });


  // ==========================================================
  // LOAD COMPANIES
  // ==========================================================

  const loadCompanies = useCallback(
    async () => {

      setLoading(true);
      setError("");

      try {

        /*
         * IMPORTANT:
         * Search is now passed to the service.
         */
        const response =
          await companyService.getCompanies({
            page,
            size: 20,
            search,
            status,
            sortBy,
            direction
          });


        const normalized =
          normalizeCompanyPage(response);


        setCompanies(
          normalized.content
        );


        setTotalPages(
          normalized.totalPages
        );


        setTotalElements(
          normalized.totalElements
        );


        setSelectedIds([]);

      } catch (requestError) {

        console.error(
          "Company loading failed:",
          requestError
        );


        setCompanies([]);

        setTotalPages(0);

        setTotalElements(0);


        setError(
          requestError
            ?.response
            ?.data
            ?.message ||
          "Unable to load companies."
        );

      } finally {

        setLoading(false);
      }

    },
    [
      page,
      search,
      status,
      sortBy,
      direction
    ]
  );


  useEffect(() => {

    loadCompanies();

  }, [
    loadCompanies
  ]);


  // ==========================================================
  // SEARCH
  // ==========================================================

  const handleSearch = (event) => {

    event.preventDefault();

    setPage(0);

    setSearch(
      searchInput.trim()
    );
  };


  // ==========================================================
  // RESET FILTERS
  // ==========================================================

  const resetFilters = () => {

    setSearchInput("");

    setSearch("");

    setStatus("");

    setSortBy("id");

    setDirection("asc");

    setPage(0);
  };


  // ==========================================================
  // CREATE
  // ==========================================================

  const openCreate = () => {

    setSelectedCompany(null);

    setFormMode("create");

    setFormError("");

    setFormOpen(true);
  };


  // ==========================================================
  // EDIT
  // ==========================================================

  const openEdit = (company) => {

    setSelectedCompany(company);

    setFormMode("edit");

    setFormError("");

    setFormOpen(true);
  };


  // ==========================================================
  // VIEW
  // ==========================================================

  const openView = (company) => {

    setViewCompany(company);

    setViewOpen(true);
  };


  // ==========================================================
  // CLOSE FORM
  // ==========================================================

  const closeForm = () => {

    if (formLoading) {
      return;
    }

    setFormOpen(false);

    setFormError("");
  };


  // ==========================================================
  // SAVE
  // ==========================================================

  const handleSubmit = async (payload) => {

    setFormLoading(true);

    setFormError("");

    try {

      if (formMode === "edit") {

        await companyService.updateCompany(
          selectedCompany.id,
          payload
        );


        setToast({
          open: true,
          message:
            "Company updated successfully.",
          severity: "success"
        });

      } else {

        await companyService.createCompany(
          payload
        );


        setToast({
          open: true,
          message:
            "Company created successfully.",
          severity: "success"
        });
      }


      setFormOpen(false);

      await loadCompanies();

    } catch (requestError) {

      console.error(
        "Company save failed:",
        requestError
      );


      setFormError(
        requestError
          ?.response
          ?.data
          ?.message ||
        "Unable to save company. Please try again."
      );

    } finally {

      setFormLoading(false);
    }
  };


  // ==========================================================
  // DELETE
  // ==========================================================

  const openDelete = (company) => {

    setDeleteCompany(company);

    setDeleteError("");

    setDeleteOpen(true);
  };


  const closeDelete = () => {

    if (deleteLoading) {
      return;
    }

    setDeleteOpen(false);

    setDeleteCompany(null);

    setDeleteError("");
  };


  const handleDelete = async () => {

    if (!deleteCompany?.id) {
      return;
    }


    setDeleteLoading(true);

    setDeleteError("");


    try {

      await companyService.deleteCompany(
        deleteCompany.id
      );


      setToast({
        open: true,
        message:
          "Company deleted successfully.",
        severity: "success"
      });


      setDeleteOpen(false);

      setDeleteCompany(null);


      await loadCompanies();

    } catch (requestError) {

      console.error(
        "Company delete failed:",
        requestError
      );


      setDeleteError(
        requestError
          ?.response
          ?.data
          ?.message ||
        "Unable to delete company."
      );

    } finally {

      setDeleteLoading(false);
    }
  };


  // ==========================================================
  // STATUS
  // ==========================================================

  const handleStatusChange = async (company) => {

    if (!company?.id) {
      return;
    }


    const nextStatus =
      company.active
        ? "INACTIVE"
        : "ACTIVE";


    try {

      await companyService.updateStatus(
        company,
        nextStatus
      );


      setToast({
        open: true,
        message:
          `Company ${
            nextStatus === "ACTIVE"
              ? "activated"
              : "deactivated"
          } successfully.`,
        severity: "success"
      });


      await loadCompanies();

    } catch (requestError) {

      console.error(
        "Company status update failed:",
        requestError
      );


      setToast({
        open: true,
        message:
          requestError
            ?.response
            ?.data
            ?.message ||
          "Unable to update company status.",
        severity: "error"
      });
    }
  };


  // ==========================================================
  // SORT
  // ==========================================================

  const handleSortChange = (event) => {

    const value =
      event.target.value;


    setSortBy(value);

    setPage(0);
  };


  const toggleDirection = () => {

    setDirection(
      previous =>
        previous === "asc"
          ? "desc"
          : "asc"
    );

    setPage(0);
  };


  // ==========================================================
  // PAGE
  // ==========================================================

  const handlePageChange = (
    event,
    value
  ) => {

    setPage(value - 1);

    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };


  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <Box
      sx={{
        pb: 4
      }}
    >

      {/* ======================================================
          HEADER
      ====================================================== */}

      <Stack
        direction={{
          xs: "column",
          md: "row"
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          md: "center"
        }}
        spacing={2}
        sx={{
          mb: 3
        }}
      >

        <Box>

          <Typography
            variant="h4"
            fontWeight={900}
            sx={{
              letterSpacing:
                "-0.035em"
            }}
          >
            Companies
          </Typography>


          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5
            }}
          >
            Manage organizations,
            company status and
            corporate information.
          </Typography>

        </Box>


        <PermissionButton
          permission="COMPANY_CREATE"
          variant="contained"
          startIcon={
            <AddOutlinedIcon />
          }
          onClick={openCreate}
          sx={{
            borderRadius: 2,
            px: 2.5,
            py: 1.2,
            fontWeight: 850
          }}
        >
          Add Company
        </PermissionButton>

      </Stack>


      {/* ======================================================
          ERROR
      ====================================================== */}

      {error && (

        <Alert
          severity="error"
          sx={{
            mb: 2,
            borderRadius: 2
          }}
          action={
            <Button
              size="small"
              onClick={loadCompanies}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>

      )}


      {/* ======================================================
          FILTER BAR
      ====================================================== */}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3
        }}
      >

        <Stack
          direction={{
            xs: "column",
            md: "row"
          }}
          spacing={1.5}
        >

          {/* SEARCH */}

          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              flex: 1
            }}
          >

            <TextField
              fullWidth
              size="small"
              placeholder="Search companies..."
              value={searchInput}
              onChange={event =>
                setSearchInput(
                  event.target.value
                )
              }
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                  >
                    <SearchOutlinedIcon
                      fontSize="small"
                    />
                  </InputAdornment>
                )
              }}
            />

          </Box>


          {/* STATUS */}

          <Select
            size="small"
            value={status}
            displayEmpty
            onChange={event => {

              setStatus(
                event.target.value
              );

              setPage(0);

            }}
            sx={{
              minWidth: 160
            }}
            startAdornment={
              <FilterListOutlinedIcon
                fontSize="small"
                sx={{
                  ml: 1,
                  mr: 1
                }}
              />
            }
          >

            <MenuItem value="">
              All Statuses
            </MenuItem>

            <MenuItem value="ACTIVE">
              Active
            </MenuItem>

            <MenuItem value="INACTIVE">
              Inactive
            </MenuItem>

          </Select>


          {/* SORT */}

          <Select
            size="small"
            value={sortBy}
            onChange={handleSortChange}
            sx={{
              minWidth: 150
            }}
          >

            <MenuItem value="id">
              Sort: ID
            </MenuItem>

            <MenuItem value="companyName">
              Sort: Name
            </MenuItem>

            <MenuItem value="companyCode">
              Sort: Code
            </MenuItem>

            <MenuItem value="email">
              Sort: Email
            </MenuItem>

            <MenuItem value="phone">
              Sort: Phone
            </MenuItem>

            <MenuItem value="status">
              Sort: Status
            </MenuItem>

          </Select>


          {/* DIRECTION */}

          <Button
            variant="outlined"
            size="small"
            onClick={toggleDirection}
            sx={{
              minWidth: 90,
              fontWeight: 800
            }}
          >
            {direction === "asc"
              ? "A → Z"
              : "Z → A"}
          </Button>


          {/* REFRESH */}

          <IconButton
            onClick={loadCompanies}
            disabled={loading}
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 2
            }}
          >
            <RefreshOutlinedIcon
              className={
                loading
                  ? "company-refresh-spin"
                  : undefined
              }
            />
          </IconButton>


          {/* CLEAR */}

          {(search || status) && (

            <Button
              size="small"
              onClick={resetFilters}
              sx={{
                fontWeight: 800
              }}
            >
              Clear
            </Button>

          )}

        </Stack>

      </Paper>


      {/* ======================================================
          TABLE HEADER INFO
      ====================================================== */}

      <Stack
        direction={{
          xs: "column",
          sm: "row"
        }}
        justifyContent="space-between"
        alignItems={{
          xs: "flex-start",
          sm: "center"
        }}
        sx={{
          mb: 1.5
        }}
      >

        <Typography
          variant="body2"
          color="text.secondary"
        >
          {loading
            ? "Loading companies..."
            : `${totalElements} company${
                totalElements === 1
                  ? ""
                  : "ies"
              } found`}
        </Typography>


        {selectedIds.length > 0 && (

          <Typography
            variant="body2"
            fontWeight={800}
            color="primary.main"
          >
            {selectedIds.length} selected
          </Typography>

        )}

      </Stack>


      {/* ======================================================
          TABLE
      ====================================================== */}

      <Box
        sx={{
          position: "relative"
        }}
      >

        {loading && (

          <Box
            sx={{
              position: "absolute",
              inset: 0,
              zIndex: 2,
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "center",
              pt: 8,
              bgcolor:
                "rgba(255,255,255,0.55)",
              backdropFilter:
                "blur(2px)"
            }}
          >
            <CircularProgress />
          </Box>

        )}


        <CompanyTable
          companies={companies}
          selectedIds={selectedIds}
          onSelectionChange={
            setSelectedIds
          }
          onView={openView}
          onEdit={openEdit}
          onDelete={openDelete}
          onStatusChange={
            handleStatusChange
          }
          canUpdate={
            can("COMPANY_UPDATE")
          }
          canDelete={
            can("COMPANY_DELETE")
          }
        />

      </Box>


      {/* ======================================================
          PAGINATION
      ====================================================== */}

      {totalPages > 1 && (

        <Stack
          alignItems="center"
          sx={{
            mt: 3
          }}
        >

          <Pagination
            count={totalPages}
            page={page + 1}
            onChange={handlePageChange}
            color="primary"
            shape="rounded"
            showFirstButton
            showLastButton
          />

        </Stack>

      )}


      {/* ======================================================
          CREATE / EDIT
      ====================================================== */}

      <Dialog
        open={formOpen}
        onClose={closeForm}
        maxWidth="sm"
        fullWidth
      >

        <CompanyForm
          open={formOpen}
          mode={formMode}
          company={selectedCompany}
          loading={formLoading}
          error={formError}
          onClose={closeForm}
          onSubmit={handleSubmit}
        />

      </Dialog>


      {/* ======================================================
          VIEW
      ====================================================== */}

      <CompanyViewDrawer
        open={viewOpen}
        company={viewCompany}
        onClose={() => {

          setViewOpen(false);

          setViewCompany(null);

        }}
      />


      {/* ======================================================
          DELETE
      ====================================================== */}

      <DeleteCompanyDialog
        open={deleteOpen}
        company={deleteCompany}
        loading={deleteLoading}
        error={deleteError}
        onClose={closeDelete}
        onConfirm={handleDelete}
      />


      {/* ======================================================
          TOAST
      ====================================================== */}

      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={() =>
          setToast(previous => ({
            ...previous,
            open: false
          }))
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
      >

        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={() =>
            setToast(previous => ({
              ...previous,
              open: false
            }))
          }
          sx={{
            width: "100%"
          }}
        >
          {toast.message}
        </Alert>

      </Snackbar>

    </Box>
  );
};


export default CompanyList;