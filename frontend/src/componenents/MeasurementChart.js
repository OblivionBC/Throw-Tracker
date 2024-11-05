// components/BarChart.js
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { Tooltip } from "chart.js/auto";
import styled from "styled-components";
ChartJS.register(Tooltip);

function MeasurementChart({ activeTRPE }) {
  const [selectedImplement, setSelectedImplement] = useState("Discus");
  const [selectedMeasurable, setSelectedMeasurable] = useState("");
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
  const [dataMap, setDataMap] = useState(new Map());

  //This Use effect will be for when the selected TRPEs change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log("REFRESH");
      const params = new URLSearchParams({
        keys: JSON.stringify(activeTRPE),
      });
      //Returns msrm_rk | prac_rk |          meas_id           | meas_unit | prsn_rk | prac_rk | trpe_rk
      const response = await fetch(
        `http://localhost:5000/api//get-measurementsForTRPEs?${params}`
      );
      const jsonData = await response.json();
      console.log(jsonData.rows);
      let newDataMap = new Map();
      jsonData.rows.forEach((element) => {
        if (!newDataMap.has(element.meas_id)) {
          newDataMap.set(element.meas_id, [
            {
              prac_rk: element.prac_rk,
              msrm_rk: element.msrm_rk,
              msrm_value: element.msrm_value,
            },
          ]);
        } else {
          newDataMap.get(element.meas_id).push({
            prac_rk: element.prac_rk,
            msrm_rk: element.msrm_rk,
            msrm_value: element.msrm_value,
          });
        }
      });
      setDataMap(newDataMap);
      const firstKey = Array.from(dataMap.keys())[0];
      setSelectedMeasurable(firstKey);
      setLoading(false);
    };
    fetchData();
  }, [activeTRPE]);

  useEffect(() => {
    console.log(dataMap);
    console.log(selectedMeasurable);
    let iterator = 0;
    if (selectedMeasurable !== "") {
      const labels = dataMap.get(selectedMeasurable).map((item) => {
        iterator++;
        return iterator;
      });

      const values = dataMap
        .get(selectedMeasurable)
        .map((item) => item.msrm_value); // Adjust according to your data structure
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
    } else {
      const labels = [];

      const values = [];
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
    }
    setLoading(false);
  }, [selectedMeasurable]);

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
          onChange={(e) => setSelectedMeasurable(e.target.value)}
        >
          {[...dataMap.keys()].map((key) => (
            <option value={key}>{key}</option>
          ))}
        </ImplementSelect>
      </Row>
      <ResponsiveLineChart data={chartData} options={options} />
    </ChartWrap>
  );
}

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
export default MeasurementChart;