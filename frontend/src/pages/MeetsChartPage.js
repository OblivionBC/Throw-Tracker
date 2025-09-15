import React, { useState, useEffect } from "react";
import styled from "styled-components";
import MeetList from "../componenents/tables/MeetList";
import MeetPerformanceChart from "../componenents/MeetPerformanceChart";
import MeetAnalytics from "../componenents/MeetAnalytics";
import MeetComparison from "../componenents/MeetComparison";
import AllMeetsPerformanceChart from "../componenents/AllMeetsPerformanceChart";
import { meetsApi } from "../api";
import { useApi } from "../hooks/useApi";
import "typeface-rubik";
import ErrorBoundary from "../componenents/ErrorBoundary";
import {
  StyledButton,
  Title,
  FieldContainer,
  FieldLabel,
  FieldOutputContainer,
} from "../styles/design-system";

const MeetsChartPage = () => {
  const [meets, setMeets] = useState([]);
  const [selectedMeet, setSelectedMeet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedAthlete, setSelectedAthlete] = useState(null);
  const [activeTab, setActiveTab] = useState("charts"); // "charts", "analytics", "comparison", or "all-meets"
  const { apiCall } = useApi();

  useEffect(() => {
    loadMeets();
  }, []);

  const loadMeets = async () => {
    try {
      setLoading(true);
      const meetsData = await apiCall(
        () => meetsApi.getForCoachOrg(),
        "Loading meets for charting"
      );
      setMeets(meetsData);
    } catch (error) {
      console.error("Error loading meets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMeetSelect = (meet) => {
    setSelectedMeet(meet);
    setSelectedAthlete(null); // Reset athlete selection when meet changes
  };

  const handleAthleteSelect = (athlete) => {
    setSelectedAthlete(athlete);
  };

  const renderContent = () => {
    if (activeTab === "comparison") {
      return <MeetComparison />;
    }

    if (activeTab === "all-meets") {
      return <AllMeetsPerformanceChart />;
    }

    if (!selectedMeet) {
      return (
        <ChartPlaceholder>
          <h3>Select a Meet</h3>
          <p>
            Choose a meet from the list to view performance charts and analytics
          </p>
        </ChartPlaceholder>
      );
    }

    return (
      <>
        {activeTab === "charts" ? (
          <MeetPerformanceChart
            meetId={selectedMeet.meet_rk}
            athleteId={selectedAthlete?.prsn_rk}
          />
        ) : (
          <MeetAnalytics meetId={selectedMeet.meet_rk} />
        )}
      </>
    );
  };

  return (
    <Page>
      <LeftColumn>
        <ErrorBoundary>
          <ChartContainer>
            <ChartHeader>
              <Title>Meet Performance Analytics</Title>
              {selectedMeet && activeTab !== "comparison" && (
                <MeetInfo>
                  <strong>Selected Meet:</strong> {selectedMeet.meet_nm}
                  {selectedMeet.meet_location && (
                    <span> • {selectedMeet.meet_location}</span>
                  )}
                </MeetInfo>
              )}
            </ChartHeader>

            <TabContainer>
              <TabButton
                $active={activeTab === "charts"}
                onClick={() => setActiveTab("charts")}
              >
                📊 Performance Charts
              </TabButton>
              <TabButton
                $active={activeTab === "analytics"}
                onClick={() => setActiveTab("analytics")}
              >
                📈 Analytics & Insights
              </TabButton>
              <TabButton
                $active={activeTab === "comparison"}
                onClick={() => setActiveTab("comparison")}
              >
                🔄 Meet Comparison
              </TabButton>
              <TabButton
                $active={activeTab === "all-meets"}
                onClick={() => setActiveTab("all-meets")}
              >
                📈 All Meets Performance
              </TabButton>
            </TabContainer>

            <TabContent>{renderContent()}</TabContent>
          </ChartContainer>
        </ErrorBoundary>
      </LeftColumn>
      <RightColumn>
        <ErrorBoundary>
          <ControlsContainer>
            <SectionTitle>Meet Selection</SectionTitle>
            {loading ? (
              <div>Loading meets...</div>
            ) : (
              <MeetSelectionList>
                {meets.length === 0 ? (
                  <NoMeetsMessage>No meets available</NoMeetsMessage>
                ) : (
                  meets.map((meet) => (
                    <MeetSelectionItem
                      key={meet.meet_rk}
                      onClick={() => handleMeetSelect(meet)}
                      $selected={selectedMeet?.meet_rk === meet.meet_rk}
                      $disabled={
                        activeTab === "comparison" || activeTab === "all-meets"
                      }
                    >
                      <MeetName>{meet.meet_nm}</MeetName>
                      <MeetDetails>
                        <MeetDate>
                          {new Date(meet.meet_start_dt).toLocaleDateString()}
                        </MeetDate>
                        {meet.meet_location && (
                          <MeetLocation>{meet.meet_location}</MeetLocation>
                        )}
                      </MeetDetails>
                    </MeetSelectionItem>
                  ))
                )}
              </MeetSelectionList>
            )}
          </ControlsContainer>
        </ErrorBoundary>
      </RightColumn>
    </Page>
  );
};

const Page = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 90vh;
  font-family: "Rubik", sans-serif;
  padding: 20px;
`;

const LeftColumn = styled.div`
  display: flex;
  flex: 1;
  margin: 0;
  padding: 0;
  align-self: flex-start;
  flex-direction: column;
  height: 100%;
  max-width: 65%;
`;

const RightColumn = styled.div`
  display: flex;
  flex: 1;
  align-self: flex-start;
  flex-direction: column;
  height: 100%;
  margin-left: 20px;
  max-width: 35%;
`;

const ChartContainer = styled.div`
  width: 100%;
  height: 100%;
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow-y: auto;
`;

const ChartHeader = styled.div`
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #f0f0f0;
`;

const MeetInfo = styled.div`
  margin-top: 10px;
  color: #666;
  font-size: 14px;
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 20px;
  border-bottom: 2px solid #f0f0f0;
`;

const TabButton = styled.button`
  background: ${(props) => (props.$active ? "#007bff" : "transparent")};
  color: ${(props) => (props.$active ? "white" : "#666")};
  border: none;
  padding: 12px 20px;
  margin-right: 5px;
  border-radius: 8px 8px 0 0;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    background: ${(props) => (props.$active ? "#0056b3" : "#f8f9fa")};
    color: ${(props) => (props.$active ? "white" : "#333")};
  }
`;

const TabContent = styled.div`
  flex: 1;
`;

const ChartPlaceholder = styled.div`
  text-align: center;
  color: #666;
  padding: 60px 20px;

  h3 {
    margin-bottom: 10px;
    color: #333;
  }

  p {
    font-style: italic;
  }
`;

const ControlsContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  height: 100%;
  overflow-y: auto;
`;

const SectionTitle = styled.h3`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 5px;
`;

const MeetSelectionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const MeetSelectionItem = styled.div`
  border: 1px solid ${(props) => (props.$selected ? "#007bff" : "#ddd")};
  border-radius: 8px;
  padding: 15px;
  background: ${(props) => (props.$selected ? "#f8f9ff" : "#f8f9fa")};
  cursor: ${(props) => (props.$disabled ? "not-allowed" : "pointer")};
  transition: all 0.2s ease;
  opacity: ${(props) => (props.$disabled ? 0.6 : 1)};

  &:hover {
    border-color: ${(props) => (props.$disabled ? "#ddd" : "#007bff")};
    background: ${(props) => (props.$disabled ? "#f8f9fa" : "#f8f9ff")};
  }
`;

const MeetName = styled.div`
  font-weight: bold;
  color: #333;
  font-size: 16px;
  margin-bottom: 5px;
`;

const MeetDetails = styled.div`
  display: flex;
  gap: 15px;
  font-size: 14px;
  color: #666;
`;

const MeetDate = styled.span`
  font-weight: 500;
`;

const MeetLocation = styled.span`
  font-style: italic;
`;

const NoMeetsMessage = styled.div`
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
`;

export default MeetsChartPage;
