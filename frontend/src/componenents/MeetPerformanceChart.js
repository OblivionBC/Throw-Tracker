import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement,
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";
import { eventAssignmentsApi, eventTypesApi, personsApi } from "../api";
import { useApi } from "../hooks/useApi";
import {
  StyledButton,
  FieldContainer,
  FieldLabel,
  FieldOutputContainer,
} from "../styles/design-system";
import styled from "styled-components";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const MeetPerformanceChart = ({ meetId, athleteId }) => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [selectedAthlete, setSelectedAthlete] = useState("all");
  const [chartType, setChartType] = useState("line"); // "line" or "bar"
  const [eventTypes, setEventTypes] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const { apiCall } = useApi();

  const [options, setOptions] = useState({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Meet Performance by Attempt",
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
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Performance (meters/feet)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Attempt Number",
        },
      },
    },
  });

  useEffect(() => {
    if (meetId) {
      loadData();
    }
  }, [meetId]);

  useEffect(() => {
    if (performanceData.length > 0) {
      generateChartData();
    }
  }, [performanceData, selectedEvent, selectedAthlete, chartType]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load event types for filtering
      const eventTypesResponse = await apiCall(
        () => eventTypesApi.getAll(),
        "Fetching event types for chart"
      );
      setEventTypes(eventTypesResponse);

      // Load performance data for the meet
      const assignments = await apiCall(
        () => eventAssignmentsApi.getAllByMeet(meetId),
        `Fetching meet assignments for ${meetId}`
      );

      setPerformanceData(assignments);

      // Extract unique athletes from assignments
      const uniqueAthletes = assignments.reduce((acc, assignment) => {
        const athleteKey = assignment.prsn_rk;
        if (!acc.find((a) => a.prsn_rk === athleteKey)) {
          acc.push({
            prsn_rk: assignment.prsn_rk,
            athlete_first_nm: assignment.athlete_first_nm,
            athlete_last_nm: assignment.athlete_last_nm,
          });
        }
        return acc;
      }, []);

      setAthletes(uniqueAthletes);
    } catch (error) {
      console.error("Error loading performance data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateChartData = () => {
    let filteredData = performanceData;

    // Filter by event if not "all"
    if (selectedEvent !== "all") {
      filteredData = filteredData.filter(
        (item) => item.etyp_rk === parseInt(selectedEvent)
      );
    }

    // Filter by athlete if not "all"
    if (selectedAthlete !== "all") {
      filteredData = filteredData.filter(
        (item) => item.prsn_rk === parseInt(selectedAthlete)
      );
    }

    const datasets = filteredData.map((assignment, index) => {
      const attempts = [
        assignment.attempt_one,
        assignment.attempt_two,
        assignment.attempt_three,
        assignment.attempt_four,
        assignment.attempt_five,
        assignment.attempt_six,
      ].filter((attempt) => attempt !== null && attempt !== undefined);

      const eventType = eventTypes.find(
        (et) => et.etyp_rk === assignment.etyp_rk
      );
      const athleteName = `${assignment.athlete_first_nm} ${assignment.athlete_last_nm}`;

      const color = `hsl(${index * 60}, 70%, 50%)`;
      const backgroundColor = `hsla(${index * 60}, 70%, 50%, 0.1)`;

      return {
        label: `${athleteName} - ${
          eventType ? eventType.etyp_type_name : `Event ${assignment.etyp_rk}`
        }`,
        data: attempts,
        borderColor: color,
        backgroundColor:
          chartType === "bar" ? backgroundColor : backgroundColor,
        tension: 0.1,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: false,
      };
    });

    const labels = [
      "Attempt 1",
      "Attempt 2",
      "Attempt 3",
      "Attempt 4",
      "Attempt 5",
      "Attempt 6",
    ];

    setChartData({
      labels,
      datasets,
    });
  };

  const getPerformanceStats = () => {
    const filteredData = performanceData.filter((item) => {
      const eventMatch =
        selectedEvent === "all" || item.etyp_rk === parseInt(selectedEvent);
      const athleteMatch =
        selectedAthlete === "all" || item.prsn_rk === parseInt(selectedAthlete);
      return eventMatch && athleteMatch;
    });

    return filteredData.map((assignment) => {
      const eventType = eventTypes.find(
        (et) => et.etyp_rk === assignment.etyp_rk
      );
      const attempts = [
        assignment.attempt_one,
        assignment.attempt_two,
        assignment.attempt_three,
        assignment.attempt_four,
        assignment.attempt_five,
        assignment.attempt_six,
      ].filter((attempt) => attempt !== null && attempt !== undefined);

      const bestAttempt = attempts.length > 0 ? Math.max(...attempts) : 0;
      const averageAttempt =
        attempts.length > 0
          ? attempts.reduce((a, b) => a + b, 0) / attempts.length
          : 0;
      const finalMark = assignment.final_mark || bestAttempt;

      return {
        assignment,
        eventType,
        attempts,
        bestAttempt,
        averageAttempt,
        finalMark,
        attemptCount: attempts.length,
      };
    });
  };

  if (loading) {
    return <LoadingMessage>Loading performance data...</LoadingMessage>;
  }

  if (performanceData.length === 0) {
    return (
      <NoDataMessage>
        No performance data available for this meet.
      </NoDataMessage>
    );
  }

  const performanceStats = getPerformanceStats();

  return (
    <ChartContainer>
      <ControlsSection>
        <FilterRow>
          <FilterGroup>
            <FieldLabel>Event Type</FieldLabel>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                minWidth: "150px",
              }}
            >
              <option value="all">All Events</option>
              {eventTypes
                .filter((et) =>
                  performanceData.some((pd) => pd.etyp_rk === et.etyp_rk)
                )
                .map((eventType) => (
                  <option key={eventType.etyp_rk} value={eventType.etyp_rk}>
                    {eventType.etyp_type_name}
                  </option>
                ))}
            </select>
          </FilterGroup>

          <FilterGroup>
            <FieldLabel>Athlete</FieldLabel>
            <select
              value={selectedAthlete}
              onChange={(e) => setSelectedAthlete(e.target.value)}
              style={{
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
                fontSize: "14px",
                minWidth: "150px",
              }}
            >
              <option value="all">All Athletes</option>
              {athletes.map((athlete) => (
                <option key={athlete.prsn_rk} value={athlete.prsn_rk}>
                  {athlete.athlete_first_nm} {athlete.athlete_last_nm}
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
              <option value="bar">Bar Chart</option>
            </select>
          </FilterGroup>
        </FilterRow>
      </ControlsSection>

      {chartData && (
        <ChartSection>
          <ChartWrapper>
            {chartType === "line" ? (
              <Line data={chartData} options={options} />
            ) : (
              <Bar data={chartData} options={options} />
            )}
          </ChartWrapper>
        </ChartSection>
      )}

      <PerformanceSummarySection>
        <SectionTitle>Performance Summary</SectionTitle>
        <SummaryGrid>
          {performanceStats.map((stat) => (
            <SummaryCard
              key={`${stat.assignment.meet_rk}-${stat.assignment.prsn_rk}-${stat.assignment.etyp_rk}`}
            >
              <CardHeader>
                <AthleteName>
                  {stat.assignment.athlete_first_nm}{" "}
                  {stat.assignment.athlete_last_nm}
                </AthleteName>
                <EventName>
                  {stat.eventType
                    ? stat.eventType.etyp_type_name
                    : `Event ${stat.assignment.etyp_rk}`}
                </EventName>
              </CardHeader>
              <CardBody>
                <StatRow>
                  <StatLabel>Best Attempt:</StatLabel>
                  <StatValue>{stat.bestAttempt.toFixed(2)}</StatValue>
                </StatRow>
                <StatRow>
                  <StatLabel>Final Mark:</StatLabel>
                  <StatValue>{stat.finalMark.toFixed(2)}</StatValue>
                </StatRow>
                <StatRow>
                  <StatLabel>Average:</StatLabel>
                  <StatValue>{stat.averageAttempt.toFixed(2)}</StatValue>
                </StatRow>
                <StatRow>
                  <StatLabel>Attempts:</StatLabel>
                  <StatValue>{stat.attemptCount}/6</StatValue>
                </StatRow>
                {stat.assignment.notes && (
                  <StatRow>
                    <StatLabel>Notes:</StatLabel>
                    <StatValue>{stat.assignment.notes}</StatValue>
                  </StatRow>
                )}
              </CardBody>
            </SummaryCard>
          ))}
        </SummaryGrid>
      </PerformanceSummarySection>
    </ChartContainer>
  );
};

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

const ChartSection = styled.div`
  margin-bottom: 30px;
`;

const ChartWrapper = styled.div`
  height: 400px;
  position: relative;
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

const AthleteName = styled.div`
  font-weight: bold;
  color: #333;
  font-size: 14px;
  margin-bottom: 2px;
`;

const EventName = styled.div`
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
  color: #333;
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
  font-style: italic;
`;

export default MeetPerformanceChart;
