import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField
} from "@mui/material";


import {
  useEffect,
  useState
} from "react";


const RoleDialog = ({
  open,
  role,
  loading = false,
  error = "",
  onClose,
  onSave
}) => {

  const isEdit =
    Boolean(role?.id);


  const [
    name,
    setName
  ] = useState("");


  const [
    description,
    setDescription
  ] = useState("");


  useEffect(() => {

    setName(
      role?.name || ""
    );

    setDescription(
      role?.description || ""
    );

  }, [
    role,
    open
  ]);


  const handleSave = async () => {

    if (!name.trim()) {
      return;
    }

    await onSave({

      name:
        name
          .trim()
          .toUpperCase(),

      description:
        description.trim()

    });

  };


  return (
    <Dialog
      open={open}
      onClose={
        loading
          ? undefined
          : onClose
      }
      fullWidth
      maxWidth="sm"
    >

      <DialogTitle
        sx={{
          fontWeight: 900
        }}
      >
        {isEdit
          ? "Edit Role"
          : "Create Role"}
      </DialogTitle>


      <DialogContent>

        <Stack
          spacing={2.5}
          sx={{
            pt: 1
          }}
        >

          {error && (

            <Alert severity="error">
              {error}
            </Alert>

          )}


          <TextField
            fullWidth
            label="Role Name"
            placeholder="HR_MANAGER"
            value={name}
            disabled={
              isEdit
            }
            onChange={event =>
              setName(
                event.target.value
              )
            }
            helperText={
              "Use uppercase letters and underscores."
            }
          />


          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Description"
            value={
              description
            }
            onChange={event =>
              setDescription(
                event.target.value
              )
            }
          />

        </Stack>

      </DialogContent>


      <DialogActions
        sx={{
          p: 2
        }}
      >

        <Button
          onClick={onClose}
          disabled={loading}
          sx={{
            fontWeight: 800
          }}
        >
          Cancel
        </Button>


        <Button
          variant="contained"
          onClick={
            handleSave
          }
          disabled={
            loading ||
            !name.trim()
          }
          sx={{
            fontWeight: 850
          }}
        >
          {loading
            ? "Saving..."
            : "Save Role"}
        </Button>

      </DialogActions>

    </Dialog>
  );
};


export default RoleDialog;