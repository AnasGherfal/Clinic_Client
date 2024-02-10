import React, { useState } from "react";
import { TextField, Button, Typography, Paper, Grid, Snackbar } from "@mui/material";
import { UserCreate } from "./model";
import { createUser } from "./userService"; // Import the createUser function
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { useAuth } from "../../config/AuthContext";
import MuiAlert, { AlertProps } from "@mui/material/Alert";


const Create: React.FC = () => {
  const [user, setUser] = useState<UserCreate>({
    firstName: "",
    lastName: "",
    email: "",
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const navigate = useNavigate(); // Initialize useNavigate
  const { currentUser } = useAuth();
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertProps["severity"]>("success");

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof UserCreate
  ) => {
    setUser({ ...user, [fieldName]: e.target.value });
  };

  const handleAddUser = async () => {
    try {
      if (!user.firstName || !user.lastName || !user.email) {
        setSnackbarSeverity("error");
        setSnackbarMessage("Please fill out all fields.");
        setOpenSnackbar(true);
        return;
      }
      if (currentUser) {
        await createUser(user, currentUser?.token);
      // You may want to reset the form or perform other actions after adding the user
      setUser({
        firstName: "",
        lastName: "",
        email: "",
      });
      setSnackbarMessage("User created successfully");
      setOpenSnackbar(true);
      navigate("/users"); // Navigate to the specified route
    }
    } catch (error:any) {
      setSnackbarSeverity("error");
      setSnackbarMessage(`${error.response.data}`);
      setOpenSnackbar(true);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };
  const handleGoBack = () => {
    navigate(-1); // Go back to the previous route
  };

  return (
    <Paper elevation={3} sx={{ padding: 2 }}>
      <Typography variant="h6" gutterBottom>
        Add User
      </Typography>
      <form>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="First Name"
              variant="outlined"
              value={user.firstName}
              onChange={(e: any) => handleInputChange(e, "firstName")}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Last Name"
              variant="outlined"
              value={user.lastName}
              onChange={(e: any) => handleInputChange(e, "lastName")}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Email"
              variant="outlined"
              value={user.email}
              onChange={(e: any) => handleInputChange(e, "email")}
            />
          </Grid>
          <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbarSeverity}
        >
          {snackbarMessage}
        </MuiAlert>
      </Snackbar>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleAddUser}>
              Add User
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleGoBack}
            >
              Go Back
            </Button>
            
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default Create;
