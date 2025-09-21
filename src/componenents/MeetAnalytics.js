import React, { useState, useEffect, useCallback } from "react";
import styled from "styled-components";
import { eventAssignmentsApi, eventTypesApi } from "../api";
import { useApi } from "../hooks/useApi";
import Logger from "../utils/logger";

const MeetAnalytics = ({ meetId }) => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedEvent, setSelectedEvent] = useState("all");
  const [eventTypes, setEventTypes] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const { apiCall } = useApi();

  const loadData = useCallback(async () => {
    try {
      setLoading(true);

      // Load event types
      const eventTypesResponse = await apiCall(
        () => eventTypesApi.getAll(),
        "Fetching event types for analytics"
      );
      setEventTypes(eventTypesResponse);

      // Load performance data
      const assignments = await apiCall(
        () => eventAssignmentsApi.getAllByMeet(meetId),
        `Fetching meet assignments for analytics`
      );

      setPerformanceData(assignments);
    } catch (error) {
      Logger.error("Error loading analytics data:", error);
    } finally {
      setLoading(false);
    }
  }, [meetId, apiCall]);

  const generateAnalytics = useCallback(() => {
    const filteredData =
      selectedEvent === "all"
        ? performanceData
        : performanceData.filter(
            (item) => item.etyp_rk === parseInt(selectedEvent)
          );

    const analyticsData = {
      totalAthletes: new Set(filteredData.map((d) => d.prsn_rk)).size,
      totalEvents: new Set(filteredData.map((d) => d.etyp_rk)).size,
      totalAssignments: filteredData.length,
      eventBreakdown: {},
      athleteRankings: {},
      performanceStats: {
        bestPerformances: [],
        averagePerformance: 0,
        totalAttempts: 0,
        validAttempts: 0,
      },
    };

    // Event breakdown
    filteredData.forEach((assignment) => {
      const eventType = eventTypes.find(
        (et) => et.etyp_rk === assignment.etyp_rk
      );
      const eventName = eventType
        ? eventType.etyp_type_name
        : `Event ${assignment.etyp_rk}`;

      if (!analyticsData.eventBreakdown[eventName]) {
        analyticsData.eventBreakdown[eventName] = {
          count: 0,
          bestPerformance: 0,
          averagePerformance: 0,
          attempts: [],
        };
      }

      const attempts = [
        assignment.attempt_one,
        assignment.attempt_two,
        assignment.attempt_three,
        assignment.attempt_four,
        assignment.attempt_five,
        assignment.attempt_six,
      ].filter((attempt) => attempt !== null && attempt !== undefined);

      const bestAttempt = attempts.length > 0 ? Math.max(...attempts) : 0;

      analyticsData.eventBreakdown[eventName].count++;
      analyticsData.eventBreakdown[eventName].attempts.push(...attempts);
      analyticsData.eventBreakdown[eventName].bestPerformance = Math.max(
        analyticsData.eventBreakdown[eventName].bestPerformance,
        bestAttempt
      );

      // Track best performances
      if (bestAttempt > 0) {
        analyticsData.performanceStats.bestPerformances.push({
          athlete: `${assignment.athlete_first_nm} ${assignment.athlete_last_nm}`,
          event: eventName,
          performance: bestAttempt,
          assignment,
        });
      }

      analyticsData.performanceStats.totalAttempts += 6;
      analyticsData.performanceStats.validAttempts += attempts.length;
    });

    // Calculate averages for each event
    Object.keys(analyticsData.eventBreakdown).forEach((eventName) => {
      const event = analyticsData.eventBreakdown[eventName];
      event.averagePerformance =
        event.attempts.length > 0
          ? event.attempts.reduce((a, b) => a + b, 0) / event.attempts.length
          : 0;
    });

    // Sort best performances
    analyticsData.performanceStats.bestPerformances.sort(
      (a, b) => b.performance - a.performance
    );

    // Calculate overall average
    const allAttempts = Object.values(analyticsData.eventBreakdown).flatMap(
      (event) => event.attempts
    );
    analyticsData.performanceStats.averagePerformance =
      allAttempts.length > 0
        ? allAttempts.reduce((a, b) => a + b, 0) / allAttempts.length
        : 0;

    setAnalytics(analyticsData);
  }, [performanceData, selectedEvent, eventTypes]);

  useEffect(() => {
    if (meetId) {
      loadData();
    }
  }, [meetId, loadData]);

  useEffect(() => {
    if (performanceData.length > 0) {
      generateAnalytics();
    }
  }, [performanceData, selectedEvent, generateAnalytics]);

  if (loading) {
    return <LoadingMessage>Loading analytics...</LoadingMessage>;
  }

  if (!analytics) {
    return <NoDataMessage>No analytics data available.</NoDataMessage>;
  }

  return (
    <AnalyticsContainer>
      <AnalyticsHeader>
        <h3>Meet Analytics</h3>
        <EventFilter>
          <label>Filter by Event:</label>
          <select
            value={selectedEvent}
            onChange={(e) => setSelectedEvent(e.target.value)}
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
        </EventFilter>
      </AnalyticsHeader>

      <StatsGrid>
        <StatCard>
          <StatTitle>Total Athletes</StatTitle>
          <StatValue>{analytics.totalAthletes}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Total Events</StatTitle>
          <StatValue>{analytics.totalEvents}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Total Assignments</StatTitle>
          <StatValue>{analytics.totalAssignments}</StatValue>
        </StatCard>
        <StatCard>
          <StatTitle>Valid Attempts</StatTitle>
          <StatValue>
            {analytics.performanceStats.validAttempts} /{" "}
            {analytics.performanceStats.totalAttempts}
          </StatValue>
        </StatCard>
      </StatsGrid>

      <AnalyticsSection>
        <SectionTitle>Event Breakdown</SectionTitle>
        <EventBreakdownGrid>
          {Object.entries(analytics.eventBreakdown).map(([eventName, data]) => (
            <EventCard key={eventName}>
              <EventCardHeader>
                <EventName>{eventName}</EventName>
                <EventCount>{data.count} athletes</EventCount>
              </EventCardHeader>
              <EventCardBody>
                <EventStat>
                  <StatLabel>Best Performance:</StatLabel>
                  <StatValue>{data.bestPerformance.toFixed(2)}</StatValue>
                </EventStat>
                <EventStat>
                  <StatLabel>Average Performance:</StatLabel>
                  <StatValue>{data.averagePerformance.toFixed(2)}</StatValue>
                </EventStat>
                <EventStat>
                  <StatLabel>Total Attempts:</StatLabel>
                  <StatValue>{data.attempts.length}</StatValue>
                </EventStat>
              </EventCardBody>
            </EventCard>
          ))}
        </EventBreakdownGrid>
      </AnalyticsSection>

      <AnalyticsSection>
        <SectionTitle>Top Performances</SectionTitle>
        <TopPerformancesList>
          {analytics.performanceStats.bestPerformances
            .slice(0, 10)
            .map((performance, index) => (
              <PerformanceItem
                key={`${performance.assignment.meet_rk}-${performance.assignment.prsn_rk}-${performance.assignment.etyp_rk}`}
              >
                <RankBadge>#{index + 1}</RankBadge>
                <PerformanceDetails>
                  <AthleteName>{performance.athlete}</AthleteName>
                  <EventName>{performance.event}</EventName>
                </PerformanceDetails>
                <PerformanceValue>
                  {performance.performance.toFixed(2)}
                </PerformanceValue>
              </PerformanceItem>
            ))}
        </TopPerformancesList>
      </AnalyticsSection>

      <AnalyticsSection>
        <SectionTitle>Performance Summary</SectionTitle>
        <SummaryStats>
          <SummaryStat>
            <StatLabel>Overall Average Performance:</StatLabel>
            <StatValue>
              {analytics.performanceStats.averagePerformance.toFixed(2)}
            </StatValue>
          </SummaryStat>
          <SummaryStat>
            <StatLabel>Success Rate:</StatLabel>
            <StatValue>
              {analytics.performanceStats.totalAttempts > 0
                ? (
                    (analytics.performanceStats.validAttempts /
                      analytics.performanceStats.totalAttempts) *
                    100
                  ).toFixed(1)
                : 0}
              %
            </StatValue>
          </SummaryStat>
        </SummaryStats>
      </AnalyticsSection>
    </AnalyticsContainer>
  );
};

