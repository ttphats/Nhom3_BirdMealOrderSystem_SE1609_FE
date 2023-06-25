import { Link, Typography } from "@mui/material";

export default function Copyright(props: any) {
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        {...props}
      >
        {"Copyright © "}
        <Link color="inherit" href="https://mui.com/">
          Bird Meal Order System - Team 3
        </Link>{" "}
        {new Date().getFullYear()}
        {"."}
      </Typography>
    );
  }