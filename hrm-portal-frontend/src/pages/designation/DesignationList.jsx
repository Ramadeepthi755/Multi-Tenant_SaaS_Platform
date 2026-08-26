import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  IconButton,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Stack,
  TextField,
  Typography
} from "@mui/material";

import SearchOutlinedIcon
  from "@mui/icons-material/SearchOutlined";

import AddOutlinedIcon
  from "@mui/icons-material/AddOutlined";

import RefreshOutlinedIcon
  from "@mui/icons-material/RefreshOutlined";

import BadgeOutlinedIcon
  from "@mui/icons-material/BadgeOutlined";

import CheckCircleOutlineOutlinedIcon
  from "@mui/icons-material/CheckCircleOutlineOutlined";

import BlockOutlinedIcon
  from "@mui/icons-material/BlockOutlined";

import GroupsOutlinedIcon
  from "@mui/icons-material/GroupsOutlined";

import {
  useCallback,
  useEffect,
  useMemo,
  useState
} from "react";


/*
|--------------------------------------------------------------------------
| COMPONENTS
|--------------------------------------------------------------------------
*/

import DesignationTable
  from "../../components/designation/DesignationTable";

import DesignationForm
  from "../../components/designation/DesignationForm";

import DesignationViewDrawer
  from "../../components/designation/DesignationViewDrawer";

import DeleteDesignationDialog
  from "../../components/designation/DeleteDesignationDialog";


/*
|--------------------------------------------------------------------------
| SERVICES
|--------------------------------------------------------------------------
*/

import designationService
  from "../../services/designationService";

import companyService
  from "../../services/companyService";

import departmentService
  from "../../services/departmentService";


/*
|--------------------------------------------------------------------------
| PERMISSIONS
|--------------------------------------------------------------------------
*/

import PermissionButton
  from "../../components/permissions/PermissionButton";

import usePermissions
  from "../../hooks/usePermissions";


/*
|--------------------------------------------------------------------------
| HELPERS
|--------------------------------------------------------------------------
*/

const getDesignationId = (
  designation
) => {

  return (
    designation?.designationId ??
    designation?.id ??
    null
  );

};


const getDepartmentId = (
  department
) => {

  return (
    department?.departmentId ??
    department?.id ??
    null
  );

};


const getCompanyId = (
  company
) => {

  return (
    company?.companyId ??
    company?.id ??
    null
  );

};


const getDepartmentCompanyId = (
  department
) => {

  return (
    department?.companyId ??
    department?.company?.companyId ??
    department?.company?.id ??
    null
  );

};


const getDepartmentName = (
  department
) => {

  return (
    department?.departmentName ??
    department?.name ??
    ""
  );

};


const getCompanyName = (
  company
) => {

  return (
    company?.companyName ??
    company?.name ??
    ""
  );

};


/*
|--------------------------------------------------------------------------
| NORMALIZE RESPONSE
|--------------------------------------------------------------------------
*/

const normalizeDesignationResponse = (
  response
) => {

  if (
    Array.isArray(response)
  ) {

    return {
      content: response,
      totalElements:
        response.length,
      totalPages:
        response.length > 0
          ? 1
          : 0
    };

  }


  if (
    response &&
    Array.isArray(
      response.content
    )
  ) {

    return {
      content:
        response.content,

      totalElements:
        Number(
          response.totalElements
        ) ||
        response.content.length,

      totalPages:
        Number(
          response.totalPages
        ) ||
        (
          response.content.length > 0
            ? 1
            : 0
        )
    };

  }


  return {
    content: [],
    totalElements: 0,
    totalPages: 0
  };

};


/*
|--------------------------------------------------------------------------
| ERROR MESSAGE
|--------------------------------------------------------------------------
*/

const getDesignationErrorMessage = (
  error,
  fallback
) => {

  return (
    error
      ?.response
      ?.data
      ?.message ||

    error
      ?.response
      ?.data
      ?.error ||

    error?.message ||

    fallback
  );

};


/*
|--------------------------------------------------------------------------
| COMPONENT
|--------------------------------------------------------------------------
*/

