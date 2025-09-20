import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "typeface-rubik";
import ErrorBoundary from "../componenents/ErrorBoundary";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { meetsApi, eventAssignmentsApi } from "../api";
import { useApi } from "../hooks/useApi";
import dayjs from "dayjs";
import AssignEventToAthleteModal from "../componenents/modals/AssignEventToAthleteModal";
import EditEventAssignmentModal from "../componenents/modals/EditEventAssignmentModal";
import MeetCreationWizardModal from "../componenents/modals/MeetCreationWizardModal";
import AddEventToMeetModal from "../componenents/modals/AddEventToMeetModal";
import { useIsCoach } from "../stores/userStore";
import {
  StyledButton,
  Title
} from "../styles/design-system";

const localizer = momentLocalizer(moment);

const MeetsCalendarPage = () => {
  const [meets, setMeets] = useState([]);
  const [selectedMeet, setSelectedMeet] = useState(null);
  const [meetDetails, setMeetDetails] = useState(null);
  const [eventAssignments, setEventAssignments] = useState([]);
  const [meetEvents, setMeetEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [eventAthletes, setEventAthletes] = useState([]);
  const [showEventAthletes, setShowEventAthletes] = useState(false);
  const [wizardModalOpen, setWizardModalOpen] = useState(false);
  const [addEventModalOpen, setAddEventModalOpen] = useState(false);
  const [currentView, setCurrentView] = useState("month");
  const [currentDate, setCurrentDate] = useState(new Date("2025-08-22"));
  const { apiCall } = useApi();
  const isCoach = useIsCoach();

  useEffect(() => {
    loadMeets();
  });

  useEffect(() => {
    if (selectedMeet) {
      loadMeetDetails();
    }
  }, [selectedMeet]);

  const loadMeets = async () => {
    try {
      setLoading(true);
      const meetsData = await meetsApi.getForCoachOrg();

      // Transform meets data for calendar
      const calendarEvents = [];

      for (const meet of meetsData) {
        const startDate = new Date(meet.meet_start_dt || meet.meet_dt);
        const endDate = new Date(meet.meet_end_dt || meet.meet_dt);

        const currentDate = new Date(startDate);
        while (currentDate <= endDate) {
          calendarEvents.push({
            id: `${meet.meet_rk}-${currentDate.toISOString().split("T")[0]}`,
            title: meet.meet_nm,
            start: new Date(currentDate),
            end: new Date(currentDate),
            meet: meet,
            location: meet.meet_location,
            isMultiDay: startDate.getTime() !== endDate.getTime(),
            isMeetEvent: false,
          });
          currentDate.setDate(currentDate.getDate() + 1);
        }

        try {
          const meetEvents = await meetsApi.getSchedule(meet.meet_rk);

          meetEvents.forEach((event) => {
            const eventDate = new Date(event.event_date);

            let hours = 0,
              minutes = 0;
            if (event.scheduled_time) {
              if (typeof event.scheduled_time === "string") {
                const timeParts = event.scheduled_time.split(":");
                hours = parseInt(timeParts[0]) || 0;
                minutes = parseInt(timeParts[1]) || 0;
              } else if (typeof event.scheduled_time === "object") {
                hours = event.scheduled_time.hours || 0;
                minutes = event.scheduled_time.minutes || 0;
              }
            }

            const eventDateTime = new Date(eventDate);
            eventDateTime.setHours(hours, minutes, 0, 0);

            const endDateTime = new Date(eventDateTime);
            endDateTime.setHours(eventDateTime.getHours() + 1);

            const calendarEvent = {
              id: `${meet.meet_rk}-event-${event.meet_event_rk}`,
              title: `${event.etyp_type_name} - ${event.scheduled_time}`,
              start: eventDateTime,
              end: endDateTime,
              meet: meet,
              location: meet.meet_location,
              eventType: event.etyp_type_name,
              scheduledTime: event.scheduled_time,
              eventGroup: event.event_group_name,
              isMeetEvent: true,
            };

            calendarEvents.push(calendarEvent);
          });
        } catch (error) {
          console.error(
            `Error loading events for meet ${meet.meet_rk}:`,
            error
          );
        }
      }

      setMeets(calendarEvents);
    } catch (error) {
      console.error("Error loading meets:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadMeetDetails = async () => {
    if (!selectedMeet) return;

    setDetailsLoading(true);
    try {
      // Get meet details
      const details = await meetsApi.getById(selectedMeet.meet_rk);
      setMeetDetails(details);

      // Get meet events
      const events = await meetsApi.getSchedule(selectedMeet.meet_rk);
      setMeetEvents(events);

      // Get event assignments for this meet
      const assignments = await eventAssignmentsApi.getAllByMeet(
        selectedMeet.meet_rk
      );
      setEventAssignments(assignments);
    } catch (error) {
      console.error("Error loading meet details:", error);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleEventSelect = (event) => {
    setSelectedMeet(event.meet);
  };

  const handleAssignAthlete = (event) => {
    setSelectedEvent(event);
    setAssignModalOpen(true);
  };

  const handleEventClick = async (event) => {
    try {
      const athletes = await eventAssignmentsApi.getByMeetAndEvent(
        selectedMeet.meet_rk,
        event.etyp_rk
      );
      setEventAthletes(athletes);
      setSelectedEvent(event);
      setShowEventAthletes(true);
    } catch (error) {
      console.error("Error loading event athletes:", error);
    }
  };

  const handleCloseEventAthletes = () => {
    setShowEventAthletes(false);
    setEventAthletes([]);
  };

  const handleRemoveAthlete = async (athlete) => {
    if (!selectedEvent || !selectedMeet) return;

    try {
      await apiCall(
        () =>
          eventAssignmentsApi.delete(
            selectedMeet.meet_rk,
            athlete.prsn_rk,
            selectedEvent.etyp_rk
          ),
        `Removing ${athlete.athlete_first_nm} ${athlete.athlete_last_nm} from ${selectedEvent.etyp_type_name}`
      );

      // Refresh the event athletes list
      const updatedAthletes = await apiCall(
        () =>
          eventAssignmentsApi.getByMeetAndEvent(
            selectedMeet.meet_rk,
            selectedEvent.etyp_rk
          ),
        "Refreshing event athletes after removal"
      );
      setEventAthletes(updatedAthletes);

      // Also refresh the meet details to update athlete count
      loadMeetDetails();
    } catch (error) {
      console.error("Error removing athlete from event:", error);
    }
  };

  const handleEditAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setEditModalOpen(true);
  };

  const handleEditAthlete = (athlete) => {
    setSelectedAssignment(athlete);
    setEditModalOpen(true);
  };

  const handleEventAssignmentSuccess = async () => {
    loadMeetDetails(); // Refresh the event assignments
    loadMeets(); // Refresh the calendar

    // If we have event athletes open, refresh that list too
    if (showEventAthletes && selectedEvent && selectedMeet) {
      try {
        const updatedAthletes = await apiCall(
          () =>
            eventAssignmentsApi.getByMeetAndEvent(
              selectedMeet.meet_rk,
              selectedEvent.etyp_rk
            ),
          "Refreshing event athletes after assignment update"
        );
        setEventAthletes(updatedAthletes);
      } catch (error) {
        console.error("Error refreshing event athletes:", error);
      }
    }
  };

  const handleCreateMeetSuccess = () => {
    loadMeets(); // Refresh the calendar with the new meet
  };

  // Color palette for meet rotation
  const meetColors = [
    "#007bff", // Blue
    "#28a745", // Green
    "#ffc107", // Yellow
    "#dc3545", // Red
    "#6f42c1", // Purple
    "#fd7e14", // Orange
    "#20c997", // Teal
    "#e83e8c", // Pink
    "#6c757d", // Gray
    "#17a2b8", // Cyan
  ];

  const getMeetColor = (meetId) => {
    return meetColors[meetId % meetColors.length];
  };

  const getFilteredEvents = () => {
    const filteredEvents =
      currentView === "month"
        ? meets.filter((event) => !event.isMeetEvent)
        : meets.filter((event) => event.isMeetEvent);

    return filteredEvents;
  };

  const eventStyleGetter = (event) => {
    const meetColor = getMeetColor(event.meet.meet_rk);
    return {
      style: {
        backgroundColor: meetColor,
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
        padding: "2px 5px",
        fontSize: event.isMeetEvent ? "12px" : "14px",
        fontWeight: event.isMeetEvent ? "normal" : "bold",
      },
    };
  };

  if (loading) {
    return <div>Loading meets calendar...</div>;
  }

  return (
    <Page>
      <ErrorBoundary>
        <PageHeader>
          <Title>Meets Calendar</Title>
          <StyledButton
            onClick={() => setWizardModalOpen(true)}
            style={{ backgroundColor: "#28a745" }}
          >
            Create New Meet
          </StyledButton>
        </PageHeader>

        <SplitLayout>
          <CalendarSection>
            <Calendar
              localizer={localizer}
              events={getFilteredEvents()}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              onSelectEvent={handleEventSelect}
              eventPropGetter={eventStyleGetter}
              views={["month", "week", "day"]}
              defaultView="month"
              onView={(view) => setCurrentView(view)}
              onNavigate={(newDate) => setCurrentDate(newDate)}
              date={currentDate}
              tooltipAccessor={(event) => {
                if (event.isMeetEvent) {
                  return `${event.title} - ${event.location} - ${event.eventGroup}`;
                }
                return `${event.title} - ${event.location}`;
              }}
            />
          </CalendarSection>

          <DetailsSection>
            {selectedMeet ? (
              <DetailsContent>
                {detailsLoading ? (
                  <div>Loading meet details...</div>
                ) : (
                  <>
                    <DetailsSection>
                      <SectionTitle>Basic Information</SectionTitle>

                      <DetailRow>
                        <DetailLabel>Name:</DetailLabel>
                        <DetailValue>{selectedMeet.meet_nm}</DetailValue>
                      </DetailRow>

                      <DetailRow>
                        <DetailLabel>Date Range:</DetailLabel>
                        <DetailValue>
                          {selectedMeet.meet_start_dt &&
                          selectedMeet.meet_end_dt ? (
                            <>
                              {dayjs(selectedMeet.meet_start_dt).format(
                                "MMMM D, YYYY"
                              )}
                              {selectedMeet.meet_start_dt !==
                                selectedMeet.meet_end_dt && (
                                <>
                                  {" "}
                                  -{" "}
                                  {dayjs(selectedMeet.meet_end_dt).format(
                                    "MMMM D, YYYY"
                                  )}
                                </>
                              )}
                            </>
                          ) : (
                            dayjs(selectedMeet.meet_dt).format("MMMM D, YYYY")
                          )}
                        </DetailValue>
                      </DetailRow>

                      <DetailRow>
                        <DetailLabel>Location:</DetailLabel>
                        <DetailValue>{selectedMeet.meet_location}</DetailValue>
                      </DetailRow>

                      {selectedMeet.meet_description && (
                        <DetailRow>
                          <DetailLabel>Description:</DetailLabel>
                          <DetailValue>
                            {selectedMeet.meet_description}
                          </DetailValue>
                        </DetailRow>
                      )}

                      <DetailRow>
                        <DetailLabel>Created By:</DetailLabel>
                        <DetailValue>
                          {selectedMeet.prsn_first_nm}{" "}
                          {selectedMeet.prsn_last_nm}
                        </DetailValue>
                      </DetailRow>
                    </DetailsSection>

                    <DetailsSection>
                      <SectionTitle>
                        Scheduled Events
                        {isCoach && (
                          <AddEventButton
                            onClick={() => setAddEventModalOpen(true)}
                            title="Add event to this meet"
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
                                  new Date(a.event_date) -
                                  new Date(b.event_date)
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
                                    <strong>Group:</strong>{" "}
                                    {event.event_group_name}
                                  </EventDetail>
                                  <EventDetail>
                                    <strong>Athletes:</strong>{" "}
                                    {event.athlete_count || 0}
                                  </EventDetail>
                                  <EventDetail>
                                    <strong>Order:</strong> {event.event_order}
                                  </EventDetail>
                                  <EventDetail>
                                    <AssignButton
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAssignAthlete(event);
                                      }}
                                    >
                                      Assign Athlete
                                    </AssignButton>
                                  </EventDetail>
                                </EventDetails>
                              </EventItem>
                            ))}
                        </EventsList>
                      )}
                    </DetailsSection>

                    <DetailsSection>
                      <SectionTitle>Athletes Attending Meet</SectionTitle>

                      {eventAssignments.length === 0 ? (
                        <NoEventsMessage>
                          No athletes assigned to events for this meet.
                        </NoEventsMessage>
                      ) : (
                        <EventsList>
                          {Array.from(
                            new Set(
                              eventAssignments.map(
                                (assignment) =>
                                  `${assignment.athlete_first_nm} ${assignment.athlete_last_nm}`
                              )
                            )
                          ).map((athleteName, index) => (
                            <EventItem key={index}>
                              <EventHeader>
                                <EventName>{athleteName}</EventName>
                              </EventHeader>
                              <EventDetails>
                                <EventDetail>
                                  <strong>Events:</strong>{" "}
                                  {eventAssignments
                                    .filter(
                                      (assignment) =>
                                        `${assignment.athlete_first_nm} ${assignment.athlete_last_nm}` ===
                                        athleteName
                                    )
                                    .map((assignment) => assignment.event_name)
                                    .join(", ")}
                                </EventDetail>
                              </EventDetails>
                            </EventItem>
                          ))}
                        </EventsList>
                      )}
                    </DetailsSection>

                    <ButtonContainer></ButtonContainer>
                  </>
                )}
              </DetailsContent>
            ) : (
              <NoSelectionMessage>
                <h3>Select a meet from the calendar to view details</h3>
                <p>
                  Click on any meet event to see its information and manage
                  assignments.
                </p>
              </NoSelectionMessage>
            )}
          </DetailsSection>
        </SplitLayout>

        <AssignEventToAthleteModal
          open={assignModalOpen}
          onClose={() => {
            setAssignModalOpen(false);
            setSelectedEvent(null);
          }}
          onSuccess={handleEventAssignmentSuccess}
          meet={selectedMeet}
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
          meet={selectedMeet}
        />
        <MeetCreationWizardModal
          open={wizardModalOpen}
          onClose={() => setWizardModalOpen(false)}
          onSuccess={handleCreateMeetSuccess}
        />

        <AddEventToMeetModal
          open={addEventModalOpen}
          onClose={() => setAddEventModalOpen(false)}
          onSuccess={loadMeetDetails}
          meet={selectedMeet}
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
      </ErrorBoundary>
    </Page>
  );
};

