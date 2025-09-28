import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import PrivateRoute from '@/auth/PrivateRoute';
import CarsPage from '@/pages/CarsPage/CarsPage';
import CarDetails from '@/pages/CarsPage/CarDetails';
import LoginPage from '@/pages/LoginPage/LoginPage';
import RegisterPage from '@/pages/RegisterPage/RegisterPage';

const router = createBrowserRouter([
  {
    element: <PrivateRoute/>,
    children:[
      { path:'/',          element:<CarsPage/> },
      { path:'/cars/:plate', element:<CarDetails/> }
    ]
  },
  { path:'/login',    element:<LoginPage/> },
  { path:'/register', element:<RegisterPage/> }
]);

export default function Router(){ return <RouterProvider router={router}/>; }
