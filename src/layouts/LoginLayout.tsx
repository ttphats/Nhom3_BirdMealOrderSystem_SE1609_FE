import { Outlet } from "react-router-dom";
import { Container } from '@mui/material'

export default function LoginLayout() {
  return (
    <>
      <Container
        component="main"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
        }}
      >
        <Outlet />
      </Container>
    </>
  );
}
