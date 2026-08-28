import {
  Box,
  Grid
} from "@mui/material";

import PersonOutlineOutlinedIcon
  from "@mui/icons-material/PersonOutlineOutlined";

import LockOutlinedIcon
  from "@mui/icons-material/LockOutlined";

import SecurityOutlinedIcon
  from "@mui/icons-material/SecurityOutlined";

import HistoryOutlinedIcon
  from "@mui/icons-material/HistoryOutlined";

import {
  useEffect,
  useMemo,
  useState
} from "react";

import {
  useAuth
} from "../../context/AuthContext";

import profileService
  from "../../services/profileService";

import ProfileHeader
  from "../../components/profile/ProfileHeader";

import ProfileSidebar
  from "../../components/profile/ProfileSidebar";

import AccountStatusCard
  from "../../components/profile/AccountStatusCard";

import PersonalInformation
  from "./PersonalInformation";

import ChangePassword
  from "./ChangePassword";

import SecurityOverview
  from "./SecurityOverview";

import LoginHistory
  from "./LoginHistory";


const Profile = () => {

  // =========================================================
  // AUTH CONTEXT
  // =========================================================

  const {
    refreshProfilePhoto
  } = useAuth();


  // =========================================================
  // PROFILE STATE
  // =========================================================

  const [
    profile,
    setProfile
  ] = useState(null);


  const [
    loading,
    setLoading
  ] = useState(true);


  const [
    error,
    setError
  ] = useState("");


  const [
    activeSection,
    setActiveSection
  ] = useState(
    "personal"
  );


  // =========================================================
  // PROFILE PHOTO STATE
  // =========================================================

  const [
    profilePhotoUrl,
    setProfilePhotoUrl
  ] = useState("");


  // =========================================================
  // SECTIONS
  // =========================================================

  const sections =
    useMemo(
      () => [

        {
          id: "personal",

          label:
            "Personal Information",

          description:
            "Profile details",

          icon:
            <PersonOutlineOutlinedIcon />

        },

        {
          id: "password",

          label:
            "Change Password",

          description:
            "Update password",

          icon:
            <LockOutlinedIcon />

        },

        {
          id: "security",

          label:
            "Security",

          description:
            "Account security",

          icon:
            <SecurityOutlinedIcon />

        },

        {
          id: "history",

          label:
            "Login History",

          description:
            "Recent activity",

          icon:
            <HistoryOutlinedIcon />

        }

      ],
      []
    );


  // =========================================================
  // LOAD PROFILE PHOTO
  // =========================================================

  const loadProfilePhoto =
    async () => {

      try {

        const blob =
          await profileService
            .getProfilePhotoBlob();


        if (
          !blob ||
          blob.size === 0
        ) {

          setProfilePhotoUrl(
            ""
          );

          return;

        }


        const objectUrl =
          URL.createObjectURL(
            blob
          );


        setProfilePhotoUrl(
          previousUrl => {

            if (
              previousUrl
            ) {

              URL.revokeObjectURL(
                previousUrl
              );

            }


            return objectUrl;

          }
        );

      } catch (
        photoError
      ) {

        /*
         * A user may not have a profile
         * photo yet. This should not make
         * the whole profile fail.
         */

        console.log(
          "No profile photo available."
        );


        setProfilePhotoUrl(
          ""
        );

      }

    };


  // =========================================================
  // LOAD COMPLETE PROFILE
  // =========================================================

  const loadProfile =
    async () => {

      setLoading(
        true
      );

      setError(
        ""
      );


      try {

        const response =
          await profileService
            .getMyProfile();


        setProfile(
          response
        );


        /*
         * /users/me currently does not
         * return profilePhotoUrl.
         *
         * Therefore fetch the authenticated
         * image separately.
         */

        await loadProfilePhoto();

      } catch (
        requestError
      ) {

        console.error(
          "Profile loading failed:",
          requestError
        );


        setError(
          requestError?.response?.data?.message ||
          "Unable to load your profile."
        );

      } finally {

        setLoading(
          false
        );

      }

    };


  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    loadProfile();

  }, []);


  // =========================================================
  // CLEAN OBJECT URL
  // =========================================================

  useEffect(() => {

    return () => {

      if (
        profilePhotoUrl
      ) {

        URL.revokeObjectURL(
          profilePhotoUrl
        );

      }

    };

  }, [
    profilePhotoUrl
  ]);


  // =========================================================
  // PROFILE INFORMATION UPDATED
  // =========================================================

  const handleUpdated =
    updatedProfile => {

      if (
        !updatedProfile
      ) {

        return;

      }


      setProfile(
        previous => ({
          ...previous,
          ...updatedProfile
        })
      );

    };


  // =========================================================
  // PROFILE PHOTO UPLOAD
  // =========================================================

  const handlePhotoUpload =
    async file => {

      if (!file) {

        return;

      }


      setError(
        ""
      );


      try {

        // -----------------------------------------------------
        // 1. Upload image to backend
        // -----------------------------------------------------

        await profileService
          .uploadProfilePhoto(
            file
          );


        // -----------------------------------------------------
        // 2. Reload local profile photo
        // -----------------------------------------------------

        await loadProfilePhoto();


        // -----------------------------------------------------
        // 3. Refresh global AuthContext photo
        //
        // This updates the top-right Navbar avatar.
        // -----------------------------------------------------

        await refreshProfilePhoto();


      } catch (
        requestError
      ) {

        console.error(
          "Profile photo upload failed:",
          requestError
        );


        setError(
          requestError?.response?.data?.message ||
          "Unable to upload profile photo."
        );

      }

    };


  // =========================================================
  // CONTENT
  // =========================================================

  const renderContent =
    () => {

      switch (
        activeSection
      ) {

        case "password":

          return (
            <ChangePassword />
          );


        case "security":

          return (
            <SecurityOverview />
          );


        case "history":

          return (
            <LoginHistory />
          );


        default:

          return (
            <PersonalInformation
              profile={
                profile
              }
              onUpdated={
                handleUpdated
              }
            />
          );

      }

    };


  // =========================================================
  // LOADING
  // =========================================================

  if (
    loading
  ) {

    return (
      <Box
        sx={{
          py: 5,
          textAlign: "center"
        }}
      >
        Loading profile...
      </Box>
    );

  }


  // =========================================================
  // PROFILE UNAVAILABLE
  // =========================================================

  if (
    !profile
  ) {

    return (
      <Box
        sx={{
          py: 5,
          textAlign: "center"
        }}
      >
        {error ||
          "Profile information is unavailable."}
      </Box>
    );

  }


  // =========================================================
  // RENDER
  // =========================================================

  return (
    <Box
      sx={{
        pb: 5
      }}
    >

      {/* =====================================================
          PROFILE HEADER
          ===================================================== */}

      <ProfileHeader
        profile={
          profile
        }

        profilePhotoUrl={
          profilePhotoUrl
        }

        onUpload={
          handlePhotoUpload
        }
      />


      {/* =====================================================
          ERROR MESSAGE
          ===================================================== */}

      {error && (

        <Box
          sx={{
            mb: 2,
            color:
              "error.main"
          }}
        >
          {error}
        </Box>

      )}


      {/* =====================================================
          MAIN CONTENT
          ===================================================== */}

      <Grid
        container
        spacing={2.5}
      >

        {/* ===================================================
            SIDEBAR
            =================================================== */}

        <Grid
          size={{
            xs: 12,
            md: 3
          }}
        >

          <ProfileSidebar

            sections={
              sections
            }

            activeSection={
              activeSection
            }

            onSelect={
              setActiveSection
            }

          />


          <Box
            sx={{
              mt: 2.5
            }}
          >

            <AccountStatusCard

              active={
                profile.active
              }

              accountLocked={
                profile.accountLocked
              }

              role={
                profile.role
              }

              companyName={
                profile.companyName
              }

            />

          </Box>

        </Grid>


        {/* ===================================================
            CONTENT
            =================================================== */}

        <Grid
          size={{
            xs: 12,
            md: 9
          }}
        >

          {renderContent()}

        </Grid>

      </Grid>

    </Box>
  );

};


export default Profile;
