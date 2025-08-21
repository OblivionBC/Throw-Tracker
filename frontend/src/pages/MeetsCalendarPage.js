import React, { useState, useEffect } from "react";
import styled from "styled-components";
import "typeface-rubik";
import ErrorBoundary from "../componenents/ErrorBoundary";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { meetsApi, eventAssignmentsApi } from "../api";
import dayjs from "dayjs";
import AssignEventToAthleteModal from "../componenents/modals/AssignEventToAthleteModal";
import EditEventAssignmentModal from "../componenents/modals/EditEventAssignmentModal";
import {
  StyledButton,
  Title,
  FieldContainer,
  FieldLabel,
  FieldOutputContainer,
} from "../styles/styles";

const localizer = momentLocalizer(moment);

const MeetsCalendarPage = () => {
  const [meets, setMeets] = useState([]);
  const [selectedMeet, setSelectedMeet] = useState(null);
  const [meetDetails, setMeetDetails] = useState(null);
  const [eventAssignments, setEventAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);

  useEffect(() => {
    loadMeets();
  }, []);

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
      const calendarEvents = meetsData.map((meet) => ({
        id: meet.meet_rk,
        title: meet.meet_nm,
        start: new Date(meet.meet_dt),
        end: new Date(meet.meet_dt),
        meet: meet, // Store the full meet object
        location: meet.meet_location,
      }));

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

  const handleAssignAthlete = () => {
    setAssignModalOpen(true);
  };

  const handleEditAssignment = (assignment) => {
    setSelectedAssignment(assignment);
    setEditModalOpen(true);
  };

  const handleEventAssignmentSuccess = () => {
    loadMeetDetails(); // Refresh the event assignments
    loadMeets(); // Refresh the calendar
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: "#007bff",
        borderRadius: "4px",
        opacity: 0.8,
        color: "white",
        border: "0px",
        display: "block",
        padding: "2px 5px",
      },
    };
  };

  if (loading) {
    return <div>Loading meets calendar...</div>;
  }

  return (
    <Page>
      <ErrorBoundary>
        <SplitLayout>
          <CalendarSection>
            <Calendar
              localizer={localizer}
              events={meets}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 600 }}
              onSelectEvent={handleEventSelect}
              eventPropGetter={eventStyleGetter}
              views={["month", "week", "day"]}
              defaultView="month"
              tooltipAccessor={(event) => `${event.title} - ${event.location}`}
            />
          </CalendarSection>

          <DetailsSection>
            {selectedMeet ? (
              <DetailsContent>
                <Title>Meet Details</Title>

                {detailsLoading ? (
                  <div>Loading meet details...</div>
                ) : (
                  <>
                    <FieldContainer>
                      <FieldLabel>Meet Name:</FieldLabel>
                      <FieldOutputContainer>
                        <strong>{selectedMeet.meet_nm}</strong>
                      </FieldOutputContainer>
                    </FieldContainer>

                    <FieldContainer>
                      <FieldLabel>Date:</FieldLabel>
                      <FieldOutputContainer>
                        {dayjs(selectedMeet.meet_dt).format("MMMM D, YYYY")}
                      </FieldOutputContainer>
                    </FieldContainer>

                    <FieldContainer>
                      <FieldLabel>Location:</FieldLabel>
                      <FieldOutputContainer>
                        {selectedMeet.meet_location}
                      </FieldOutputContainer>
                    </FieldContainer>

                    <FieldContainer>
                      <FieldLabel>Created By:</FieldLabel>
                      <FieldOutputContainer>
                        {selectedMeet.prsn_first_nm} {selectedMeet.prsn_last_nm}
                      </FieldOutputContainer>
                    </FieldContainer>

                    <FieldContainer>
                      <FieldLabel>Event Assignments:</FieldLabel>
                      <FieldOutputContainer>
                        {eventAssignments.length === 0 ? (
                          <p>No athletes assigned to events for this meet.</p>
                        ) : (
                                                     <div
                             style={{ maxHeight: "300px", overflowY: "auto" }}
                           >
                             {eventAssignments.map((assignment, index) => (
                               <div
                                 key={index}
                                 style={{
                                   padding: "10px",
                                   border: "1px solid #ddd",
                                   marginBottom: "10px",
                                   borderRadius: "4px",
                                   cursor: "pointer",
                                   transition: "background-color 0.2s",
                                 }}
                                 onClick={() => handleEditAssignment(assignment)}
                                 onMouseEnter={(e) => {
                                   e.target.style.backgroundColor = "#f0f0f0";
                                 }}
                                 onMouseLeave={(e) => {
                                   e.target.style.backgroundColor = "white";
                                 }}
                               >
                                 <strong>
                                   {assignment.athlete_first_nm}{" "}
                                   {assignment.athlete_last_nm}
                                 </strong>
                                 <br />
                                 Event: {assignment.event_name}
                                 {assignment.final_mark && (
                                   <>
                                     <br />
                                     Final Mark: {assignment.final_mark}
                                   </>
                                 )}
                                 {assignment.notes && (
                                   <>
                                     <br />
                                     Notes: {assignment.notes}
                                   </>
                                 )}
                                 <div style={{ 
                                   fontSize: "12px", 
                                   color: "#666", 
                                   marginTop: "5px",
                                   fontStyle: "italic"
                                 }}>
                                   Click to edit
                                 </div>
                               </div>
                             ))}
                           </div>
                        )}
                      </FieldOutputContainer>
                    </FieldContainer>

                    <div
                      style={{
                        display: "flex",
                        gap: "10px",
                        justifyContent: "center",
                        marginTop: "20px",
                      }}
                    >
                      <StyledButton
                        onClick={handleAssignAthlete}
                        style={{ backgroundColor: "#28a745" }}
                      >
                        Assign Athlete to Event
                      </StyledButton>
                    </div>
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
          onClose={() => setAssignModalOpen(false)}
          onSuccess={handleEventAssignmentSuccess}
          meet={selectedMeet}
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

export default MeetsCalendarPage;
