import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { meetsApi, eventAssignmentsApi } from "../../api";
import { useApi } from "../../hooks/useApi";
import dayjs from "dayjs";
import AssignEventToAthleteModal from "../../components/modals/AssignEventToAthleteModal";
import EditEventAssignmentModal from "../../components/modals/EditEventAssignmentModal";
import AddEventToMeetModal from "../../components/modals/AddEventToMeetModal";
import { useIsCoach } from "../../stores/userStore";
import Logger from "../../utils/logger";
import {
  StyledButton,
  CompWrap,
  EditButton,
  DeleteButton,
} from "../../styles/design-system";
import { useAsyncData } from "../../hooks/useAsyncData";

const MeetDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [meetEvents, setMeetEvents] = useState([]);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventAthletes, setEventAthletes] = useState([]);
  const [showEventAthletes, setShowEventAthletes] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [addEventModalOpen, setAddEventModalOpen] = useState(false);
  const { apiCall } = useApi();
  const isCoach = useIsCoach();

  const {
    data: meetDetails,
    loading,
    error,
    refetch: refetchMeet,
  } = useAsyncData(
    async () => {
      if (!id) return null;
      return await meetsApi.getById(id);
    },
    [id]
  );

  useEffect(() => {
    if (id) {
      loadMeetEvents();
    }
  }, [id]);

  const loadMeetEvents = async () => {
    try {
      const events = await meetsApi.getSchedule(id);
      setMeetEvents(events);
    } catch (error) {
      Logger.error("Error loading meet events:", error);
    }
  };

  const handleAssignAthlete = (event) => {
    setSelectedEvent(event);
    setAssignModalOpen(true);
  };

  const handleEventClick = async (event) => {
    try {
      const athletes = await eventAssignmentsApi.getByMeetAndEvent(
        id,
        event.etyp_rk
      );
      setEventAthletes(athletes);
      setSelectedEvent(event);
      setShowEventAthletes(true);
    } catch (error) {
      Logger.error("Error loading event athletes:", error);
    }
  };

  const handleEventAssignmentSuccess = async () => {
    loadMeetEvents();
    setAssignModalOpen(false);
    if (showEventAthletes && selectedEvent) {
      const updatedAthletes = await eventAssignmentsApi.getByMeetAndEvent(
        id,
        selectedEvent.etyp_rk
      );
      setEventAthletes(updatedAthletes);
    }
  };

  if (loading) {
    return (
      <PageContainer>
        <div>Loading meet details...</div>
      </PageContainer>
    );
  }

  if (error || !meetDetails) {
    return (
      <PageContainer>
        <div>Error loading meet: {error || "Meet not found"}</div>
        <StyledButton onClick={() => navigate("/meets-list")}>
          Back to Meets
        </StyledButton>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate("/meets-list")}>← Back</BackButton>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        >
          <h1>{meetDetails.meet_nm}</h1>
          <div style={{ display: "flex", gap: "10px" }}>
            <EditButton onClick={() => navigate(`/meets/${id}/edit`)}>
              Edit
            </EditButton>
          </div>
        </div>
      </Header>

      <Content>
        <Section>
          <h2>Basic Information</h2>
          <DetailRow>
            <Label>Name:</Label>
            <Value>{meetDetails.meet_nm}</Value>
          </DetailRow>
          <DetailRow>
            <Label>Date Range:</Label>
            <Value>
              {meetDetails.meet_start_dt && meetDetails.meet_end_dt ? (
                <>
                  {dayjs(meetDetails.meet_start_dt).format("MMMM D, YYYY")} -{" "}
                  {dayjs(meetDetails.meet_end_dt).format("MMMM D, YYYY")}
                </>
              ) : (
                dayjs(meetDetails.meet_dt).format("MMMM D, YYYY")
              )}
            </Value>
          </DetailRow>
          <DetailRow>
            <Label>Location:</Label>
            <Value>{meetDetails.meet_location || "N/A"}</Value>
          </DetailRow>
          {meetDetails.meet_description && (
            <DetailRow>
              <Label>Description:</Label>
              <Value>{meetDetails.meet_description}</Value>
            </DetailRow>
          )}
        </Section>

        <Section>
          <SectionHeader>
            <h2>Scheduled Events</h2>
            {isCoach && (
              <StyledButton
                onClick={() => setAddEventModalOpen(true)}
                style={{ backgroundColor: "#28a745" }}
              >
                + Add Event
              </StyledButton>
            )}
          </SectionHeader>
          {meetEvents.length === 0 ? (
            <p>No events scheduled for this meet.</p>
          ) : (
            <EventsList>
              {meetEvents
                .sort((a, b) => {
                  if (a.event_date !== b.event_date) {
                    return new Date(a.event_date) - new Date(b.event_date);
                  }
                  if (a.scheduled_time !== b.scheduled_time) {
                    return a.scheduled_time.localeCompare(b.scheduled_time);
                  }
                  return a.event_order - b.event_order;
                })
                .map((event, index) => (
                  <EventItem key={index} onClick={() => handleEventClick(event)}>
                    <EventHeader>
                      <EventName>{event.etyp_type_name}</EventName>
                      <EventTime>
                        {dayjs(event.event_date).format("MMM D")} at{" "}
                        {event.scheduled_time}
                      </EventTime>
                    </EventHeader>
                    <EventDetails>
                      <EventDetail>
                        <strong>Group:</strong> {event.event_group_name}
                      </EventDetail>
                      <EventDetail>
                        <strong>Athletes:</strong> {event.athlete_count || 0}
                      </EventDetail>
                      {isCoach && (
                        <StyledButton
                          $size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAssignAthlete(event);
                          }}
                        >
                          Assign Athlete
                        </StyledButton>
                      )}
                    </EventDetails>
                  </EventItem>
                ))}
            </EventsList>
          )}
        </Section>
      </Content>

      {showEventAthletes && selectedEvent && (
        <EventAthletesModal>
          <ModalHeader>
            <h3>Athletes in {selectedEvent.etyp_type_name}</h3>
            <CloseButton onClick={() => setShowEventAthletes(false)}>
              ×
            </CloseButton>
          </ModalHeader>
          <AthletesList>
            {eventAthletes.map((athlete) => (
              <AthleteItem key={athlete.prsn_rk}>
                <div>
                  {athlete.athlete_first_nm} {athlete.athlete_last_nm}
                </div>
                {isCoach && (
                  <div style={{ display: "flex", gap: "5px" }}>
                    <EditButton
                      $size="sm"
                      onClick={() => {
                        setSelectedAssignment(athlete);
                        setEditModalOpen(true);
                      }}
                    >
                      Edit
                    </EditButton>
                  </div>
                )}
              </AthleteItem>
            ))}
          </AthletesList>
        </EventAthletesModal>
      )}

      {assignModalOpen && selectedEvent && (
        <AssignEventToAthleteModal
          open={assignModalOpen}
          onClose={() => setAssignModalOpen(false)}
          onSuccess={handleEventAssignmentSuccess}
          selectedMeet={{ meet_rk: id }}
          selectedEvent={selectedEvent}
        />
      )}

      {editModalOpen && selectedAssignment && (
        <EditEventAssignmentModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setSelectedAssignment(null);
          }}
          assignment={selectedAssignment}
          onSuccess={handleEventAssignmentSuccess}
        />
      )}

      {addEventModalOpen && (
        <AddEventToMeetModal
          open={addEventModalOpen}
          onClose={() => setAddEventModalOpen(false)}
          meetId={id}
          onSuccess={() => {
            loadMeetEvents();
            setAddEventModalOpen(false);
          }}
        />
      )}
    </PageContainer>
  );
};

const PageContainer = styled(CompWrap)`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem 0;
  text-align: left;
  font-family: "Rubik", sans-serif;

  &:hover {
    text-decoration: underline;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const Section = styled.div`
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const DetailRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
`;

const Label = styled.div`
  font-weight: 600;
  min-width: 150px;
`;

const Value = styled.div``;

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const EventItem = styled.div`
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: #e9ecef;
  }
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const EventName = styled.div`
  font-weight: 600;
  font-size: 1.1rem;
`;

const EventTime = styled.div`
  color: #6c757d;
`;

const EventDetails = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

const EventDetail = styled.div`
  font-size: 0.9rem;
`;

const EventAthletesModal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6c757d;

  &:hover {
    color: #343a40;
  }
`;

const AthletesList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const AthleteItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: #f8f9fa;
  border-radius: 4px;
`;

export default MeetDetailPage;

