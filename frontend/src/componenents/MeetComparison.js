import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { eventAssignmentsApi, eventTypesApi, meetsApi } from "../api";
import { useApi } from "../hooks/useApi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MeetComparison = () => {
  const [meets, setMeets] = useState([]);
  const [selectedMeets, setSelectedMeets] = useState([]);
  const [selectedAthlete, setSelectedAthlete] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [athletes, setAthletes] = useState([]);
  const [eventTypes, setEventTypes] = useState([]);
  const [comparisonData, setComparisonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { apiCall } = useApi();

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedMeets.length > 0) {
      loadComparisonData();
    }
  }, [selectedMeets, selectedAthlete, selectedEvent]);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Load meets
      const meetsData = await apiCall(
        () => meetsApi.getForCoachOrg(),
        "Loading meets for comparison"
      );
      setMeets(meetsData);

      // Load event types
      const eventTypesData = await apiCall(
        () => eventTypesApi.getAll(),
        "Loading event types for comparison"
      );
      setEventTypes(eventTypesData);

      // Load all assignments to get unique athletes
      const allAssignments = await apiCall(
        () => eventAssignmentsApi.getAllForCoach(),
        "Loading all assignments for athlete list"
      );

      const uniqueAthletes = allAssignments.reduce((acc, assignment) => {
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
      console.error("Error loading initial data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadComparisonData = async () => {
    try {
      setLoading(true);

      const allData = [];

      // Load data for each selected meet
      for (const meet of selectedMeets) {
        const assignments = await apiCall(
          () => eventAssignmentsApi.getAllByMeet(meet.meet_rk),
          `Loading assignments for ${meet.meet_nm}`
        );

        allData.push({
          meet,
          assignments,
        });
      }

      generateComparisonChart(allData);
    } catch (error) {
      console.error("Error loading comparison data:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateComparisonChart = (allData) => {
    const datasets = [];
    const labels = allData.map((data) => data.meet.meet_nm);

    // Get all unique athlete-event combinations
    const athleteEventCombinations = new Set();

    allData.forEach((data) => {
      data.assignments.forEach((assignment) => {
        const key = `${assignment.prsn_rk}-${assignment.etyp_rk}`;
        athleteEventCombinations.add(key);
      });
    });

    // Create datasets for each athlete-event combination
    athleteEventCombinations.forEach((combination) => {
      const [athleteId, eventId] = combination.split("-");

      // Filter by selected athlete and event
      if (
        selectedAthlete !== "all" &&
        parseInt(athleteId) !== parseInt(selectedAthlete)
      ) {
        return;
      }
      if (
        selectedEvent !== "all" &&
        parseInt(eventId) !== parseInt(selectedEvent)
      ) {
        return;
      }

      const athlete = athletes.find((a) => a.prsn_rk === parseInt(athleteId));
      const eventType = eventTypes.find((e) => e.etyp_rk === parseInt(eventId));

      if (!athlete || !eventType) return;

      const dataPoints = allData.map((data) => {
        const assignment = data.assignments.find(
          (a) =>
            a.prsn_rk === parseInt(athleteId) && a.etyp_rk === parseInt(eventId)
        );

        if (!assignment) return null;

        const attempts = [
          assignment.attempt_one,
          assignment.attempt_two,
          assignment.attempt_three,
          assignment.attempt_four,
          assignment.attempt_five,
          assignment.attempt_six,
        ].filter((attempt) => attempt !== null && attempt !== undefined);

        return attempts.length > 0 ? Math.max(...attempts) : null;
      });

      // Only include datasets with at least 2 data points
      const validDataPoints = dataPoints.filter((point) => point !== null);
      if (validDataPoints.length < 2) return;

      const colorIndex = datasets.length;
      const color = `hsl(${colorIndex * 60}, 70%, 50%)`;

      datasets.push({
        label: `${athlete.athlete_first_nm} ${athlete.athlete_last_nm} - ${eventType.etyp_type_name}`,
        data: dataPoints,
        borderColor: color,
        backgroundColor: `hsla(${colorIndex * 60}, 70%, 50%, 0.1)`,
        tension: 0.1,
        pointRadius: 4,
        pointHoverRadius: 6,
        fill: false,
      });
    });

    setComparisonData({
      labels,
      datasets,
    });
  };

  const handleMeetToggle = (meet) => {
    setSelectedMeets((prev) => {
      const isSelected = prev.some((m) => m.meet_rk === meet.meet_rk);
      if (isSelected) {
        return prev.filter((m) => m.meet_rk !== meet.meet_rk);
      } else {
        return [...prev, meet];
      }
    });
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      title: {
        display: true,
        text: "Performance Comparison Across Meets",
      },
    },
    hover: {
      mode: "point",
      intersect: false,
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
          text: "Meet",
        },
      },
    },
  };

  if (loading && meets.length === 0) {
    return <LoadingMessage>Loading comparison data...</LoadingMessage>;
  }

  return (
    <ComparisonContainer>
      <ComparisonHeader>
        <h3>Meet Performance Comparison</h3>
        <p>Select multiple meets to compare athlete performance over time</p>
      </ComparisonHeader>

      <ControlsSection>
        <FilterRow>
          <FilterGroup>
            <label>Filter by Athlete:</label>
            <select
              value={selectedAthlete}
              onChange={(e) => setSelectedAthlete(e.target.value)}
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
            <label>Filter by Event:</label>
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
            >
              <option value="all">All Events</option>
              {eventTypes.map((eventType) => (
                <option key={eventType.etyp_rk} value={eventType.etyp_rk}>
                  {eventType.etyp_type_name}
                </option>
              ))}
            </select>
          </FilterGroup>
        </FilterRow>
      </ControlsSection>

      <MeetSelectionSection>
        <SectionTitle>Select Meets to Compare</SectionTitle>
        <MeetSelectionGrid>
          {meets.map((meet) => {
            const isSelected = selectedMeets.some(
              (m) => m.meet_rk === meet.meet_rk
            );
            return (
              <MeetSelectionCard
                key={meet.meet_rk}
                $selected={isSelected}
                onClick={() => handleMeetToggle(meet)}
              >
                <MeetCardHeader>
                  <MeetName>{meet.meet_nm}</MeetName>
                  <SelectionIndicator $selected={isSelected}>
                    {isSelected ? "✓" : "+"}
                  </SelectionIndicator>
                </MeetCardHeader>
                <MeetCardBody>
                  <MeetDate>
                    {new Date(meet.meet_start_dt).toLocaleDateString()}
                  </MeetDate>
                  {meet.meet_location && (
                    <MeetLocation>{meet.meet_location}</MeetLocation>
                  )}
                </MeetCardBody>
              </MeetSelectionCard>
            );
          })}
        </MeetSelectionGrid>
      </MeetSelectionSection>

      {selectedMeets.length > 0 && (
        <ChartSection>
          <SectionTitle>Performance Comparison Chart</SectionTitle>
          {loading ? (
            <LoadingMessage>Loading comparison chart...</LoadingMessage>
          ) : comparisonData && comparisonData.datasets.length > 0 ? (
            <ChartWrapper>
              <Line data={comparisonData} options={chartOptions} />
            </ChartWrapper>
          ) : (
            <NoDataMessage>
              No comparison data available for the selected criteria. Try
              selecting different meets, athletes, or events.
            </NoDataMessage>
          )}
        </ChartSection>
      )}

      {selectedMeets.length === 0 && (
        <EmptyState>
          <h4>No Meets Selected</h4>
          <p>
            Select at least two meets from the list above to start comparing
            performance.
          </p>
        </EmptyState>
      )}
    </ComparisonContainer>
  );
};

