import React, { useState, useEffect, useRef, useCallback } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { Tooltip } from "chart.js/auto";
import styled from "styled-components";

import {
  measurementsApi,
  trainingPeriodsApi,
  programAthleteAssignmentsApi,
} from "../api";
import { useApi } from "../hooks/useApi";
import { useIsCoach, useSelectedAthlete, useUser } from "../stores/userStore";

ChartJS.register(Tooltip);

function MeasurementChart() {
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
  const [selectedTrainingPeriod, setSelectedTrainingPeriod] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("all");
  const [chartType, setChartType] = useState("line");
  const [trainingPeriods, setTrainingPeriods] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [measurementData, setMeasurementData] = useState([]);
  const { apiCall } = useApi();
  const isCoach = useIsCoach();
  const selectedAthlete = useSelectedAthlete();
  const user = useUser();
  const chartInstanceRef = useRef(null);

  const [options, setOptions] = useState({
    responsive: true,
    maintainAspectRatio: false,
    showLine: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Practice Measurements Over Time",
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
          text: "Date",
        },
        ticks: {
          callback: function (value, index, values) {
            // This will be handled by the data labels
            return "";
          },
        },
      },
      y: {
        title: {
          display: true,
          text: "Measurement Value",
        },
      },
    },
  });

  // Cleanup function to destroy chart
  const destroyChart = () => {
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
      chartInstanceRef.current = null;
    }
  };

  // Function to format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Function to filter and normalize dates to prevent extreme ranges
  const normalizeDateRange = (data, maxDays = 365 * 2) => {
    if (!data || data.length === 0) return data;

    const dates = data
      .map((item) => new Date(item.prac_dt))
      .sort((a, b) => a - b);
    const firstDate = dates[0];
    const lastDate = dates[dates.length - 1];
    const diffInDays = (lastDate - firstDate) / (1000 * 60 * 60 * 24);

    // If the range is too large, filter to the most recent data
    if (diffInDays > maxDays) {
      const cutoffDate = new Date(
        lastDate.getTime() - maxDays * 24 * 60 * 60 * 1000
      );
      return data.filter((item) => new Date(item.prac_dt) >= cutoffDate);
    }

    return data;
  };

  // Load training periods for the current person
  const loadTrainingPeriods = useCallback(async () => {
    try {
      let personId;
      if (isCoach) {
        // For coaches, use selected athlete if available
        personId = selectedAthlete;
      } else {
        // For athletes, use their own ID
        personId = user?.id;
      }

      if (personId) {
        const periods = await apiCall(
          () => trainingPeriodsApi.getAllForPerson(personId),
          "Loading training periods"
        );
        setTrainingPeriods(periods);
      } else {
        setTrainingPeriods([]);
      }
    } catch (error) {
      console.error("Error loading training periods:", error);
      setTrainingPeriods([]);
    }
  }, [isCoach, selectedAthlete, user?.id, apiCall]);

  // Load programs for the selected training period
  const loadPrograms = useCallback(async () => {
    if (!selectedTrainingPeriod) {
      setPrograms([]);
      setSelectedProgram("all");
      return;
    }

    try {
      const programsData = await apiCall(
        () =>
          programAthleteAssignmentsApi.getTrainingPeriodPrograms(
            selectedTrainingPeriod
          ),
        "Loading programs for training period"
      );
      setPrograms(programsData);
      // Keep "All Programs" as default when training period changes
      setSelectedProgram("all");
    } catch (error) {
      console.error("Error loading programs:", error);
      setPrograms([]);
      setSelectedProgram("all");
    }
  }, [selectedTrainingPeriod, apiCall]);

  const GetMeasurements = useCallback(async () => {
    try {
      let jsonData;

      if (isCoach) {
        // For coaches, get measurements for the selected athlete
        if (!selectedAthlete) {
          jsonData = [];
        } else {
          jsonData = await apiCall(
            () => measurementsApi.getForCoach(selectedAthlete),
            "Fetching measurements for coach"
          );
        }
      } else {
        // For athletes, get all their measurements
        jsonData = await apiCall(
          () => measurementsApi.getAllForPerson(user.prsn_rk),
          "Fetching measurements for athlete"
        );
      }

      if (jsonData.length > 0) {
        // Filter by training period if selected
        if (selectedTrainingPeriod) {
          jsonData = jsonData.filter(
            (item) => String(item.trpe_rk) === String(selectedTrainingPeriod)
          );
        }

        // Filter by program if selected (and not "all")
        if (selectedProgram && selectedProgram !== "all") {
          // This would require additional logic to filter by program
          // For now, we'll show all measurements in the training period
          // TODO: Implement program-specific filtering if needed
        }

        // Normalize the date range to prevent extreme ranges
        jsonData = normalizeDateRange(jsonData);

        // Make a map and add each unique meas_id from the Query Results as a key with an array as the value
        let newDataMap = new Map();
        jsonData.forEach((element) => {
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

        // Store the raw data for summary calculations
        setMeasurementData(jsonData);

        let datasetArray = [];
        let allDates = [];

        // Group by measurable only
        newDataMap.forEach((row, key) => {
          const values = row?.map((item) => {
            const date = new Date(item.prac_dt);
            allDates.push(item.prac_dt);
            return { x: date.getTime(), y: item.msrm_value };
          });

          datasetArray.push({
            label: `${key}`,
            data: values,
            pointRadius: 5,
            spanGaps: false,
            pointHoverRadius: 8,
            pointHitRadius: 5,
            borderColor: `hsl(${datasetArray.length * 60}, 70%, 50%)`,
            backgroundColor: `hsla(${datasetArray.length * 60}, 70%, 50%, 0.1)`,
          });
        });

        setChartData({
          labels: [],
          datasets: datasetArray,
        });

        setOptions({
          responsive: true,
          maintainAspectRatio: false,
          showLine: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            title: {
              display: true,
              text: "Practice Measurements Over Time",
            },
            tooltip: {
              mode: "nearest",
              intersect: false,
              callbacks: {
                title: function (tooltipItems) {
                  const timestamp = tooltipItems[0].parsed.x;
                  return formatDate(new Date(timestamp));
                },
                label: function (tooltipItem) {
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
              type: "linear",
              position: "bottom",
              title: { display: true, text: "Date" },
              ticks: {
                callback: function (value, index, values) {
                  // Show only some tick labels to avoid overcrowding
                  if (index % Math.ceil(values.length / 10) === 0) {
                    return formatDate(new Date(value));
                  }
                  return "";
                },
                maxRotation: 45,
                minRotation: 0,
              },
            },
            y: {
              title: {
                display: true,
                text: "Measurement Value",
              },
            },
          },
        });
      } else {
        setChartData({
          labels: [],
          datasets: [
            {
              label: "No Data",
              data: [],
              spanGaps: false,
              pointRadius: 5,
              pointHoverRadius: 8,
              pointHitRadius: 5,
            },
          ],
        });
        setMeasurementData([]);
      }
    } catch (error) {
      console.error("Error fetching measurements:", error);
    }
  }, [
    isCoach,
    selectedAthlete,
    user?.prsn_rk,
    selectedTrainingPeriod,
    selectedProgram,
    apiCall,
  ]);

  const getMeasurementStats = () => {
    if (!measurementData.length) return [];

    // Group by measurable only
    const groupedByMeasurable = measurementData.reduce((acc, item) => {
      if (!acc[item.meas_id]) {
        acc[item.meas_id] = [];
      }
      acc[item.meas_id].push(item);
      return acc;
    }, {});

    return Object.entries(groupedByMeasurable).map(([measId, items]) => {
      const values = items.map((item) => item.msrm_value);
      const best = Math.max(...values);
      const worst = Math.min(...values);
      const average = values.reduce((sum, val) => sum + val, 0) / values.length;
      const latest = items[items.length - 1]?.msrm_value || 0;
      const improvement = items.length > 1 ? latest - items[0].msrm_value : 0;

      return {
        measurableId: measId,
        totalMeasurements: items.length,
        bestValue: best,
        worstValue: worst,
        averageValue: average,
        latestValue: latest,
        improvement: improvement,
        unit: items[0]?.meas_unit || "",
      };
    });
  };

  // Load training periods on component mount
  useEffect(() => {
    loadTrainingPeriods();
  }, [loadTrainingPeriods]);

  // Load programs when training period changes
  useEffect(() => {
    loadPrograms();
  }, [loadPrograms]);

  // Get measurements when filters change
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await GetMeasurements();
      setLoading(false);
    };
    fetchData();
  }, [GetMeasurements]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      destroyChart();
    };
  }, []);

  // Handle chart instance creation with proper cleanup
  const handleChartRef = (chartInstance) => {
    // Destroy previous chart instance if it exists
    if (chartInstanceRef.current) {
      chartInstanceRef.current.destroy();
    }

    if (chartInstance) {
      chartInstanceRef.current = chartInstance;
    }
  };

  if (loading) {
    return <LoadingMessage>Loading measurement data...</LoadingMessage>;
  }

  const measurementStats = getMeasurementStats();

  return (
    <ChartContainer>
      <ControlsSection>
        <FilterRow>
          <FilterGroup>
            <FieldLabel>Training Period</FieldLabel>
            <select
              value={selectedTrainingPeriod}
              onChange={(e) => setSelectedTrainingPeriod(e.target.value)}
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                minWidth: "200px",
              }}
            >
              <option value="">Select a Training Period</option>
              {trainingPeriods.map((period) => (
                <option key={period.trpe_rk} value={period.trpe_rk}>
                  {formatDate(period.trpe_start_dt)} -{" "}
                  {period.trpe_end_dt
                    ? formatDate(period.trpe_end_dt)
                    : "Active"}
                </option>
              ))}
            </select>
          </FilterGroup>

          <FilterGroup>
            <FieldLabel>Program</FieldLabel>
            <select
              value={selectedProgram}
              onChange={(e) => setSelectedProgram(e.target.value)}
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                minWidth: "200px",
              }}
              disabled={!selectedTrainingPeriod}
            >
              <option value="all">All Programs</option>
              {programs.map((program) => (
                <option key={program.prog_rk} value={program.prog_rk}>
                  {program.prog_nm}
                </option>
              ))}
            </select>
          </FilterGroup>

          <FilterGroup>
            <FieldLabel>Chart Type</FieldLabel>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                minWidth: "100px",
              }}
            >
              <option value="line">Line Chart</option>
            </select>
          </FilterGroup>
        </FilterRow>
      </ControlsSection>

      {chartData.datasets.length > 0 &&
        chartData.datasets[0].data.length > 0 && (
          <ChartSection>
            <ChartWrapper>
              <Line ref={handleChartRef} data={chartData} options={options} />
            </ChartWrapper>
          </ChartSection>
        )}

      {measurementStats.length > 0 && (
        <PerformanceSummarySection>
          <SectionTitle>Measurement Summary</SectionTitle>
          <SummaryGrid>
            {measurementStats.map((stat) => (
              <SummaryCard key={stat.measurableId}>
                <CardHeader>
                  <MeasurableName>{stat.measurableId}</MeasurableName>
                  <UnitLabel>{stat.unit}</UnitLabel>
                </CardHeader>
                <CardBody>
                  <StatRow>
                    <StatLabel>Total Measurements:</StatLabel>
                    <StatValue>{stat.totalMeasurements}</StatValue>
                  </StatRow>
                  <StatRow>
                    <StatLabel>Best Value:</StatLabel>
                    <StatValue>{stat.bestValue.toFixed(2)}</StatValue>
                  </StatRow>
                  <StatRow>
                    <StatLabel>Worst Value:</StatLabel>
                    <StatValue>{stat.worstValue.toFixed(2)}</StatValue>
                  </StatRow>
                  <StatRow>
                    <StatLabel>Average:</StatLabel>
                    <StatValue>{stat.averageValue.toFixed(2)}</StatValue>
                  </StatRow>
                  <StatRow>
                    <StatLabel>Latest:</StatLabel>
                    <StatValue>{stat.latestValue.toFixed(2)}</StatValue>
                  </StatRow>
                  <StatRow>
                    <StatLabel>Overall Change:</StatLabel>
                    <StatValue trend={stat.improvement}>
                      {stat.improvement > 0 ? "+" : ""}
                      {stat.improvement.toFixed(2)}
                    </StatValue>
                  </StatRow>
                </CardBody>
              </SummaryCard>
            ))}
          </SummaryGrid>
        </PerformanceSummarySection>
      )}

      {chartData.datasets.length === 0 ||
      chartData.datasets[0].data.length === 0 ? (
        <NoDataMessage>
          <h3>No Measurement Data</h3>
          <p>
            {isCoach
              ? "Please select an athlete from the navbar and a training period to view measurement data."
              : "Please select a training period to view measurement data."}
          </p>
        </NoDataMessage>
      ) : null}
    </ChartContainer>
  );
}

