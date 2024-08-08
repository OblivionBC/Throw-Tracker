// components/BarChart.js
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import styled from "styled-components";
const ChartWrap = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 100%;
  height: 90%;
  margin: 0;
  padding: 0;
`;
function LineChart({ activePRAC, activeTRPE, data }) {
  const [practiceData, setPracticeData] = useState([]);
  const [selectedImplement, setSelectedImplement] = useState("discus");
  const [userData, setUserData] = useState({
    labels: [],
    datasets: [
      {
        label: "Data",
        data: [],
      },
    ],
  });

  const getPracticeData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/get-all-practices`
      );
      const jsonData = await response.json();
      if (jsonData && jsonData.rows) {
        setPracticeData(jsonData.rows);
      } else {
        console.error("Unexpected data structure:", jsonData);
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getPracticeData();
  }, []);

  const hammerItems = practiceData?.filter(
    (item) => item.prac_implement === "Hammer Throw"
  );
  const javelinItems = practiceData?.filter(
    (item) => item.prac_implement === "Javelin"
  );
  const shotputItems = practiceData?.filter(
    (item) => item.prac_implement === "Shot Put"
  );
  const discusItems = practiceData?.filter(
    (item) => item.prac_implement === "Discus"
  );

  const datasets = {
    hammer: {
      labels: hammerItems.map((item) => item.prac_rk),
      data: hammerItems.map((item) => item.prac_best),
    },
    discus: {
      //Labels controls the x value / domain of each plot point
      labels: discusItems.map((item) => item.prac_rk),
      //Data is the y value or range of each plot point
      data: discusItems.map((item) => item.prac_best),
    },
    shotput: {
      labels: shotputItems.map((item) => item.prac_rk),
      data: shotputItems.map((item) => item.prac_best),
    },
    javelin: {
      labels: javelinItems.map((item) => item.prac_rk),
      data: javelinItems.map((item) => item.prac_best),
    },
  };

  useEffect(() => {
    // Sets data for the graphData based on the selected implement
    const selectedData = datasets[selectedImplement];
    console.log(selectedData.data);
    setUserData({
      labels: selectedData.labels,
      datasets: [
        {
          //Label is the block at the top that you can click to filter
          label: `${selectedImplement}`,
          //Overall Data
          data: selectedData.data,
        },
      ],
    });
  }, [selectedImplement]);

  //Selected dropdown value changes the selected implement, then changing the data given
  const handleDatasetChange = (event) => {
    setSelectedImplement(event.target.value);
  };

  return (
    <ChartWrap>
      <select onChange={handleDatasetChange} value={selectedImplement}>
        <option value="javelin">Javelin</option>
        <option value="discus">Discus</option>
        <option value="shotput">Shotput</option>
        <option value="hammer">Hammer</option>
      </select>
      <Line data={userData} />
    </ChartWrap>
  );
}
export default LineChart;
