import { createBrowserRouter, RouteObject } from "react-router-dom";

import { LoginLayout, MainLayout } from "../layouts/";
import {
  ComboPage,
  ComboDetailsPage,
  OrderPage,
  OrderDetailsPage,
  LoginPage,
  ProfilePage,
  RegisterPage,
  CheckoutPage,
} from "../pages";
import AppRoutes from "./AppRoutes";
import ProductPage from "../pages/ProductPage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        index: true,
        element: <ComboPage />,
      },
      {
        path: AppRoutes.combo,
        element: <ComboPage />,
      },
      {
        path: AppRoutes.combodetails,
        element: <ComboDetailsPage />,
      },
      {
        path: AppRoutes.product,
        element: <ProductPage />,
      },
      {
        path: AppRoutes.order,
        element: <OrderPage />,
      },
      {
        path: AppRoutes.orderdetails,
        element: <OrderDetailsPage />,
      },
      {
        path: AppRoutes.profile,
        element: <ProfilePage />,
      },
      {
        path: AppRoutes.checkout,
        element: <CheckoutPage />,
      },
    ],
  },
  {
    path: '/',
    element: <LoginLayout />,
    children: [
      {
        path: AppRoutes.login,
        element: <LoginPage />,
      },
      {
        path: AppRoutes.register,
        element: <RegisterPage />,
      },
    ]
  },
  
];

const router = createBrowserRouter(routes);

export default router;