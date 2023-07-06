import { FC, useEffect, useState } from "react";
import Chart from "react-apexcharts";
import adminApi from "../../../../../modules/Admin/apis/adminApi";
import { Typography } from "@mui/material";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DonutChartProps {}

const ComboDonutChart: FC<DonutChartProps> = () => {
  const [series, setSeries] = useState<number[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const promises = [adminApi.comboActive(), adminApi.comboInActive()];

      const responses = await Promise.allSettled(promises);

      const seriesData = responses.map((response) => {
        if (
          response.status === "fulfilled" &&
          response.value.data.totalCombo !== undefined
        ) {
          return response.value.data.totalCombo;
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
    labels: ["Active", "InActive"],
    colors: ["#35D0BA", "#E74646"],
  };

  return (
    <div className="donut">
      <Typography
        variant="h6"
        sx={{ color: "#000", fontWeight: 700 }}
      >
        Status of Combo
      </Typography>
      <Chart options={options} series={series} type="donut" width="380" />
    </div>
  );
};

export default ComboDonutChart;
