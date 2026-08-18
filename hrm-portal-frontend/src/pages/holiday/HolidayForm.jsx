import {
  useEffect,
  useState
} from "react";

import {
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  MenuItem,
  TextField,
  Typography
} from "@mui/material";

import api from "../../services/api";


const holidayTypes = [
  "NATIONAL",
  "FESTIVAL",
  "COMPANY",
  "OPTIONAL"
];


const statusList = [
  "ACTIVE",
  "INACTIVE"
];


const HolidayForm = ({
  holiday,
  onSubmit
}) => {

  const currentYear =
    new Date().getFullYear();


  // =========================================================
  // CURRENT USER
  // =========================================================

  const storedUser =
    (() => {

      try {

        const value =
          localStorage.getItem("user");

        return value
          ? JSON.parse(value)
          : null;

      } catch {

        return null;

      }

    })();


  const isSuperAdmin =
    storedUser?.role === "SUPER_ADMIN";


  // =========================================================
  // FORM STATE
  // =========================================================

  const [
    formData,
    setFormData
  ] = useState({

    holidayName: "",

    holidayDate: "",

    description: "",

    holidayType: "",

    year: currentYear,

    status: "ACTIVE",

    active: true,

    companyId: ""

  });


  // =========================================================
  // COMPANY STATE
  // =========================================================

  const [
    companies,
    setCompanies
  ] = useState([]);


  const [
    companiesLoading,
    setCompaniesLoading
  ] = useState(false);


  const [
    companyError,
    setCompanyError
  ] = useState("");


  // =========================================================
  // LOAD COMPANIES
  // =========================================================

  useEffect(() => {

    if (!isSuperAdmin) {
      return;
    }


    const loadCompanies =
      async () => {

        setCompaniesLoading(true);

        setCompanyError("");


        try {

          const response =
            await api.get(
              "/companies",
              {
                params: {
                  page: 0,
                  size: 100
                }
              }
            );


          const data =
            response.data;


          let companyList = [];


          /*
           * Backend returns a Spring Page:
           *
           * {
           *   content: [...]
           * }
           */

          if (
            Array.isArray(data)
          ) {

            companyList =
              data;

          } else if (
            Array.isArray(
              data?.content
            )
          ) {

            companyList =
              data.content;

          }


          setCompanies(
            companyList
          );


        } catch (error) {

          console.error(
            "Failed to load companies:",
            error
          );


          setCompanyError(
            error
              ?.response
              ?.data
              ?.message ||
            "Unable to load companies."
          );


        } finally {

          setCompaniesLoading(false);

        }

      };


    loadCompanies();

  }, [isSuperAdmin]);


  // =========================================================
  // LOAD HOLIDAY FOR EDIT
  // =========================================================

  useEffect(() => {

    if (!holiday) {

      setFormData({

        holidayName: "",

        holidayDate: "",

        description: "",

        holidayType: "",

        year: currentYear,

        status: "ACTIVE",

        active: true,

        companyId: ""

      });

      return;

    }


    setFormData({

      holidayName:
        holiday.holidayName || "",

      holidayDate:
        holiday.holidayDate || "",

      description:
        holiday.description || "",

      holidayType:
        holiday.holidayType || "",

      year:
        holiday.year ||
        currentYear,

      status:
        holiday.status ||
        "ACTIVE",

      active:
        holiday.active !== undefined
          ? holiday.active
          : true,

      companyId:
        holiday.companyId
          ? String(
              holiday.companyId
            )
          : ""

    });

  }, [
    holiday,
    currentYear
  ]);


  // =========================================================
  // HANDLE CHANGE
  // =========================================================

  const handleChange =
    event => {

      const {
        name,
        value
      } = event.target;


      setFormData(
        previous => ({

          ...previous,

          [name]:
            name === "year"
              ? Number(value)
              : value

        })
      );

    };


  // =========================================================
  // SUBMIT
  // =========================================================

  const handleSubmit =
    event => {

      event.preventDefault();


      // -------------------------------------------------------
      // BASIC FRONTEND VALIDATION
      // -------------------------------------------------------

      if (
        !formData.holidayName?.trim()
      ) {

        console.error(
          "Holiday name is required."
        );

        return;

      }


      if (
        !formData.holidayDate
      ) {

        console.error(
          "Holiday date is required."
        );

        return;

      }


      if (
        !formData.holidayType
      ) {

        console.error(
          "Holiday type is required."
        );

        return;

      }


      if (
        !formData.year
      ) {

        console.error(
          "Holiday year is required."
        );

        return;

      }


      // -------------------------------------------------------
      // BUILD PAYLOAD
      // -------------------------------------------------------

      const payload = {

        holidayName:
          formData.holidayName.trim(),

        holidayDate:
          formData.holidayDate,

        description:
          formData.description?.trim() || "",

        holidayType:
          formData.holidayType,

        year:
          Number(formData.year),

        status:
          formData.status || "ACTIVE",

        active:
          Boolean(formData.active)

      };


      // -------------------------------------------------------
      // SUPER ADMIN COMPANY
      // -------------------------------------------------------

      if (isSuperAdmin) {

        payload.companyId =
          formData.companyId
            ? Number(
                formData.companyId
              )
            : null;

      }


      // =======================================================
      // TEMPORARY DEBUGGING
      // =======================================================

      console.log(
        "================================================="
      );

      console.log(
        "HOLIDAY FORM PAYLOAD:",
        payload
      );

      console.log(
        "STORED USER:",
        storedUser
      );

      console.log(
        "IS SUPER ADMIN:",
        isSuperAdmin
      );

      console.log(
        "FORM DATA:",
        formData
      );

      console.log(
        "================================================="
      );


      // =======================================================
      // SEND TO HOLIDAY DIALOG
      // =======================================================

      onSubmit(
        payload
      );

    };


  // =========================================================
  // UI
  // =========================================================

  return (

    <form
      id="holiday-form"
      onSubmit={
        handleSubmit
      }
    >

      <Box>

        <Card
          variant="outlined"
          sx={{
            mb: 3
          }}
        >

          <CardContent>

            <Typography
              variant="h6"
              fontWeight={700}
            >
              Holiday Information
            </Typography>


            <Divider
              sx={{
                my: 2
              }}
            />


            <Grid
              container
              spacing={2}
            >

              {/* =================================================
                  COMPANY
              ================================================= */}

              {isSuperAdmin && (

                <Grid
                  size={{
                    xs: 12
                  }}
                >

                  <TextField
                    select
                    fullWidth
                    required
                    label="Company"
                    name="companyId"
                    value={
                      formData.companyId
                    }
                    onChange={
                      handleChange
                    }
                    disabled={
                      companiesLoading
                    }
                    error={
                      Boolean(
                        companyError
                      )
                    }
                    helperText={

                      companyError ||

                      (
                        companiesLoading
                          ? "Loading companies..."
                          : "Select the company for this holiday."
                      )

                    }
                  >

                    {companies.map(
                      company => {

                        const companyId =
                          company.companyId ??
                          company.id;


                        return (

                          <MenuItem
                            key={
                              companyId
                            }
                            value={
                              String(
                                companyId
                              )
                            }
                          >

                            {
                              company.companyName
                            }

                          </MenuItem>

                        );

                      }
                    )}

                  </TextField>

                </Grid>

              )}


              {/* =================================================
                  HOLIDAY NAME
              ================================================= */}

              <Grid
                size={{
                  xs: 12,
                  md: 6
                }}
              >

                <TextField
                  fullWidth
                  required
                  label="Holiday Name"
                  name="holidayName"
                  value={
                    formData.holidayName
                  }
                  onChange={
                    handleChange
                  }
                />

              </Grid>


              {/* =================================================
                  HOLIDAY DATE
              ================================================= */}

              <Grid
                size={{
                  xs: 12,
                  md: 6
                }}
              >

                <TextField
                  fullWidth
                  required
                  type="date"
                  label="Holiday Date"
                  name="holidayDate"
                  value={
                    formData.holidayDate
                  }
                  onChange={
                    handleChange
                  }
                  slotProps={{
                    inputLabel: {
                      shrink: true
                    }
                  }}
                />

              </Grid>


              {/* =================================================
                  HOLIDAY TYPE
              ================================================= */}

              <Grid
                size={{
                  xs: 12,
                  md: 6
                }}
              >

                <TextField
                  select
                  fullWidth
                  required
                  label="Holiday Type"
                  name="holidayType"
                  value={
                    formData.holidayType
                  }
                  onChange={
                    handleChange
                  }
                >

                  {holidayTypes.map(
                    type => (

                      <MenuItem
                        key={
                          type
                        }
                        value={
                          type
                        }
                      >

                        {type}

                      </MenuItem>

                    )
                  )}

                </TextField>

              </Grid>


              {/* =================================================
                  YEAR
              ================================================= */}

              <Grid
                size={{
                  xs: 12,
                  md: 3
                }}
              >

                <TextField
                  fullWidth
                  required
                  type="number"
                  label="Year"
                  name="year"
                  value={
                    formData.year
                  }
                  onChange={
                    handleChange
                  }
                />

              </Grid>


              {/* =================================================
                  STATUS
              ================================================= */}

              <Grid
                size={{
                  xs: 12,
                  md: 3
                }}
              >

                <TextField
                  select
                  fullWidth
                  required
                  label="Status"
                  name="status"
                  value={
                    formData.status
                  }
                  onChange={
                    handleChange
                  }
                >

                  {statusList.map(
                    status => (

                      <MenuItem
                        key={
                          status
                        }
                        value={
                          status
                        }
                      >

                        {status}

                      </MenuItem>

                    )
                  )}

                </TextField>

              </Grid>


              {/* =================================================
                  DESCRIPTION
              ================================================= */}

              <Grid
                size={{
                  xs: 12
                }}
              >

                <TextField
                  fullWidth
                  multiline
                  minRows={3}
                  label="Description"
                  name="description"
                  value={
                    formData.description
                  }
                  onChange={
                    handleChange
                  }
                />

              </Grid>

            </Grid>

          </CardContent>

        </Card>

      </Box>

    </form>

  );

};


export default HolidayForm;