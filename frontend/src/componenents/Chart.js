// components/BarChart.js
import React, { useState, useEffect, act } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { Tooltip } from "chart.js/auto";
import styled from "styled-components";
ChartJS.register(Tooltip);
const ChartWrap = styled.div`
  display: flex;
  flex-shrink: 1;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 95% !important;
  height: 100% !important;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

const ImplementSelect = styled.select`
  display: flex;
  border-radius: 30px;
  border-width: 2px;
  font-family: "Nunito", sans-serif;
  align-text: center;
  width: 100px;
  font-weight: 700;
  margin: 0;
  padding: 0;
`;
const ResponsiveLineChart = styled(Line)`
  width: 100% !important;
  height: 90% !important;
  margin: 0;
  padding: 0;
`;
const Title = styled.h2`
  display: flex;
  align-self: flex-start;
  margin: 0;
  padding: 0;
  margin-right: 15px;
  white-space: nowrap;
`;
const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin: 0;
  padding: 0;
`;

function LineChart({ activeTRPE, data }) {
  const [selectedImplement, setSelectedImplement] = useState("Discus");
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        backgroundColor: "",
        borderColor: "",
        borderWidth: 0,
      },
    ],
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      var jsonData;
      if (activeTRPE.length < 1) {
        const response = await fetch(
          `http://localhost:5000/api/get-practicesWithImp/${selectedImplement}`
        );
        jsonData = await response.json();
      } else {
        const params = new URLSearchParams({
          keys: JSON.stringify(activeTRPE),
        });
        const response = await fetch(
          `http://localhost:5000/api//get-practicesInTrpe?${params}`
        );
        jsonData = await response.json();
      }
      const currData = jsonData.rows.filter(
        (item) => item.prac_implement === selectedImplement
      );
      const labels = currData.map((item) => item.prac_rk); // Adjust according to your data structure
      const values = currData.map((item) => item.prac_best); // Adjust according to your data structure
      setChartData({
        labels: labels,
        datasets: [
          {
            //Label is the block at the top that you can click to filter
            label: `${selectedImplement} Legend`,
            data: values,
            pointRadius: 5,
            pointHoverRadius: 8, // Increase the hover radius
            pointHitRadius: 5, // Increase the hit radius
          },
        ],
      });
      setLoading(false);
    };
    fetchData();
  }, [selectedImplement, activeTRPE]);

  //Selected dropdown value changes the selected implement, then changing the data given
  const handleDatasetChange = (event) => {
    setSelectedImplement(event.target.value);
  };
  const options = {
    responsive: true,
    showLine: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: "nearest",
        intersect: false,
        callbacks: {
          label: function (tooltipItem) {
            return `(${tooltipItem.raw}m, Prac ${tooltipItem.label})`;
          },
        },
      },
    },
    hover: {
      mode: "point",
      intersect: false,
      onHover: function (event, chartElement) {
        event.native.target.style.cursor = chartElement[0]
          ? "pointer"
          : "default";
      },
    },
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        title: {
          display: true,
          text: "Practice Number",
        },
      },
      y: {
        title: {
          display: true,
          text: "Distance in Meters",
        },
      },
    },
  };
  if (loading) {
    return <ChartWrap>Loading...</ChartWrap>;
  }
  return (
    <ChartWrap>
      <Row>
        <Title>Chart of Practices</Title>
        <ImplementSelect
          onChange={handleDatasetChange}
          value={selectedImplement}
        >
          <option value="Javelin">Javelin</option>
          <option value="Discus">Discus</option>
          <option value="Shot Put">Shotput</option>
          <option value="Hammer Throw">Hammer</option>
        </ImplementSelect>
      </Row>
      <ResponsiveLineChart data={chartData} options={options} />
    </ChartWrap>
  );
}
export default LineChart;
