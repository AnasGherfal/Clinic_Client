import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TablePagination,
  IconButton,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress, // Import CircularProgress for loading indicator
} from "@mui/material";
import SendIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { getUsers, deleteUser } from "./userService";
import type { User } from "./model";
import { Outlet, useNavigate } from "react-router-dom";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import { useAuth } from "../../config/AuthContext";

const UserTable = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [users, setUsers] = useState<User[] | undefined>(undefined);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertProps["severity"]>("success");
  const [loading, setLoading] = useState(true); // Loading state
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        if ( currentUser) {

        const fetchedUsers = await getUsers(currentUser?.token);
        setUsers(fetchedUsers);
        setSnackbarMessage("Users fetched successfully");
        setOpenSnackbar(true);
        }
      } catch (error) {
        setSnackbarSeverity("error");
        setSnackbarMessage("Error fetching users");
        setOpenSnackbar(true);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  const handleDeleteUser = (userId: any) => {
    setSelectedUserId(userId);
    setDeleteConfirmationOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedUserId && currentUser) {
      try {
        await deleteUser(selectedUserId, currentUser?.uid, currentUser?.token);
        setUsers((prevUsers) =>
          prevUsers?.filter(
            (user) => user.id.toString() !== selectedUserId.toString()
          )
        );
        setSnackbarMessage("User deleted successfully");
        setOpenSnackbar(true);
      } catch (error:any) {
        setSnackbarSeverity("error");
        setSnackbarMessage(`${error.response.data}`);
        setOpenSnackbar(true);
      }
    }

    setDeleteConfirmationOpen(false);
    setSelectedUserId(null);
  };

  const handleCancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setSelectedUserId(null);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <>
      <Outlet />
      <TableContainer component={Paper}>
        <Button
          variant="contained"
          onClick={() => navigate("/users/add")}
          startIcon={<SendIcon />}
          sx={{
            mb: 2,
            mt: 1,
            ml: 1,
            borderRadius: 2,
            backgroundColor: "#2358ba",
          }}
        >
          Add User
        </Button>
        {loading ? ( // Render loading indicator if loading is true
          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <CircularProgress />
          </div>
        ) : (
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <TableCell sx={{ borderBottom: "none" }}>First Name</TableCell>
                <TableCell sx={{ borderBottom: "none" }}>Last Name</TableCell>
                <TableCell sx={{ borderBottom: "none" }}>Email</TableCell>
                <TableCell sx={{ borderBottom: "none" }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users
                ?.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>{user.firstName}</TableCell>
                    <TableCell>{user.lastName}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <IconButton
                        color="primary"
                        onClick={() => navigate(`/users/${user.id}`)}
                        sx={{ margin: "0 5px" }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        sx={{ margin: "0 5px", color: "#F24949" }}
                        onClick={() => handleDeleteUser(user.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        )}
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={users ? users.length : 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
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
      <Dialog
        open={deleteConfirmationOpen}
        onClose={handleCancelDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this user?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete}>Cancel</Button>
          <Button onClick={handleConfirmDelete} sx={{ color: "#F24949" }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

const user = () => {
  return <UserTable />;
};

export default user;
