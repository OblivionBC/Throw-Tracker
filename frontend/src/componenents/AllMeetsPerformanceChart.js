import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { eventAssignmentsApi, eventTypesApi, personsApi } from "../api";
import { useApi } from "../hooks/useApi";
import Logger from "../utils/logger";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AllMeetsPerformanceChart = () => {
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState(null);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [chartType, setChartType] = useState("line");
  const [athletes, setAthletes] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [allAssignments, setAllAssignments] = useState([]);
  const { apiCall } = useApi();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Load all data concurrently
      const [assignmentsData, eventTypesData, athletesData] = await Promise.all(
        [
          apiCall(
            () => eventAssignmentsApi.getAllForCoach(),
            "Loading all event assignments"
          ),
          apiCall(() => eventTypesApi.getAll(), "Loading event types"),
          apiCall(() => personsApi.getAthletesForCoach(), "Loading athletes"),
        ]
      );

      setAllAssignments(assignmentsData);
      setEventTypes(eventTypesData);
      setAthletes(athletesData);
    } catch (error) {
      Logger.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, [apiCall]);

  const generateChartData = useCallback(() => {
    if (!selectedAthlete || !selectedEvent) {
      setChartData(null);
      return;
    }

    // Filter assignments by selected athlete and event
    const filteredAssignments = allAssignments.filter(
      (assignment) =>
        assignment.prsn_rk === selectedAthlete &&
        assignment.etyp_rk === selectedEvent &&
        assignment.final_mark !== null
    );

    if (filteredAssignments.length === 0) {
      setChartData(null);
      return;
    }

    // Sort by meet date
    const sortedAssignments = filteredAssignments.sort(
      (a, b) => new Date(a.meet_start_dt) - new Date(b.meet_start_dt)
    );

    const labels = sortedAssignments.map((assignment) => {
      const meetDate = assignment.meet_start_dt;
      return `${assignment.meet_nm} (${new Date(
        meetDate
      ).toLocaleDateString()})`;
    });

    const data = sortedAssignments.map((assignment) => assignment.final_mark);

    const athleteName = athletes.find((a) => a.prsn_rk === selectedAthlete);
    const eventName = eventTypes.find((e) => e.etyp_rk === selectedEvent);

    const chartConfig = {
      labels,
      datasets: [
        {
          label: `${athleteName?.prsn_first_nm} ${athleteName?.prsn_last_nm} - ${eventName?.etyp_type_name}`,
          data,
          borderColor: "rgb(75, 192, 192)",
          backgroundColor: "rgba(75, 192, 192, 0.2)",
          tension: 0.1,
          fill: chartType === "line",
        },
      ],
    };

    setChartData(chartConfig);
  }, [
    selectedAthlete,
    selectedEvent,
    allAssignments,
    athletes,
    eventTypes,
    chartType,
  ]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    if (allAssignments.length > 0) {
      generateChartData();
    }
  }, [generateChartData, allAssignments]);

  const getPerformanceStats = () => {
    if (!selectedAthlete || !selectedEvent || !chartData) return null;

    const filteredAssignments = allAssignments.filter(
      (assignment) =>
        assignment.prsn_rk === selectedAthlete &&
        assignment.etyp_rk === selectedEvent &&
        assignment.final_mark !== null
    );

    if (filteredAssignments.length === 0) return null;

    const marks = filteredAssignments.map((a) => a.final_mark);
    const best = Math.max(...marks);
    const average = marks.reduce((sum, mark) => sum + mark, 0) / marks.length;
    const latest = marks[marks.length - 1];
    const improvement = marks.length > 1 ? latest - marks[0] : 0;

    return {
      totalMeets: marks.length,
      bestMark: best,
      averageMark: average.toFixed(2),
      latestMark: latest,
      improvement: improvement.toFixed(2),
      trend:
        improvement > 0
          ? "Improving"
          : improvement < 0
          ? "Declining"
          : "Stable",
    };
  };

  if (loading) {
    return <LoadingMessage>Loading performance data...</LoadingMessage>;
  }

  const performanceStats = getPerformanceStats();

  return (
    <Container>
      <ControlsContainer>
        <SectionTitle>Performance Across All Meets</SectionTitle>

        <FilterControls>
          <FilterGroup>
            <FilterLabel>Athlete:</FilterLabel>
            <FilterSelect
              value={selectedAthlete || ""}
              onChange={(e) =>
                setSelectedAthlete(
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
            >
              <option value="">Select Athlete</option>
              {athletes.map((athlete) => (
                <option key={athlete.prsn_rk} value={athlete.prsn_rk}>
                  {athlete.prsn_first_nm} {athlete.prsn_last_nm}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Event:</FilterLabel>
            <FilterSelect
              value={selectedEvent || ""}
              onChange={(e) =>
                setSelectedEvent(
                  e.target.value ? parseInt(e.target.value) : null
                )
              }
            >
              <option value="">Select Event</option>
              {eventTypes.map((eventType) => (
                <option key={eventType.etyp_rk} value={eventType.etyp_rk}>
                  {eventType.etyp_type_name}
                </option>
              ))}
            </FilterSelect>
          </FilterGroup>

          <FilterGroup>
            <FilterLabel>Chart Type:</FilterLabel>
            <FilterSelect
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
            >
              <option value="line">Line Chart</option>
              <option value="bar">Bar Chart</option>
            </FilterSelect>
          </FilterGroup>
        </FilterControls>

        {performanceStats && (
          <PerformanceSummarySection>
            <SummaryTitle>Performance Summary</SummaryTitle>
            <SummaryGrid>
              <SummaryCard>
                <SummaryLabel>Total Meets</SummaryLabel>
                <SummaryValue>{performanceStats.totalMeets}</SummaryValue>
              </SummaryCard>
              <SummaryCard>
                <SummaryLabel>Best Mark</SummaryLabel>
                <SummaryValue>{performanceStats.bestMark}</SummaryValue>
              </SummaryCard>
              <SummaryCard>
                <SummaryLabel>Average Mark</SummaryLabel>
                <SummaryValue>{performanceStats.averageMark}</SummaryValue>
              </SummaryCard>
              <SummaryCard>
                <SummaryLabel>Latest Mark</SummaryLabel>
                <SummaryValue>{performanceStats.latestMark}</SummaryValue>
              </SummaryCard>
              <SummaryCard>
                <SummaryLabel>Overall Change</SummaryLabel>
                <SummaryValue trend={performanceStats.improvement}>
                  {performanceStats.improvement > 0 ? "+" : ""}
                  {performanceStats.improvement}
                </SummaryValue>
              </SummaryCard>
              <SummaryCard>
                <SummaryLabel>Trend</SummaryLabel>
                <SummaryValue trend={performanceStats.trend}>
                  {performanceStats.trend}
                </SummaryValue>
              </SummaryCard>
            </SummaryGrid>
          </PerformanceSummarySection>
        )}
      </ControlsContainer>

      <ChartSection>
        {!selectedAthlete || !selectedEvent ? (
          <NoDataMessage>
            <h3>Select Athlete and Event</h3>
            <p>
              Choose an athlete and event type to view performance trends across
              all meets.
            </p>
          </NoDataMessage>
        ) : !chartData ? (
          <NoDataMessage>
            <h3>No Performance Data</h3>
            <p>
              No competition data found for the selected athlete and event
              combination.
            </p>
          </NoDataMessage>
        ) : (
          <ChartContainer>
            {chartType === "line" ? (
              <Line
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: "Performance Trend Over Time",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      title: {
                        display: true,
                        text: "Performance Mark",
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: "Meet",
                      },
                    },
                  },
                }}
              />
            ) : (
              <Bar
                data={chartData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "top",
                    },
                    title: {
                      display: true,
                      text: "Performance by Meet",
                    },
                  },
                  scales: {
                    y: {
                      beginAtZero: false,
                      title: {
                        display: true,
                        text: "Performance Mark",
                      },
                    },
                    x: {
                      title: {
                        display: true,
                        text: "Meet",
                      },
                    },
                  },
                }}
              />
            )}
          </ChartContainer>
        )}
      </ChartSection>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 100%;