const Page = styled.div`
  display: flex;
  background: white;
  flex-direction: column;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 20px;
  min-height: 100vh;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1400px;
  margin-bottom: 20px;
`;

const SplitLayout = styled.div`
  display: flex;
  width: 100%;
  max-width: 1400px;
  gap: 30px;
  height: 100%;
`;

const CalendarSection = styled.div`
  flex: 1;
  min-width: 0;
  position: relative;
  z-index: 1;

  .rbc-calendar {
    font-family: "Rubik", sans-serif;
    z-index: 1;
  }

  .rbc-header {
    background-color: #f8f9fa;
    font-weight: bold;
    padding: 10px;
  }

  .rbc-event {
    cursor: pointer;
    transition: opacity 0.2s;
  }

  .rbc-event:hover {
    opacity: 1 !important;
  }

  .rbc-today {
    background-color: #e3f2fd;
  }

  /* Ensure calendar popups don't interfere with modals */
  .rbc-popup {
    z-index: 1000;
  }

  .rbc-overlay {
    z-index: 1000;
  }
`;

const DetailsSection = styled.div`
  flex: 1;
  min-width: 0;
  background: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  overflow-y: auto;
  max-height: 600px;
`;

const DetailsContent = styled.div`
  width: 100%;
`;

const NoSelectionMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  color: #666;

  h3 {
    margin-bottom: 10px;
    color: #333;
  }

  p {
    margin: 0;
    font-size: 14px;
  }
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

const AssignButton = styled.button`
  padding: 4px 8px;
  background-color: #28a745;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #218838;
  }
`;

const RemoveButton = styled.button`
  padding: 2px 6px;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: background-color 0.2s;

  &:hover {
    background-color: #c82333;
  }
`;

const EditButton = styled.button`
  padding: 2px 6px;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: normal;
  transition: background-color 0.2s;
  margin-right: 5px;

  &:hover {
    background-color: #0056b3;
  }
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
          <CloseButton onClick={onClose}>&times;</CloseButton>
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
                      <RemoveButton
                        onClick={() => onRemoveAthlete(athlete)}
                        title={`Remove ${athlete.athlete_first_nm} ${athlete.athlete_last_nm} from ${eventName}`}
                      >
                        ×
                      </RemoveButton>
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
  max-width: 500px;
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

  h3 {
    margin: 0;
    color: #333;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #666;

  &:hover {
    color: #333;
  }
`;

const ModalBody = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

export default MeetsCalendarPage;