const ComparisonContainer = styled.div`
  width: 100%;
`;

const ComparisonHeader = styled.div`
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;

  h3 {
    margin: 0 0 10px 0;
    color: #333;
  }

  p {
    margin: 0;
    color: #666;
    font-style: italic;
  }
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

  label {
    font-weight: 500;
    color: #555;
    font-size: 14px;
  }

  select {
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
    min-width: 150px;
  }
`;

const MeetSelectionSection = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
`;

const MeetSelectionGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
`;

const MeetSelectionCard = styled.div`
  border: 2px solid ${(props) => (props.$selected ? "#007bff" : "#ddd")};
  border-radius: 8px;
  padding: 15px;
  background: ${(props) => (props.$selected ? "#f8f9ff" : "#f8f9fa")};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: #007bff;
    background: #f8f9ff;
  }
`;

const MeetCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const MeetName = styled.div`
  font-weight: bold;
  color: #333;
  font-size: 16px;
`;

const SelectionIndicator = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${(props) => (props.$selected ? "#007bff" : "#ddd")};
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
`;

const MeetCardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const MeetDate = styled.div`
  color: #666;
  font-size: 14px;
  font-weight: 500;
`;

const MeetLocation = styled.div`
  color: #666;
  font-size: 12px;
  font-style: italic;
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
  background: #f8f9fa;
  border-radius: 8px;
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #666;

  h4 {
    margin: 0 0 10px 0;
    color: #333;
  }

  p {
    margin: 0;
    font-style: italic;
  }
`;

export default MeetComparison;
