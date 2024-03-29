import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TextField, Button, Typography, Container, Paper } from '@mui/material';
import { getUserById, updateUser } from './userService';
import { useAuth } from '../../config/AuthContext';

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    status:'',
  });
  const [isEditing, setIsEditing] = useState(false);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (id  && currentUser) {
          const user = await getUserById(id, currentUser?.token);
          setUserData(user);
        }
      } catch (error) {
      }
    };

    fetchUserData();
  }, [id]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    try {
      if (id && isEditing && currentUser) {
        await updateUser(id, userData, currentUser?.token);
        setIsEditing(false); // Disable editing after submission
        navigate('/users'); // Navigate to the user list page after a successful update
      }
    } catch (error) {
    }
  };

  return (
    <Container>
      <Paper elevation={3} sx={{ padding: 3, borderRadius: 4, marginTop: 2 }}>
        <Typography variant="h4" component="div" sx={{ marginBottom: 2 }}>
          Edit User
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="First Name"
            fullWidth
            variant="outlined"
            margin="normal"
            name="firstName"
            value={userData.firstName}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <TextField
            label="Last Name"
            fullWidth
            variant="outlined"
            margin="normal"
            name="lastName"
            value={userData.lastName}
            onChange={handleChange}
            disabled={!isEditing}
          />
          <TextField
            label="Email"
            fullWidth
            variant="outlined"
            margin="normal"
            name="email"
            value={userData.email}
            onChange={handleChange}
            disabled={!isEditing}
          />
          {isEditing && (
            <Button type="submit" variant="contained" color="primary" sx={{ marginTop: 2 }}>
              Update User
            </Button>
          )}
        </form>
        {!isEditing && (
          <Button onClick={handleEditClick} variant="contained" color="primary" sx={{ marginTop: 2 }}>
            Enable Editing
          </Button>
        )}
      </Paper>
    </Container>
  );
};

export default EditUser;
