import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import "chartjs-adapter-date-fns";
import { Tooltip } from "chart.js/auto";
import styled from "styled-components";

import { API_BASE_URL } from "../config";

ChartJS.register(Tooltip);
/*
Can do these options
Add Measurables based on measurables since they selected TRPEs, 
 This approach First  --Make legend have measurables from all selected TRPEs, hover data has the trpe?
Make my own version?
*/

//This approach means no selected measurable at all, it will take the data from the measurables and dump them into seperate datasets
function MeasurementChart({ activeTRPE }) {
  const [loading, setLoading] = useState(true);
  const [labels, setLabels] = useState([]);
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "",
        data: [],
        spanGaps: false,
        backgroundColor: "",
        borderColor: "",
        borderWidth: 0,
      },
    ],
  });
  const [openFilters, setOpenFilters] = useState(new Map());
  const [options, setOptions] = useState({
    responsive: true,
    showLine: true,
    plugins: {
      legend: {
        display: true,
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
        type: "time",
        time: {
          unit: "day",
          tooltipFormat: "yyyy-MM-dd",
          displayFormats: { day: "MMM dd, yyyy" },
          distribution: "series",
        },
        position: "bottom",
        title: {
          display: true,
          text: "Date",
        },
      },
      y: {
        title: {
          display: true,
          text: "Measurement in ",
        },
      },
    },
  });
  async function GetTrainingPeriodMeasurements() {
    //First case is that the user has selected the training period, meaning we will set new data
    if (activeTRPE.length > 0) {
      console.log("TRPES are selected");
      const params = new URLSearchParams({
        keys: JSON.stringify(activeTRPE),
      });
      //Returns msrm_rk | prac_rk | meas_id | meas_unit | prsn_rk | prac_rk | trpe_rk
      const response = await fetch(
        `${API_BASE_URL}/api//get-measurementsForTRPEs?${params}`
      );

      const jsonData = await response.json();
      //Make a map and add each unique meas_id from the Query Results as a key with and array as the value
      let newDataMap = new Map();
      jsonData.rows.forEach((element) => {
        if (!newDataMap.has(element.meas_id)) {
          newDataMap.set(element.meas_id, [
            {
              prac_rk: element.prac_rk,
              msrm_rk: element.msrm_rk,
              meas_unit: element.meas_unit,
              msrm_value: element.msrm_value,
              prac_dt: element.prac_dt,
            },
          ]);
          //There is already an array, so we just need to push to it
        } else {
          newDataMap.get(element.meas_id).push({
            prac_rk: element.prac_rk,
            msrm_rk: element.msrm_rk,
            meas_unit: element.meas_unit,
            msrm_value: element.msrm_value,
            prac_dt: element.prac_dt,
          });
        }
      });
      console.log(newDataMap);
      console.log("Starting Phase 2 of having a training period");
      let datasetArray = [];
      let newLabels = [];
      newDataMap.forEach((row, key) => {
        newLabels = row?.map((item) => {
          return item.prac_dt.split("T")[0];
        });
        console.log(newLabels);
        const values = row?.map((item) => {
          return { x: item.prac_dt.split("T")[0], y: item.msrm_value };
        });
        console.log(values);
        console.log(newLabels);
        datasetArray.push({
          //Label is the block at the top that you can click to filter, not using this yet
          label: `${key}`,
          data: values,
          pointRadius: 5,
          spanGaps: false,
          pointHoverRadius: 1, // Increase the hover radius
          pointHitRadius: 1, // Increase the hit radius
        });
      });

      console.log("Sorting Complete");
      console.log(newLabels);
      console.log(datasetArray);
      setChartData({
        labels: newLabels,
        datasets: datasetArray,
      });

      //Set the options for the tooltip
      setOptions({
        responsive: true,
        showLine: true,
        plugins: {
          legend: {
            display: true,
            position: "top", //'bottom' 'left' 'right'
          },
          tooltip: {
            mode: "nearest",
            intersect: false,
            callbacks: {
              label: function (tooltipItem) {
                console.log(tooltipItem);
                return `${tooltipItem?.dataset?.label}, ${tooltipItem?.formattedValue}`;
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
            type: "time",
            time: {
              unit: "day",
              tooltipFormat: "yyyy-MM-dd",
              displayFormats: { day: "MMM dd, yyyy" },
              distribution: "series",
            },
            position: "bottom",
            title: { display: true, text: "Date" },
            ticks: {
              source: "data",
              autoSkip: true,
              maxRotation: 90,
              minRotation: 45,
            },
          },
          y: {
            title: {
              display: true,
              text: `Measurement`,
            },
          },
        },
      });
      //Second case is that there are no active TRPEs, in which we want to reset the data
    } else {
      console.log("NO ACTIVE TRPES");
      setChartData({
        labels: [],
        datasets: [
          {
            //Label is the block at the top that you can click to filter
            label: `Legend`,
            data: [],
            spanGaps: false,
            pointRadius: 5,
            pointHoverRadius: 8, // Increase the hover radius
            pointHitRadius: 5, // Increase the hit radius
          },
        ],
      });
    }
  }

  //This Use effect will be for when the selected TRPEs change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await GetTrainingPeriodMeasurements();
    };
    fetchData();
    setLoading(false);
  }, [activeTRPE]);

  if (loading) {
    return <ChartWrap>Loading...</ChartWrap>;
  }
  return (
    <ChartWrap>
      <Row>
        <Title>Chart of Practices</Title>
        {[...openFilters?.keys()].map((key) => (
          <p value={key}>{key}</p>
        ))}
        <RefreshButton onClick={() => console.log("REFRESH")}>
          Refresh
        </RefreshButton>
      </Row>
      <ResponsiveLineChart data={chartData} options={options} />
    </ChartWrap>
  );
}

const ChartWrap = styled.div`
  display: flex;

  align-items: center;
  justify-content: center;
  flex-direction: column;
  width: 95% !important;
  height: 100% !important;
  margin: 0;
  padding: 0;
  overflow: hidden;
`;

const ResponsiveLineChart = styled(Line)`
  width: 100% !important;
  height: 90% !important;
  display: flex;
  border-radius: 10px;
  border: 2px solid gray;
  margin: 0;
  padding: 0;
  background-color: white;
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
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  margin: 0;
  padding: 0;
`;

const RefreshButton = styled.button`
  background: linear-gradient(45deg, #808080 30%, white 95%);
  border: none;
  border-radius: 25px;
  color: white;
  padding: 5px 20px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translateY(0);
  }
`;
export default MeasurementChart;
