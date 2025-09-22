import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { meetsApi, eventAssignmentsApi } from "../../api";
import { useApi } from "../../hooks/useApi";
import dayjs from "dayjs";
import AssignEventToAthleteModal from "./AssignEventToAthleteModal";
import EditEventAssignmentModal from "./EditEventAssignmentModal";
import AddEventToMeetModal from "./AddEventToMeetModal";
import { useIsCoach } from "../../stores/userStore";
import Logger from "../../utils/logger";
import {
  StyledButton,
  CloseButton,
  EditButton,
  DeleteButton,
} from "../../styles/design-system";

const ViewMeetModal = ({ open, onClose, meet }) => {
  const [meetDetails, setMeetDetails] = useState(null);
  const [meetEvents, setMeetEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [eventAthletes, setEventAthletes] = useState([]);
  const [showEventAthletes, setShowEventAthletes] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [addEventModalOpen, setAddEventModalOpen] = useState(false);
  const { apiCall } = useApi();
  const isCoach = useIsCoach();

  useEffect(() => {
    if (meet && open) {
      loadMeetDetails();
    }
  }, [meet, open]);

  const loadMeetDetails = async () => {
    if (!meet) return;

    setLoading(true);
    try {
      // Get detailed meet information
      const details = await meetsApi.getById(meet.meet_rk);
      setMeetDetails(details);

      // Get meet events
      const events = await meetsApi.getSchedule(meet.meet_rk);
      setMeetEvents(events);
    } catch (error) {
      Logger.error("Error loading meet details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setMeetDetails(null);
    setMeetEvents([]);
    onClose();
  };

  const handleAssignAthlete = (event) => {
    setSelectedEvent(event);
    setAssignModalOpen(true);
  };

  const handleEventClick = async (event) => {
    try {
      const athletes = await eventAssignmentsApi.getByMeetAndEvent(
        meet.meet_rk,
        event.etyp_rk
      );
      setEventAthletes(athletes);
      setSelectedEvent(event);
      setShowEventAthletes(true);
    } catch (error) {
      Logger.error("Error loading event athletes:", error);
    }
  };

  const handleCloseEventAthletes = () => {
    setShowEventAthletes(false);
    setEventAthletes([]);
  };

  const handleRemoveAthlete = async (athlete) => {
    if (!selectedEvent || !meet) return;

    try {
      await apiCall(
        () =>
          eventAssignmentsApi.delete(
            meet.meet_rk,
            athlete.prsn_rk,
            selectedEvent.etyp_rk
          ),
        `Removing ${athlete.athlete_first_nm} ${athlete.athlete_last_nm} from ${selectedEvent.etyp_type_name}`
      );

      // Refresh the event athletes list
      const updatedAthletes = await apiCall(
        () =>
          eventAssignmentsApi.getByMeetAndEvent(
            meet.meet_rk,
            selectedEvent.etyp_rk
          ),
        "Refreshing event athletes after removal"
      );
      setEventAthletes(updatedAthletes);

      // Also refresh the meet events to update athlete count
      const events = await apiCall(
        () => meetsApi.getSchedule(meet.meet_rk),
        "Refreshing meet events after athlete removal"
      );
      setMeetEvents(events);
    } catch (error) {
      Logger.error("Error removing athlete from event:", error);
    }
  };

  const handleEventAssignmentSuccess = async () => {
    loadMeetDetails(); // Refresh the meet details
    setAssignModalOpen(false);

    // If we have event athletes open, refresh that list too
    if (showEventAthletes && selectedEvent && meet) {
      try {
        const updatedAthletes = await apiCall(
          () =>
            eventAssignmentsApi.getByMeetAndEvent(
              meet.meet_rk,
              selectedEvent.etyp_rk
            ),
          "Refreshing event athletes after assignment update"
        );
        setEventAthletes(updatedAthletes);
      } catch (error) {
        Logger.error("Error refreshing event athletes:", error);
      }
    }
  };

  const handleEditAthlete = (athlete) => {
    setSelectedAssignment(athlete);
    setEditModalOpen(true);
  };

  if (!open) return null;

  return (
    <>
      <ModalOverlay>
        <ModalContent>
          <ModalHeader>
            <h2>Meet Details</h2>
            <CloseButton onClick={handleClose}>&times;</CloseButton>
          </ModalHeader>

          <ModalBody>
            {loading ? (
              <div>Loading meet details...</div>
            ) : (
              <>
                {meetDetails && (
                  <DetailsSection>
                    <SectionTitle>Basic Information</SectionTitle>

                    <DetailRow>
                      <DetailLabel>Name:</DetailLabel>
                      <DetailValue>{meetDetails.meet_nm}</DetailValue>
                    </DetailRow>

                    <DetailRow>
                      <DetailLabel>Date Range:</DetailLabel>
                      <DetailValue>
                        {meetDetails.meet_start_dt &&
                        meetDetails.meet_end_dt ? (
                          <>
                            {dayjs(meetDetails.meet_start_dt).format(
                              "MMMM D, YYYY"
                            )}
                            {meetDetails.meet_start_dt !==
                              meetDetails.meet_end_dt && (
                              <>
                                {" "}
                                -{" "}
                                {dayjs(meetDetails.meet_end_dt).format(
                                  "MMMM D, YYYY"
                                )}
                              </>
                            )}
                          </>
                        ) : (
                          dayjs(meetDetails.meet_dt).format("MMMM D, YYYY")
                        )}
                      </DetailValue>
                    </DetailRow>

                    <DetailRow>
                      <DetailLabel>Location:</DetailLabel>
                      <DetailValue>{meetDetails.meet_location}</DetailValue>
                    </DetailRow>

                    {meetDetails.meet_description && (
                      <DetailRow>
                        <DetailLabel>Description:</DetailLabel>
                        <DetailValue>
                          {meetDetails.meet_description}
                        </DetailValue>
                      </DetailRow>
                    )}

                    <DetailRow>
                      <DetailLabel>Created By:</DetailLabel>
                      <DetailValue>
                        {meetDetails.prsn_first_nm} {meetDetails.prsn_last_nm}
                      </DetailValue>
                    </DetailRow>
                  </DetailsSection>
                )}

                <DetailsSection>
                  <SectionTitle>
                    Scheduled Events
                    {isCoach && (
                      <AddEventButton
                        onClick={() => setAddEventModalOpen(true)}
                        style={{ marginLeft: "10px" }}
                      >
                        + Add Event
                      </AddEventButton>
                    )}
                  </SectionTitle>

                  {meetEvents.length === 0 ? (
                    <NoEventsMessage>
                      No events scheduled for this meet.
                      {isCoach && (
                        <div style={{ marginTop: "10px" }}>
                          <StyledButton
                            onClick={() => setAddEventModalOpen(true)}
                            style={{ backgroundColor: "#28a745" }}
                          >
                            Add First Event
                          </StyledButton>
                        </div>
                      )}
                    </NoEventsMessage>
                  ) : (
                    <EventsList>
                      {meetEvents
                        .sort((a, b) => {
                          // Sort by event date, then by scheduled time, then by event order
                          if (a.event_date !== b.event_date) {
                            return (
                              new Date(a.event_date) - new Date(b.event_date)
                            );
                          }
                          if (a.scheduled_time !== b.scheduled_time) {
                            return a.scheduled_time.localeCompare(
                              b.scheduled_time
                            );
                          }
                          return a.event_order - b.event_order;
                        })
                        .map((event, index) => (
                          <EventItem
                            key={index}
                            onClick={() => handleEventClick(event)}
                            style={{ cursor: "pointer" }}
                          >
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
                                <strong>Athletes:</strong>{" "}
                                {event.athlete_count || 0}
                              </EventDetail>
                              <EventDetail>
                                <strong>Order:</strong> {event.event_order}
                              </EventDetail>
                              <EventDetail>
                                <StyledButton
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAssignAthlete(event);
                                  }}
                                >
                                  Assign Athlete
                                </StyledButton>
                              </EventDetail>
                            </EventDetails>
                          </EventItem>
                        ))}
                    </EventsList>
                  )}
                </DetailsSection>

                <ButtonContainer>
                  <StyledButton onClick={handleClose}>Close</StyledButton>
                </ButtonContainer>
              </>
            )}
          </ModalBody>
        </ModalContent>
      </ModalOverlay>

      <AssignEventToAthleteModal
        open={assignModalOpen}
        onClose={() => {
          setAssignModalOpen(false);
          setSelectedEvent(null);
        }}
        onSuccess={handleEventAssignmentSuccess}
        meet={meet}
        selectedEvent={selectedEvent}
      />

      <EditEventAssignmentModal
        open={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedAssignment(null);
        }}
        onSuccess={handleEventAssignmentSuccess}
        assignment={selectedAssignment}
        meet={meet}
      />

      <AddEventToMeetModal
        open={addEventModalOpen}
        onClose={() => setAddEventModalOpen(false)}
        onSuccess={loadMeetDetails}
        meet={meet}
      />

      {showEventAthletes && (
        <EventAthletesModal
          open={showEventAthletes}
          onClose={handleCloseEventAthletes}
          athletes={eventAthletes}
          eventName={selectedEvent?.etyp_type_name}
          onRemoveAthlete={handleRemoveAthlete}
          onEditAthlete={handleEditAthlete}
        />
      )}
    </>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 10px;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  border-bottom: 1px solid #eee;

  h2 {
    margin: 0;
    color: #333;
  }
`;

const ModalBody = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const DetailsSection = styled.div`
  margin-bottom: 25px;
`;

const SectionTitle = styled.h3`
  margin: 0 0 15px 0;
  color: #333;
  font-size: 18px;
  border-bottom: 2px solid #007bff;
  padding-bottom: 5px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const AddEventButton = styled.button`
  background: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background: #218838;
  }
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 10px;
  align-items: flex-start;
`;

const DetailLabel = styled.div`
  font-weight: bold;
  color: #555;
  min-width: 120px;
  margin-right: 10px;
`;

const DetailValue = styled.div`
  color: #333;
  flex: 1;
`;

const EventsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EventItem = styled.div`
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  background: #f8f9fa;
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
`;

const EventName = styled.div`
  font-weight: bold;
  color: #333;
  font-size: 16px;
`;

const EventTime = styled.div`
  background: #007bff;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: bold;
`;

const EventDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
`;

const EventDetail = styled.div`
  font-size: 14px;
  color: #666;
`;

const NoEventsMessage = styled.div`
  text-align: center;
  color: #666;
  font-style: italic;
  padding: 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 20px;
`;

const EventAthletesModal = ({
  open,
  onClose,
  athletes,
  eventName,
  onRemoveAthlete,
  onEditAthlete,
}) => {
  if (!open) return null;

  return (
    <ModalOverlay>
      <ModalContent>
        <ModalHeader>
          <h3>Athletes in {eventName}</h3>
          <CloseButton onClick={onClose}>Close</CloseButton>
        </ModalHeader>
        <ModalBody>
          {athletes.length === 0 ? (
            <NoEventsMessage>
              No athletes assigned to this event.
            </NoEventsMessage>
          ) : (
            <EventsList>
              {athletes.map((athlete, index) => (
                <EventItem key={index}>
                  <EventHeader>
                    <EventName>
                      {athlete.athlete_first_nm} {athlete.athlete_last_nm}
                    </EventName>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <EditButton
                        onClick={() => onEditAthlete(athlete)}
                        title={`Edit ${athlete.athlete_first_nm} ${athlete.athlete_last_nm} assignment`}
                      >
                        Edit
                      </EditButton>
                      <DeleteButton
                        onClick={() => onRemoveAthlete(athlete)}
                        title={`Remove ${athlete.athlete_first_nm} ${athlete.athlete_last_nm} from ${eventName}`}
                      >
                        ×
                      </DeleteButton>
                    </div>
                  </EventHeader>
                  <EventDetails>
                    {athlete.final_mark && (
                      <EventDetail>
                        <strong>Final Mark:</strong> {athlete.final_mark}
                      </EventDetail>
                    )}
                    {athlete.notes && (
                      <EventDetail>
                        <strong>Notes:</strong> {athlete.notes}
                      </EventDetail>
                    )}
                  </EventDetails>
                </EventItem>
              ))}
            </EventsList>
          )}
        </ModalBody>
      </ModalContent>
    </ModalOverlay>
  );
};

export default ViewMeetModal;
