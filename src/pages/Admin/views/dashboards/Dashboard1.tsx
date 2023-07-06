import { Grid, Box, Paper } from "@mui/material";

import {
  SalesOverview,
  ProductPerformance,
  DailyActivities,
  ProductDonutChart,
  ComboDonutChart,
  OrdersDonutChart,
} from "./dashboard1-components";
import { useAppSelector } from "../../../../redux/hooks";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../../router/AppRoutes";

const Dashboard1 = () => {
  const user = useAppSelector((state) => state.profile.user.data);
  const navigate = useNavigate();

  console.log(user.role !== "Admin");
  if (user.role !== "Admin") {
    navigate(AppRoutes.combo, { replace: true });
  }
  return (
    <Box>
      <Grid container spacing={0}>
        {/* ------------------------- row 1 ------------------------- */}
        <Grid item xs={12} lg={12}>
          <SalesOverview />
        </Grid>
        {/* ------------------------- row 2 ------------------------- */}
        <Grid
          item
          xs={12}
          sx={{ display: "flex", justifyContent: "space-between" }}
        >
          <Grid item xs={12} lg={4}>
            <Paper sx={{ m: 1, height: "18rem" }}>
              <ProductDonutChart />
            </Paper>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Paper sx={{ m: 1, height: "18rem" }}>
              <ComboDonutChart />
            </Paper>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Paper sx={{ m: 1, height: "18rem" }}>
              <OrdersDonutChart />
            </Paper>
          </Grid>
        </Grid>
        {/* ------------------------- row 3 ------------------------- */}
        <Grid item xs={12} lg={4}>
          <DailyActivities />
        </Grid>
        <Grid item xs={12} lg={8}>
          <ProductPerformance />
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard1;
