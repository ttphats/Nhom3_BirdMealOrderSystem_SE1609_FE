import { Outlet } from "react-router-dom";

import { Box } from "@mui/material";
import { Footer, Navbar } from "../common/components";

export default function AdminLayout() {
  return (
    <>
    <Navbar/>
      <Box
        sx={{
          backgroundColor: "#f7f7f7",
          minHeight: "calc(100vh - 312px)",
          display: 'flex',
          justifyContent: 'center'
        }}
      >
        <Outlet />
      </Box>
      <Footer />
    </>
  );
}