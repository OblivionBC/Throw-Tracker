import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  TableWrap,
  Title,
  CompWrap,
  AddButton,
  RowDiv,
} from "../../styles/design-system";
import AthleteDetails from "../modals/AthleteDetails";
import ConfirmAssignAthleteModal from "../modals/ConfirmAssignAthleteModal";
import { personsApi, athleteEventAssignmentsApi } from "../../api";
import useUserStore, { useUser } from "../../stores/userStore";
import { useApi } from "../../hooks/useApi";
import Logger from "../../utils/logger";
import {
  getPaginationNumber,
  getContainerHeight,
} from "../../utils/tableUtils";
import styled from "styled-components";
import logo from "../../images/LogoIcon.png";

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
  const [profileImageErrors, setProfileImageErrors] = useState({});
  const user = useUser();
  const { apiCall } = useApi();

  const getAthleteData = async () => {
    try {
      Logger.log("Getting athlete data for filter:", filter);
      let athletes;
      if (filter === "assigned") {
        Logger.log("Fetching assigned athletes...");
        athletes = await apiCall(
          () => personsApi.getAthletesForCoach(),
          "Fetching assigned athletes"
        );
        Logger.log("Assigned athletes result:", athletes);
      } else {
        Logger.log("Fetching unassigned athletes...");
        athletes = await apiCall(
          () => personsApi.getUnassignedAthletesInOrg(),
          "Fetching unassigned athletes"
        );
        Logger.log("Unassigned athletes result:", athletes);
      }
      // Fetch event assignments for each athlete
      const athletesWithEvents = await Promise.all(
        athletes.map(async (athlete) => {
          try {
            const events = await apiCall(
              () => athleteEventAssignmentsApi.getByAthlete(athlete.prsn_rk),
              `Fetching events for athlete ${athlete.prsn_rk}`
            );
            return {
              ...athlete,
              events: events.slice(0, 2), // Limit to 2 events
            };
          } catch (error) {
            Logger.error(
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
      Logger.log("Final athletes with events:", athletesWithEvents);
      setExcrData(athletesWithEvents);
    } catch (error) {
      Logger.error("Error in getAthleteData:", error.message);
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

  const handleProfileImageError = (athleteId) => {
    setProfileImageErrors((prev) => ({ ...prev, [athleteId]: true }));
  };

  const columns = [
    {
      name: "Profile",
      cell: (row) => (
        <AthleteProfileImage
          src={
            row.profile_url && !profileImageErrors[row.prsn_rk]
              ? row.profile_url
              : logo
          }
          alt={`${row.prsn_first_nm} ${row.prsn_last_nm}`}
          onError={() => handleProfileImageError(row.prsn_rk)}
        />
      ),
      width: "80px",
    },
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
      name: "Actions",
      cell: (row) => (
        <div style={{ display: "flex", gap: "5px" }}>
          {filter === "unassigned" ? (
            <AddButton
              $size="sm"
              onClick={() => {
                setAthleteToAssign(row);
                setAssignModalOpen(true);
              }}
            >
              Assign To Me
            </AddButton>
          ) : (
            <AddButton
              $size="sm"
              onClick={() => {
                setSelectedPrsn(row);
                setProgramOpen(true);
              }}
            >
              Details
            </AddButton>
          )}
        </div>
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

const AthleteProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #1976d2;
  object-fit: cover;
`;

export default AthleteList;
