// components/BarChart.js
import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, registerables } from "chart.js/auto";
import "chartjs-adapter-date-fns";
import { Tooltip } from "chart.js/auto";
import dayjs from "dayjs";
import styled from "styled-components";
ChartJS.register(Tooltip);

function MeasurementChart({ activeTRPE }) {
  const [selectedMeasurable, setSelectedMeasurable] = useState("");
  const [loading, setLoading] = useState(true);
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
  const [dataMap, setDataMap] = useState(new Map());
  const [options, setOptions] = useState({
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
          text: "Measurement in ",
        },
      },
    },
  });

  //This Use effect will be for when the selected TRPEs change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      console.log("REFRESH");

      //First case is that the user has selected the training period, meaning we will set new data
      if (activeTRPE.length > 0) {
        const params = new URLSearchParams({
          keys: JSON.stringify(activeTRPE),
        });
        //Returns msrm_rk | prac_rk | meas_id | meas_unit | prsn_rk | prac_rk | trpe_rk
        const response = await fetch(
          `http://localhost:5000/api//get-measurementsForTRPEs?${params}`
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
        setDataMap(newDataMap);

        //Second case is that there are no active TRPEs, in which we want to reset the data
      } else {
        let newDataMap = new Map();
        setDataMap(newDataMap);
        const labels = [];
        const values = [];
        setChartData({
          labels: labels,
          datasets: [
            {
              //Label is the block at the top that you can click to filter
              label: `Legend`,
              data: values,
              spanGaps: false,
              pointRadius: 5,
              pointHoverRadius: 8, // Increase the hover radius
              pointHitRadius: 5, // Increase the hit radius
            },
          ],
        });
      }
      console.log("Loading false " + loading);
    };
    fetchData();
    setLoading(false);
  }, [activeTRPE]);

  useEffect(() => {
    if (activeTRPE.length > 0) {
      //Make sure the selected measurable is a real measurable
      if (selectedMeasurable !== "" && selectedMeasurable !== undefined) {
        //Sort the array of measurements by date
        let newArray = dataMap.get(selectedMeasurable);
        newArray.sort(
          (a, b) =>
            new Date(a.prac_dt).getTime() - new Date(b.prac_dt).getTime()
        );
        //Set the Lables (y values) as the practice dates without the timestamps
        const labels = newArray?.map((item) => {
          return item.prac_dt.split("T")[0];
        });
        //Set the values (x values) as the measurement value
        const values = newArray?.map((item) => item.msrm_value); // Adjust according to your data structure
        //Update the chart data to this
        setChartData({
          labels: labels,
          datasets: [
            {
              //Label is the block at the top that you can click to filter, not using this yet
              label: `${selectedMeasurable.meas_id} Legend`,
              data: values,
              pointRadius: 5,
              spanGaps: false,
              pointHoverRadius: 8, // Increase the hover radius
              pointHitRadius: 5, // Increase the hit radius
            },
          ],
        });
        //Set the options for the tooltip
        setOptions({
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
                  let prac = dataMap.get(selectedMeasurable)?.find((obj) => {
                    return obj.prac_dt.split("T")[0] == tooltipItem.label;
                  });

                  return `${tooltipItem.raw}${prac.meas_unit}, ${dayjs(
                    prac.prac_dt
                  ).format("YYYY-MM-DD")}  `;
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
              type: "category",
              time: {
                unit: "day",
                tooltipFormat: "yyyy-MM-dd",
                displayFormats: { day: "yyyy-MM-dd" },
                distribution: "series",
              },
              position: "bottom",
              title: { display: true, text: "Date" },
              ticks: {
                source: "data",
                autoSkip: true,
              },
            },
            y: {
              title: {
                display: true,
                text: `Measurement in ${
                  dataMap.get(selectedMeasurable)[0].meas_unit
                }  `,
              },
            },
          },
        });
      }
    } else {
      console.log("CHANGING DATA WHEN NO ACTIVE TRPE");
      setChartData({
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
    }
    setLoading(false);
  }, [selectedMeasurable]);

  if (loading) {
    return <ChartWrap>Loading...</ChartWrap>;
  }
  return (
    <ChartWrap>
      <Message>
        {activeTRPE.length === 0 ? "Please Select a Training Period" : ""}
      </Message>

      <Row>
        <Title>Chart of Practices</Title>
        <ImplementSelect
          onChange={(e) => setSelectedMeasurable(e.target.value)}
        >
          <option value="">Choose A Measurable</option>
          {[...dataMap?.keys()].map((key) => (
            <option value={key}>{key}</option>
          ))}
        </ImplementSelect>
      </Row>
      <ResponsiveLineChart data={chartData} options={options} />
    </ChartWrap>
  );
}

const Message = styled.div`
  position: relative;
  padding: 0;
  margin: 0;
  top: 50%;
  left: 20%;
  transform: translate(-50%, -50%);
  z-index: 2;
  padding: 12px 24px;
  color: black;
  display: flex;
  justify-content: center;
  align-items: center;
`;

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
  width: 200px;
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