const DesignationList = () => {

  const {
    can
  } = usePermissions();


  /*
  |--------------------------------------------------------------------------
  | DATA
  |--------------------------------------------------------------------------
  */

  const [
    designations,
    setDesignations
  ] = useState([]);


  const [
    companies,
    setCompanies
  ] = useState([]);


  const [
    departments,
    setDepartments
  ] = useState([]);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    referenceLoading,
    setReferenceLoading
  ] = useState(false);


  const [
    error,
    setError
  ] = useState("");


  const [
    totalElements,
    setTotalElements
  ] = useState(0);


  /*
  |--------------------------------------------------------------------------
  | FILTERS
  |--------------------------------------------------------------------------
  */

  const [
    searchInput,
    setSearchInput
  ] = useState("");


  const [
    search,
    setSearch
  ] = useState("");


  const [
    status,
    setStatus
  ] = useState("");


  const [
    companyId,
    setCompanyId
  ] = useState("");


  const [
    departmentId,
    setDepartmentId
  ] = useState("");


  const [
    sortBy,
    setSortBy
  ] = useState("id");


  const [
    direction,
    setDirection
  ] = useState("asc");


  /*
  |--------------------------------------------------------------------------
  | FORM
  |--------------------------------------------------------------------------
  */

  const [
    formOpen,
    setFormOpen
  ] = useState(false);


  const [
    formMode,
    setFormMode
  ] = useState("create");


  const [
    selectedDesignation,
    setSelectedDesignation
  ] = useState(null);


  const [
    formLoading,
    setFormLoading
  ] = useState(false);


  const [
    formError,
    setFormError
  ] = useState("");


  /*
  |--------------------------------------------------------------------------
  | VIEW
  |--------------------------------------------------------------------------
  */

  const [
    viewOpen,
    setViewOpen
  ] = useState(false);


  const [
    viewDesignation,
    setViewDesignation
  ] = useState(null);


  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  const [
    deleteOpen,
    setDeleteOpen
  ] = useState(false);


  const [
    deleteDesignation,
    setDeleteDesignation
  ] = useState(null);


  const [
    deleteLoading,
    setDeleteLoading
  ] = useState(false);


  const [
    deleteError,
    setDeleteError
  ] = useState("");


  /*
  |--------------------------------------------------------------------------
  | TOAST
  |--------------------------------------------------------------------------
  */

  const [
    toast,
    setToast
  ] = useState({
    open: false,
    message: "",
    severity: "success"
  });


  /*
  |--------------------------------------------------------------------------
  | LOAD COMPANIES
  |--------------------------------------------------------------------------
  */

  const loadCompanies =
    useCallback(
      async () => {

        try {

          const response =
            await companyService.getCompanies({
              page: 0,
              size: 100,
              sortBy: "companyName",
              direction: "asc"
            });


          const content =
            Array.isArray(
              response?.content
            )
              ? response.content
              : Array.isArray(response)
                ? response
                : [];


          setCompanies(
            content
          );

        } catch (requestError) {

          console.error(
            "Company loading failed:",
            requestError
          );

          setCompanies([]);

        }

      },
      []
    );


  /*
  |--------------------------------------------------------------------------
  | LOAD DEPARTMENTS
  |--------------------------------------------------------------------------
  */

  const loadDepartments =
    useCallback(
      async () => {

        try {

          const response =
            await departmentService
              .getDepartments();


          const content =
            Array.isArray(response)
              ? response
              : Array.isArray(
                  response?.content
                )
                ? response.content
                : [];


          setDepartments(
            content
          );

        } catch (requestError) {

          console.error(
            "Department loading failed:",
            requestError
          );

          setDepartments([]);

        }

      },
      []
    );


  /*
  |--------------------------------------------------------------------------
  | LOAD REFERENCE DATA
  |--------------------------------------------------------------------------
  */

  const loadReferenceData =
    useCallback(
      async () => {

        setReferenceLoading(
          true
        );


        try {

          await Promise.all([
            loadCompanies(),
            loadDepartments()
          ]);

        } catch (requestError) {

          console.error(
            "Reference data loading failed:",
            requestError
          );

        } finally {

          setReferenceLoading(
            false
          );

        }

      },
      [
        loadCompanies,
        loadDepartments
      ]
    );


  /*
  |--------------------------------------------------------------------------
  | BUILD LOOKUP MAPS
  |--------------------------------------------------------------------------
  */

  const departmentMap =
    useMemo(() => {

      const map =
        new Map();


      departments.forEach(
        department => {

          const id =
            getDepartmentId(
              department
            );


          if (
            id !== null &&
            id !== undefined
          ) {

            map.set(
              String(id),
              department
            );

          }

        }
      );


      return map;

    }, [
      departments
    ]);


  const companyMap =
    useMemo(() => {

      const map =
        new Map();


      companies.forEach(
        company => {

          const id =
            getCompanyId(
              company
            );


          if (
            id !== null &&
            id !== undefined
          ) {

            map.set(
              String(id),
              company
            );

          }

        }
      );


      return map;

    }, [
      companies
    ]);


  /*
  |--------------------------------------------------------------------------
  | ENRICH DESIGNATIONS
  |--------------------------------------------------------------------------
  |
  | This is the main fix.
  |
  | API:
  |
  | Designation
  |    ↓ departmentId
  | Department
  |    ↓ companyId
  | Company
  |
  | We put the resolved values back into the
  | designation object before passing it to
  | DesignationTable.
  |
  |--------------------------------------------------------------------------
  */

  const enrichDesignations = useCallback(
    (
      items
    ) => {

      return items.map(
        designation => {

          const currentDepartmentId =
            designation?.departmentId ??
            designation?.department?.departmentId ??
            designation?.department?.id ??
            null;


          const department =
            currentDepartmentId !== null
              ? departmentMap.get(
                  String(
                    currentDepartmentId
                  )
                )
              : null;


          /*
           * Resolve department name.
           */

          const departmentName =
  (
    designation?.departmentName ??
    designation?.department?.departmentName ??
    getDepartmentName(department)
  ) || "—";


          /*
           * Resolve company ID.
           */

          let currentCompanyId =
            designation?.companyId ??
            designation?.company?.companyId ??
            designation?.company?.id ??
            getDepartmentCompanyId(
              department
            );


          /*
           * Resolve company object.
           */

          let company =
            currentCompanyId !== null &&
            currentCompanyId !== undefined
              ? companyMap.get(
                  String(
                    currentCompanyId
                  )
                )
              : null;


          /*
           * Fallback:
           *
           * Department may have companyName but
           * not companyId.
           */

          if (
            !company &&
            department
          ) {

            const departmentCompanyName =
              String(
                department?.companyName ??
                department?.company?.companyName ??
                department?.company?.name ??
                ""
              )
                .trim()
                .toLowerCase();


            if (
              departmentCompanyName
            ) {

              company =
                companies.find(
                  item =>
                    String(
                      getCompanyName(
                        item
                      )
                    )
                      .trim()
                      .toLowerCase() ===
                    departmentCompanyName
                ) ?? null;


              if (company) {

                currentCompanyId =
                  getCompanyId(
                    company
                  );

              }

            }

          }


          /*
           * Final company name.
           */

          const companyName =
  (
    designation?.companyName ??
    designation?.company?.companyName ??
    getCompanyName(company)
  ) || "—";

          return {

            ...designation,

            departmentId:
              currentDepartmentId,

            departmentName:
              departmentName,

            companyId:
              currentCompanyId,

            companyName:
              companyName

          };

        }
      );

    },
    [
      departmentMap,
      companyMap,
      companies
    ]
  );


  /*
  |--------------------------------------------------------------------------
  | LOAD DESIGNATIONS
  |--------------------------------------------------------------------------
  */

  const loadDesignations =
    useCallback(
      async () => {

        setLoading(true);

        setError("");


        try {

          const response =
            await designationService
              .getDesignations({
                search,
                status,
                companyId,
                departmentId
              });


          const normalized =
            normalizeDesignationResponse(
              response
            );


          /*
           * FIRST:
           *
           * Resolve Department + Company.
           */

          let content =
            enrichDesignations(
              normalized.content
            );


          /*
          |--------------------------------------------------------------------------
          | SEARCH
          |--------------------------------------------------------------------------
          */

          if (
            search &&
            search.trim()
          ) {

            const keyword =
              search
                .trim()
                .toLowerCase();


            content =
              content.filter(
                designation => {

                  const values = [

                    designation.designationName,

                    designation.designationCode,

                    designation.description,

                    designation.departmentName,

                    designation.companyName

                  ];


                  return values.some(
                    value =>
                      String(
                        value || ""
                      )
                        .toLowerCase()
                        .includes(
                          keyword
                        )
                  );

                }
              );

          }


          /*
          |--------------------------------------------------------------------------
          | STATUS
          |--------------------------------------------------------------------------
          */

          if (status) {

            content =
              content.filter(
                designation => {

                  const currentStatus =
                    String(
                      designation.status ||
                      (
                        designation.active === false
                          ? "INACTIVE"
                          : "ACTIVE"
                      )
                    ).toUpperCase();


                  return (
                    currentStatus ===
                    status
                  );

                }
              );

          }


          /*
          |--------------------------------------------------------------------------
          | COMPANY FILTER
          |--------------------------------------------------------------------------
          */

          if (companyId) {

            content =
              content.filter(
                designation => {

                  return (
                    String(
                      designation.companyId ??
                      ""
                    ) ===
                    String(
                      companyId
                    )
                  );

                }
              );

          }


          /*
          |--------------------------------------------------------------------------
          | DEPARTMENT FILTER
          |--------------------------------------------------------------------------
          */

          if (departmentId) {

            content =
              content.filter(
                designation => {

                  return (
                    String(
                      designation.departmentId ??
                      ""
                    ) ===
                    String(
                      departmentId
                    )
                  );

                }
              );

          }


          /*
          |--------------------------------------------------------------------------
          | SORT
          |--------------------------------------------------------------------------
          */

          content =
            [...content].sort(
              (
                first,
                second
              ) => {

                let firstValue;

                let secondValue;


                if (
                  sortBy ===
                  "designationName"
                ) {

                  firstValue =
                    String(
                      first.designationName ||
                      ""
                    ).toLowerCase();


                  secondValue =
                    String(
                      second.designationName ||
                      ""
                    ).toLowerCase();

                }

                else if (
                  sortBy ===
                  "designationCode"
                ) {

                  firstValue =
                    String(
                      first.designationCode ||
                      ""
                    ).toLowerCase();


                  secondValue =
                    String(
                      second.designationCode ||
                      ""
                    ).toLowerCase();

                }

                else if (
                  sortBy ===
                  "status"
                ) {

                  firstValue =
                    String(
                      first.status ||
                      ""
                    ).toLowerCase();


                  secondValue =
                    String(
                      second.status ||
                      ""
                    ).toLowerCase();

                }

                else {

                  firstValue =
                    Number(
                      getDesignationId(
                        first
                      ) || 0
                    );


                  secondValue =
                    Number(
                      getDesignationId(
                        second
                      ) || 0
                    );

                }


                if (
                  firstValue <
                  secondValue
                ) {

                  return (
                    direction ===
                    "asc"
                  )
                    ? -1
                    : 1;

                }


                if (
                  firstValue >
                  secondValue
                ) {

                  return (
                    direction ===
                    "asc"
                  )
                    ? 1
                    : -1;

                }


                return 0;

              }
            );


          /*
          |--------------------------------------------------------------------------
          | SAVE
          |--------------------------------------------------------------------------
          */

          setDesignations(
            content
          );


          setTotalElements(
            content.length
          );


        } catch (requestError) {

          console.error(
            "Designation loading failed:",
            requestError
          );


          setDesignations([]);

          setTotalElements(0);


          setError(
            getDesignationErrorMessage(
              requestError,
              "Unable to load designations."
            )
          );

        } finally {

          setLoading(false);

        }

      },
      [
        search,
        status,
        companyId,
        departmentId,
        sortBy,
        direction,
        enrichDesignations
      ]
    );


  /*
  |--------------------------------------------------------------------------
  | INITIAL LOAD
  |--------------------------------------------------------------------------
  */

  useEffect(() => {

    loadReferenceData();

  }, [
    loadReferenceData
  ]);


  useEffect(() => {

    /*
     * Wait for reference data before enriching
     * designations.
     */

    if (
      referenceLoading
    ) {

      return;

    }


    loadDesignations();

  }, [
    loadDesignations,
    referenceLoading
  ]);


  /*
  |--------------------------------------------------------------------------
  | STATISTICS
  |--------------------------------------------------------------------------
  */

  const statistics =
    useMemo(() => {

      const active =
        designations.filter(
          designation => {

            const currentStatus =
              String(
                designation.status ||
                ""
              ).toUpperCase();


            return (
              currentStatus ===
                "ACTIVE" &&

              designation.active !==
                false
            );

          }
        ).length;


      const inactive =
        designations.filter(
          designation => {

            const currentStatus =
              String(
                designation.status ||
                ""
              ).toUpperCase();


            return (
              currentStatus ===
                "INACTIVE" ||

              designation.active ===
                false
            );

          }
        ).length;


      const employees =
        designations.reduce(
          (
            total,
            designation
          ) => {

            return (
              total +
              Number(
                designation.employeeCount ||
                0
              )
            );

          },
          0
        );


      return {
        active,
        inactive,
        employees
      };

    }, [
      designations
    ]);


  /*
  |--------------------------------------------------------------------------
  | SEARCH
  |--------------------------------------------------------------------------
  */

  const handleSearch = (
    event
  ) => {

    event.preventDefault();

    setSearch(
      searchInput.trim()
    );

  };


  /*
  |--------------------------------------------------------------------------
  | RESET
  |--------------------------------------------------------------------------
  */

  const resetFilters = () => {

    setSearchInput("");

    setSearch("");

    setStatus("");

    setCompanyId("");

    setDepartmentId("");

    setSortBy("id");

    setDirection("asc");

  };


  /*
  |--------------------------------------------------------------------------
  | CREATE
  |--------------------------------------------------------------------------
  */

  const openCreate = () => {

    setSelectedDesignation(
      null
    );

    setFormMode(
      "create"
    );

    setFormError("");

    setFormOpen(true);

  };


  /*
  |--------------------------------------------------------------------------
  | EDIT
  |--------------------------------------------------------------------------
  */

  const openEdit = (
    designation
  ) => {

    const designationId =
      getDesignationId(
        designation
      );


    if (!designationId) {

      setToast({
        open: true,
        message:
          "Designation ID is missing.",
        severity:
          "error"
      });

      return;

    }


    setSelectedDesignation(
      designation
    );

    setFormMode(
      "edit"
    );

    setFormError("");

    setFormOpen(true);

  };


  /*
  |--------------------------------------------------------------------------
  | VIEW
  |--------------------------------------------------------------------------
  */

  const openView = (
    designation
  ) => {

    setViewDesignation(
      designation
    );

    setViewOpen(true);

  };


  /*
  |--------------------------------------------------------------------------
  | CLOSE FORM
  |--------------------------------------------------------------------------
  */

  const closeForm = () => {

    if (formLoading) {
      return;
    }


    setFormOpen(false);

    setFormError("");

  };


  /*
  |--------------------------------------------------------------------------
  | SUBMIT
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (
    payload
  ) => {

    setFormLoading(true);

    setFormError("");


    try {

      if (
        formMode ===
        "create"
      ) {

        await designationService
          .createDesignation(
            payload
          );


        setToast({
          open: true,
          message:
            "Designation created successfully.",
          severity:
            "success"
        });

      }

      else {

        const designationId =
          getDesignationId(
            selectedDesignation
          );


        if (!designationId) {

          throw new Error(
            "Designation ID is missing."
          );

        }


        await designationService
          .updateDesignation(
            designationId,
            payload
          );


        setToast({
          open: true,
          message:
            "Designation updated successfully.",
          severity:
            "success"
        });

      }


      setFormOpen(false);

      setSelectedDesignation(
        null
      );


      await loadDesignations();

    } catch (requestError) {

      console.error(
        "Designation save failed:",
        requestError
      );


      setFormError(
        getDesignationErrorMessage(
          requestError,
          "Unable to save designation."
        )
      );

    } finally {

      setFormLoading(false);

    }

  };


  /*
  |--------------------------------------------------------------------------
  | DELETE
  |--------------------------------------------------------------------------
  */

  const openDelete = (
    designation
  ) => {

    const designationId =
      getDesignationId(
        designation
      );


    if (!designationId) {

      setToast({
        open: true,
        message:
          "Designation ID is missing.",
        severity:
          "error"
      });

      return;

    }


    setDeleteDesignation(
      designation
    );

    setDeleteError("");

    setDeleteOpen(true);

  };


  const closeDelete = () => {

    if (deleteLoading) {
      return;
    }


    setDeleteOpen(false);

    setDeleteDesignation(
      null
    );

    setDeleteError("");

  };


  const handleDelete = async () => {

    const designationId =
      getDesignationId(
        deleteDesignation
      );


    if (!designationId) {

      setDeleteError(
        "Designation ID is missing."
      );

      return;

    }


    setDeleteLoading(true);

    setDeleteError("");


    try {

      await designationService
        .deleteDesignation(
          designationId
        );


      setToast({
        open: true,
        message:
          "Designation deleted successfully.",
        severity:
          "success"
      });


      setDeleteOpen(false);

      setDeleteDesignation(
        null
      );


      await loadDesignations();

    } catch (requestError) {

      console.error(
        "Designation delete failed:",
        requestError
      );


      setDeleteError(
        getDesignationErrorMessage(
          requestError,
          "Unable to delete designation."
        )
      );

    } finally {

      setDeleteLoading(false);

    }

  };


  /*
  |--------------------------------------------------------------------------
  | STATUS
  |--------------------------------------------------------------------------
  */

  const handleStatusChange = async (
    designation
  ) => {

    const designationId =
      getDesignationId(
        designation
      );


    if (!designationId) {

      setToast({
        open: true,
        message:
          "Designation ID is missing.",
        severity:
          "error"
      });

      return;

    }


    const currentStatus =
      String(
        designation.status ||
        (
          designation.active === false
            ? "INACTIVE"
            : "ACTIVE"
        )
      ).toUpperCase();


    const nextStatus =
      currentStatus ===
      "ACTIVE"
        ? "INACTIVE"
        : "ACTIVE";


    try {

      await designationService
        .updateStatus(
          designationId,
          nextStatus
        );


      setToast({
        open: true,
        message:
          `Designation ${
            nextStatus === "ACTIVE"
              ? "activated"
              : "deactivated"
          } successfully.`,
        severity:
          "success"
      });


      await loadDesignations();

    } catch (requestError) {

      console.error(
        "Designation status update failed:",
        requestError
      );


      setToast({
        open: true,
        message:
          getDesignationErrorMessage(
            requestError,
            "Unable to update designation status."
          ),
        severity:
          "error"
      });

    }

  };


  /*
  |--------------------------------------------------------------------------
  | FILTERED DEPARTMENTS FOR LIST FILTER
  |--------------------------------------------------------------------------
  */

  const filteredDepartments =
    companyId
      ? departments.filter(
          department => {

            const departmentCompanyId =
              getDepartmentCompanyId(
                department
              );


            return (
              String(
                departmentCompanyId ??
                ""
              ) ===
              String(
                companyId
              )
            );

          }
        )
      : departments;


  /*
  |--------------------------------------------------------------------------
  | RENDER
  |--------------------------------------------------------------------------
  */

  return (

    <Box
      sx={{
        pb: 4
      }}
    >

      {/* HEADER */}

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
                "-.035em"
            }}
          >
            Designations
          </Typography>


          <Typography
            color="text.secondary"
            sx={{
              mt: 0.5
            }}
          >
            Define job titles and connect them
            to your organizational structure.
          </Typography>

        </Box>


        <PermissionButton
          permission="DESIGNATION_CREATE"
          variant="contained"
          startIcon={
            <AddOutlinedIcon />
          }
          onClick={
            openCreate
          }
          sx={{
            borderRadius: 2,
            px: 2.5,
            py: 1.2,
            fontWeight: 850
          }}
        >
          Add Designation
        </PermissionButton>

      </Stack>


      {/* ERROR */}

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
              onClick={
                loadDesignations
              }
            >
              Retry
            </Button>

          }
        >
          {error}
        </Alert>

      )}


      {/* STATISTICS */}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            lg: "repeat(4, 1fr)"
          },
          gap: 2,
          mb: 2
        }}
      >

        {[
          {
            title:
              "Total Designations",

            value:
              loading
                ? "—"
                : totalElements,

            subtitle:
              "Designations in this view",

            icon:
              BadgeOutlinedIcon
          },

          {
            title:
              "Active",

            value:
              loading
                ? "—"
                : statistics.active,

            subtitle:
              "Currently active",

            icon:
              CheckCircleOutlineOutlinedIcon
          },

          {
            title:
              "Inactive",

            value:
              loading
                ? "—"
                : statistics.inactive,

            subtitle:
              "Currently inactive",

            icon:
              BlockOutlinedIcon
          },

          {
            title:
              "Employees",

            value:
              loading
                ? "—"
                : statistics.employees,

            subtitle:
              "Across loaded designations",

            icon:
              GroupsOutlinedIcon
          }

        ].map(
          stat => {

            const StatIcon =
              stat.icon;


            return (

              <Paper
                key={
                  stat.title
                }
                elevation={0}
                sx={{
                  p: 2.5,
                  border:
                    "1px solid",
                  borderColor:
                    "divider",
                  borderRadius: 3
                }}
              >

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >

                  <Box>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      {
                        stat.title
                      }
                    </Typography>


                    <Typography
                      variant="h4"
                      fontWeight={800}
                      sx={{
                        mt: 0.5
                      }}
                    >
                      {
                        stat.value
                      }
                    </Typography>


                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {
                        stat.subtitle
                      }
                    </Typography>

                  </Box>


                  <Box
                    sx={{
                      width: 44,
                      height: 44,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor:
                        "action.hover"
                    }}
                  >

                    <StatIcon />

                  </Box>

                </Stack>

              </Paper>

            );

          }
        )}

      </Box>


      {/* FILTERS */}

      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          border:
            "1px solid",
          borderColor:
            "divider",
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
            onSubmit={
              handleSearch
            }
            sx={{
              flex: 1
            }}
          >

            <TextField
              fullWidth
              size="small"
              placeholder="Search designations, departments or companies..."
              value={
                searchInput
              }
              onChange={
                event =>
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
            value={
              status
            }
            displayEmpty
            onChange={
              event =>
                setStatus(
                  event.target.value
                )
            }
            sx={{
              minWidth: 145
            }}
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


          {/* COMPANY */}

          <Select
            size="small"
            value={
              companyId
            }
            displayEmpty
            onChange={
              event => {

                setCompanyId(
                  event.target.value
                );

                setDepartmentId("");

              }
            }
            sx={{
              minWidth: 185
            }}
          >

            <MenuItem value="">
              All Companies
            </MenuItem>


            {companies.map(
              company => {

                const id =
                  getCompanyId(
                    company
                  );


                return (

                  <MenuItem
                    key={id}
                    value={id}
                  >

                    {
                      getCompanyName(
                        company
                      )
                    }

                  </MenuItem>

                );

              }
            )}

          </Select>


          {/* DEPARTMENT */}

          <Select
            size="small"
            value={
              departmentId
            }
            displayEmpty
            onChange={
              event =>
                setDepartmentId(
                  event.target.value
                )
            }
            sx={{
              minWidth: 185
            }}
          >

            <MenuItem value="">
              All Departments
            </MenuItem>


            {filteredDepartments.map(
              department => {

                const id =
                  getDepartmentId(
                    department
                  );


                return (

                  <MenuItem
                    key={id}
                    value={id}
                  >

                    {
                      getDepartmentName(
                        department
                      )
                    }

                  </MenuItem>

                );

              }
            )}

          </Select>


          {/* SORT */}

          <Select
            size="small"
            value={
              sortBy
            }
            onChange={
              event =>
                setSortBy(
                  event.target.value
                )
            }
            sx={{
              minWidth: 150
            }}
          >

            <MenuItem value="id">
              Sort: ID
            </MenuItem>

            <MenuItem value="designationName">
              Sort: Name
            </MenuItem>

            <MenuItem value="designationCode">
              Sort: Code
            </MenuItem>

            <MenuItem value="status">
              Sort: Status
            </MenuItem>

          </Select>


          {/* DIRECTION */}

          <Button
            variant="outlined"
            size="small"
            onClick={() => {

              setDirection(
                previous =>
                  previous === "asc"
                    ? "desc"
                    : "asc"
              );

            }}
            sx={{
              minWidth: 90,
              fontWeight: 800
            }}
          >

            {
              direction === "asc"
                ? "A → Z"
                : "Z → A"
            }

          </Button>


          {/* REFRESH */}

          <IconButton
            onClick={
              loadDesignations
            }
            disabled={
              loading ||
              referenceLoading
            }
            sx={{
              border:
                "1px solid",
              borderColor:
                "divider",
              borderRadius: 2
            }}
          >

            <RefreshOutlinedIcon />

          </IconButton>


          {/* CLEAR */}

          {(
            search ||
            status ||
            companyId ||
            departmentId
          ) && (

            <Button
              size="small"
              onClick={
                resetFilters
              }
              sx={{
                fontWeight: 800
              }}
            >
              Clear
            </Button>

          )}

        </Stack>

      </Paper>


      {/* RESULT COUNT */}

      <Stack
        direction="row"
        justifyContent="space-between"
        sx={{
          mb: 1.5
        }}
      >

        <Typography
          variant="body2"
          color="text.secondary"
        >

          {
            loading
              ? "Loading designations..."
              : `${totalElements} designation${
                  totalElements === 1
                    ? ""
                    : "s"
                } found`
          }

        </Typography>

      </Stack>


      {/* TABLE */}

      <Box
        sx={{
          position: "relative"
        }}
      >

        {loading && (

          <Box
            sx={{
              position:
                "absolute",
              inset: 0,
              zIndex: 2,
              display: "flex",
              justifyContent:
                "center",
              alignItems:
                "flex-start",
              pt: 8,
              bgcolor:
                "rgba(255,255,255,.55)",
              backdropFilter:
                "blur(2px)"
            }}
          >

            <CircularProgress />

          </Box>

        )}


        <DesignationTable
          designations={
            designations
          }
          onView={
            openView
          }
          onEdit={
            openEdit
          }
          onDelete={
            openDelete
          }
          onStatusChange={
            handleStatusChange
          }
          canUpdate={
            can(
              "DESIGNATION_UPDATE"
            )
          }
          canDelete={
            can(
              "DESIGNATION_DELETE"
            )
          }
        />

      </Box>


      {/* CREATE / EDIT */}

      <Dialog
        open={
          formOpen
        }
        onClose={
          closeForm
        }
        maxWidth="sm"
        fullWidth
      >

        <DesignationForm
          open={
            formOpen
          }
          mode={
            formMode
          }
          designation={
            selectedDesignation
          }
          companies={
            companies
          }
          departments={
            departments
          }
          loading={
            formLoading
          }
          error={
            formError
          }
          onClose={
            closeForm
          }
          onSubmit={
            handleSubmit
          }
        />

      </Dialog>


      {/* VIEW */}

      <DesignationViewDrawer
        open={
          viewOpen
        }
        designation={
          viewDesignation
        }
        onClose={() => {

          setViewOpen(
            false
          );

          setViewDesignation(
            null
          );

        }}
      />


      {/* DELETE */}

      <DeleteDesignationDialog
        open={
          deleteOpen
        }
        designation={
          deleteDesignation
        }
        loading={
          deleteLoading
        }
        error={
          deleteError
        }
        onClose={
          closeDelete
        }
        onConfirm={
          handleDelete
        }
      />


      {/* TOAST */}

      <Snackbar
        open={
          toast.open
        }
        autoHideDuration={
          3500
        }
        onClose={() =>
          setToast(
            previous => ({
              ...previous,
              open: false
            })
          )
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right"
        }}
      >

        <Alert
          severity={
            toast.severity
          }
          variant="filled"
          onClose={() =>
            setToast(
              previous => ({
                ...previous,
                open: false
              })
            )
          }
          sx={{
            width: "100%"
          }}
        >
          {
            toast.message
          }
        </Alert>

      </Snackbar>

    </Box>

  );

};


export default DesignationList;