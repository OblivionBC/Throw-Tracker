// components/BarChart.js
import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

function LineChart({ data }) {
  const hammerItems = data.filter(
    (item) => item.prac_implement === "Hammer Throw"
  );
  const javelinItems = data.filter((item) => item.prac_implement === "Javelin");
  const shotputItems = data.filter(
    (item) => item.prac_implement === "Shot Put"
  );
  const discusItems = data.filter((item) => item.prac_implement === "Discus");
  const [userData, setUserData] = useState({
    labels: data.map((item) => item.prac_dt),
    datasets: [
      {
        label: "Hammer",
        data: hammerItems.map((item) => item.prac_best),
      },
      {
        label: "ShotPut",
        data: shotputItems.map((item) => item.prac_best),
      },
      {
        label: "Discus",
        data: discusItems.map((item) => item.prac_best),
      },
      {
        label: "Javelin",
        data: javelinItems.map((item) => item.prac_best),
      },
    ],
  });

  return <Line data={userData} />;
}
export default LineChart;
