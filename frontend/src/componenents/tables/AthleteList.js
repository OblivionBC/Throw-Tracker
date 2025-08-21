import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  TableWrap,
  Title,
  CompWrap,
  AddButton,
  RowDiv,
} from "../../styles/styles.js";
import AthleteDetails from "../modals/AthleteDetails";
import ConfirmAssignAthleteModal from "../modals/ConfirmAssignAthleteModal";
import { personsApi, athleteEventAssignmentsApi } from "../../api";
import useUserStore, { useUser } from "../../stores/userStore";
import {
  getPaginationNumber,
  getContainerHeight,
} from "../../utils/tableUtils";
import styled from "styled-components";

const TableStyles = {
  pagination: {
    style: {
      minHeight: "30px",
      padding: "0 0px",
      margin: "0 0px",
    },
    pageButtonsStyle: {
      minWidth: "30px",
      height: "10px",
      margin: "0 0px",
      padding: "0 0px",
    },
  },
};

const AthleteList = ({ paginationNum }) => {
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(600);
  const [excrData, setExcrData] = useState([]);
  const [programOpen, setProgramOpen] = useState(false);
  const [selectedPrsn, setSelectedPrsn] = useState();
  const [filter, setFilter] = useState("assigned");
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [athleteToAssign, setAthleteToAssign] = useState(null);
  const user = useUser();

  const getAthleteData = async () => {
    try {
      console.log("Getting athlete data for filter:", filter);
      let athletes;
      if (filter === "assigned") {
        console.log("Fetching assigned athletes...");
        athletes = await personsApi.getAthletesForCoach();
        console.log("Assigned athletes result:", athletes);
      } else {
        console.log("Fetching unassigned athletes...");
        athletes = await personsApi.getUnassignedAthletesInOrg();
        console.log("Unassigned athletes result:", athletes);
      }
      // Fetch event assignments for each athlete
      const athletesWithEvents = await Promise.all(
        athletes.map(async (athlete) => {
          try {
            const events = await athleteEventAssignmentsApi.getByAthlete(
              athlete.prsn_rk
            );
            return {
              ...athlete,
              events: events.slice(0, 2), // Limit to 2 events
            };
          } catch (error) {
            console.error(
              `Error fetching events for athlete ${athlete.prsn_rk}:`,
              error
            );
            return {
              ...athlete,
              events: [],
            };
          }
        })
      );
      console.log("Final athletes with events:", athletesWithEvents);
      setExcrData(athletesWithEvents);
    } catch (error) {
      console.error("Error in getAthleteData:", error.message);
    }
  };

  // Update container height on mount and resize
  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  useEffect(() => {
    getAthleteData();
    // eslint-disable-next-line
  }, [filter]);

  const columns = [
    {
      name: "Name",
      selector: (row) => row.prsn_first_nm + " " + row.prsn_last_nm,
      sortable: true,
    },
    {
      name: "Organization",
      selector: (row) => row.org_name,
      sortable: true,
    },
    {
      name: "Events",
      selector: (row) => {
        if (!row.events || row.events.length === 0) {
          return "No events assigned";
        }
        return row.events.map((event) => event.etyp_type_name).join(", ");
      },
      sortable: false,
    },
    {
      name: "Email",
      selector: (row) => row.prsn_email,
      sortable: true,
    },
    {
      cell: (row) =>
        filter === "unassigned" ? (
          <AddButton
            onClick={() => {
              setAthleteToAssign(row);
              setAssignModalOpen(true);
            }}
            style={{ backgroundColor: "#28a745" }}
          >
            Assign To Me
          </AddButton>
        ) : (
          <AddButton
            onClick={() => {
              setSelectedPrsn(row);
              setProgramOpen(true);
            }}
          >
            Details
          </AddButton>
        ),
    },
  ];

  // Calculate optimal pagination
  const optimalPagination = getPaginationNumber(paginationNum, containerHeight);

  return (
    <CompWrap ref={containerRef}>
      <AthleteDetails
        athlete={selectedPrsn}
        open={programOpen}
        onClose={() => setProgramOpen(false)}
        refresh={getAthleteData}
      />
      <ConfirmAssignAthleteModal
        athlete={athleteToAssign}
        open={assignModalOpen}
        onClose={() => {
          setAssignModalOpen(false);
          setAthleteToAssign(null);
        }}
        refresh={getAthleteData}
      />
      <RowDiv>
        <Title>Athletes</Title>
        <div style={{ marginLeft: "auto" }}>
          <label>
            <b>Show: </b>
            <select value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="assigned">Assigned Athletes</option>
              <option value="unassigned">Unassigned Athletes</option>
            </select>
          </label>
        </div>
      </RowDiv>

      <TableWrap>
        <Table
          columns={columns}
          data={excrData}
          fixedHeader
          pagination
          paginationPerPage={optimalPagination}
          paginationComponentOptions={{
            rowsPerPageText: "Rows per page:",
            rangeSeparatorText: "of",
            selectAllRowsItem: false,
          }}
          customStyles={TableStyles}
        />
      </TableWrap>
    </CompWrap>
  );
};

export default AthleteList;
