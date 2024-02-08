import { createBrowserRouter, HashRouter  } from 'react-router-dom';
import Home from '../pages/home'
import Users from '../pages/users'
import UsersList from '../pages/users/list'
import Appointments from '../pages/appointments'
import Login from '../pages/auth/login'
import Register from '../pages/auth/resgister'
import Error from '../pages/error' 
import ProtectedRoute from './protectedRoute';
import Create from '../pages/users/create'
import ViewUser from '../pages/users/view';


export const router = createBrowserRouter([
  {
    path: '/',
    element: <HashRouter><ProtectedRoute><Home /></ProtectedRoute></HashRouter>, // Wrap with HashRouter
    errorElement: <Error />,
  },
  {
    path: '/users',
    element: <HashRouter><ProtectedRoute><Users /></ProtectedRoute></HashRouter>, // Wrap with HashRouter
    errorElement: <Error />,
    children: [
      { path: '/users', element: <ProtectedRoute><UsersList/></ProtectedRoute> },
      { path: ':id', element: <ProtectedRoute><ViewUser/></ProtectedRoute> },
      { path: 'add', element: <ProtectedRoute><Create /> </ProtectedRoute>},
    ],
  },
  {
    path: '/appointments',
    element: <HashRouter><ProtectedRoute><Appointments /></ProtectedRoute></HashRouter>, // Wrap with HashRouter
    errorElement: <Error />,
  },
  {
    path: '/login',
    element: <HashRouter><Login /></HashRouter>, // Wrap with HashRouter
    errorElement: <Error />,
  },
  {
    path: '/register',
    element: <HashRouter><Register /></HashRouter>, // Wrap with HashRouter
    errorElement: <Error />,
  },
  {
    path: '*',
    element: <HashRouter><Login /></HashRouter>, // Wrap with HashRouter
    errorElement: <Error />,
  },
]);