`;

const ControlsContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionTitle = styled.h2`
  margin: 0 0 20px 0;
  color: #333;
  font-size: 20px;
`;

const FilterControls = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
  flex-wrap: wrap;
`;

const FilterGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  font-weight: bold;
  color: #555;
  font-size: 14px;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  background: white;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const PerformanceSummarySection = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #eee;
`;

const SummaryTitle = styled.h3`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 16px;
`;

const SummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 15px;
`;

const SummaryCard = styled.div`
  background: #f8f9fa;
  border-radius: 6px;
  padding: 15px;
  text-align: center;
  border: 1px solid #e9ecef;
`;

const SummaryLabel = styled.div`
  font-size: 12px;
  color: #666;
  margin-bottom: 5px;
  font-weight: bold;
`;

const SummaryValue = styled.div`
  font-size: 18px;
  font-weight: bold;
  color: ${(props) => {
    if (
      props.trend === "Improving" ||
      (props.trend && parseFloat(props.trend) > 0)
    ) {
      return "#28a745";
    } else if (
      props.trend === "Declining" ||
      (props.trend && parseFloat(props.trend) < 0)
    ) {
      return "#dc3545";
    }
    return "#333";
  }};
`;

const ChartSection = styled.div`
  background: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  min-height: 400px;
`;

const ChartContainer = styled.div`
  height: 400px;
  width: 100%;
`;

const LoadingMessage = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 16px;
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
    font-size: 14px;
  }
`;

export default AllMeetsPerformanceChart;