const AnalyticsContainer = styled.div`
  width: 100%;
`;

const AnalyticsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;

  h3 {
    margin: 0;
    color: #333;
  }
`;

const EventFilter = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  label {
    font-weight: 500;
    color: #555;
  }

  select {
    padding: 6px 12px;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 14px;
  }
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
  margin-bottom: 30px;
`;

const StatCard = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const StatTitle = styled.div`
  font-size: 14px;
  color: #666;
  margin-bottom: 8px;
`;

const StatValue = styled.div`
  font-size: 24px;
  font-weight: bold;
  color: #333;
`;

const AnalyticsSection = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h4`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
  border-bottom: 1px solid #eee;
  padding-bottom: 5px;
`;

const EventBreakdownGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 15px;
`;

const EventCard = styled.div`
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  overflow: hidden;
`;

const EventCardHeader = styled.div`
  background: #f8f9fa;
  padding: 15px;
  border-bottom: 1px solid #eee;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const EventName = styled.div`
  font-weight: bold;
  color: #333;
  font-size: 16px;
`;

const EventCount = styled.div`
  color: #666;
  font-size: 14px;
`;

const EventCardBody = styled.div`
  padding: 15px;
`;

const EventStat = styled.div`
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
  font-size: 14px;
`;

const TopPerformancesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const PerformanceItem = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
`;

const RankBadge = styled.div`
  background: #007bff;
  color: white;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 12px;
`;

const PerformanceDetails = styled.div`
  flex: 1;
`;

const AthleteName = styled.div`
  font-weight: bold;
  color: #333;
  font-size: 14px;
`;

const PerformanceValue = styled.div`
  font-weight: bold;
  color: #007bff;
  font-size: 16px;
`;

const SummaryStats = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
`;

const SummaryStat = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
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

export default MeetAnalytics;
