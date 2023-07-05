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
  CreateProductPage,
  CreateComboPage,
  ManageOrderPage,
  EditComboPage,
  EditProductPage,
} from "../pages";
import AppRoutes from "./AppRoutes";
import ProductPage from "../pages/ProductPage";
import ProductDetailsPage from "../pages/ProductDetailsPage";
import Dashboard1 from "./../pages/Admin/views/dashboards/Dashboard1";
import ManageCustomersPage from "../pages/Admin/views/customer/ManageCustomersPage";

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
      {
        path: AppRoutes.createProduct,
        element: <CreateProductPage />,
      },
      {
        path: AppRoutes.createCombo,
        element: <CreateComboPage />,
      },
      {
        path: AppRoutes.editCombo,
        element: <EditComboPage />,
      },
      {
        path: AppRoutes.combodetails,
        element: <ComboDetailsPage />,
      },
      {
        path: AppRoutes.productdetails,
        element: <ProductDetailsPage />,
      },
      {
        path: AppRoutes.editProduct,
        element: <EditProductPage />,
      },
      {
        path: AppRoutes.manageOrders,
        element: <ManageOrderPage />,
      },
      {
        path: AppRoutes.dashboard,
        element: <Dashboard1 />,
      },
      {
        path: AppRoutes.customers,
        element: <ManageCustomersPage />,
      },
    ],
  },
  {
    path: "/",
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
    ],
  },
];

const router = createBrowserRouter(routes);

export default router;