const ChartContainer = styled.div`
  width: 100%;
`;

const ControlsSection = styled.div`
  margin-bottom: 20px;
  padding: 15px;
  background: #f8f9fa;
  border-radius: 8px;
`;

const FilterRow = styled.div`
  display: flex;
  gap: 20px;
  align-items: end;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const FieldLabel = styled.label`
  font-weight: 500;
  color: #555;
  font-size: 14px;
`;

const ChartSection = styled.div`
  margin-bottom: 30px;
`;

const ChartWrapper = styled.div`
  height: 400px;
  position: relative;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
`;

const PerformanceSummarySection = styled.div`
  margin-top: 30px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 15px;
`;

const SummaryCard = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  background: white;
  overflow: hidden;
`;

const CardHeader = styled.div`
  background: #f8f9fa;
  padding: 12px 15px;
  border-bottom: 1px solid #eee;
`;

const MeasurableName = styled.div`
  font-weight: bold;
  color: #333;
  font-size: 14px;
  margin-bottom: 2px;
`;

const UnitLabel = styled.div`
  color: #666;
  font-size: 12px;
  font-style: italic;
`;

const CardBody = styled.div`
  padding: 15px;
`;

const StatRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const StatLabel = styled.span`
  font-weight: 500;
  color: #555;
  font-size: 13px;
`;

const StatValue = styled.span`
  font-weight: bold;
  color: ${(props) => {
    if (props.trend > 0) return "#28a745";
    if (props.trend < 0) return "#dc3545";
    return "#333";
  }};
  font-size: 13px;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-style: italic;
`;

const NoDataMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;

  h3 {
    margin: 0 0 10px 0;
    color: #333;
  }

  p {
    margin: 0;
    font-style: italic;
  }
`;

export default MeasurementChart;
