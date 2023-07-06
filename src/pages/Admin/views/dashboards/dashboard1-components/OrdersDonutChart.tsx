import { FC, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import adminApi from "../../../../../modules/Admin/apis/adminApi";
import { Typography } from "@mui/material";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DonutChartProps {}

const OrdersDonutChart: FC<DonutChartProps> = () => {
  const [series, setSeries] = useState<number[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const promises = [
        adminApi.orderCompleted(),
        adminApi.orderCancelled(),
        adminApi.orderProcessing(),
        adminApi.orderWaiting(),
      ];

      const responses = await Promise.allSettled(promises);

      const seriesData = responses.map((response) => {
        if (
          response.status === "fulfilled" &&
          response.value.data.totalOrder !== undefined
        ) {
          return response.value.data.totalOrder;
        } else {
          return 0;
        }
      });

      setSeries(seriesData);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  console.log(series);
  const options = {
    labels: ["Completed", "Cancelled", "Processing", "Waiting"],
    colors: ["#9BE8D8", "#FF9B9B", "#FFE569", "#FA9884"],
  };

  return (
    <div className="donut">
      <Typography variant="h6" sx={{ color: "#000", fontWeight: 700}}>
        Status of Order
      </Typography>
      <Chart options={options} series={series} type="donut" width="380" />
    </div>
  );
};

export default OrdersDonutChart;
