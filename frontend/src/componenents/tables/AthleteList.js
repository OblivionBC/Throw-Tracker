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
import AssignEventToAthleteModal from "../modals/AssignEventToAthleteModal";
import { personsApi } from "../../api";
import useUserStore, { useUser } from "../../stores/userStore";
import {
  getPaginationNumber,
  getContainerHeight,
} from "../../utils/tableUtils";

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
  const [assignEventOpen, setAssignEventOpen] = useState(false);
  const [selectedPrsn, setSelectedPrsn] = useState();
  const user = useUser();

  const getAthleteData = async () => {
    try {
      const response = await personsApi.getAthletesForCoach();
      setExcrData(response);
    } catch (error) {
      console.error(error.message);
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
    try {
      getAthleteData();
    } catch (error) {
      console.error(error.message);
    }
  }, []);

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
      name: "Email",
      selector: (row) => row.prsn_email,
      sortable: true,
    },
    {
      cell: (row) => (
        <div style={{ display: "flex", gap: "5px" }}>
          <AddButton
            onClick={() => {
              setSelectedPrsn(row);
              setProgramOpen(true);
            }}
          >
            Details
          </AddButton>
          <AddButton
            onClick={() => {
              setSelectedPrsn(row);
              setAssignEventOpen(true);
            }}
            style={{ backgroundColor: "#28a745" }}
          >
            Assign Events
          </AddButton>
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
      />
      <AssignEventToAthleteModal
        open={assignEventOpen}
        onClose={() => setAssignEventOpen(false)}
        onSuccess={getAthleteData}
      />
      <RowDiv>
        <Title>Athletes</Title>
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
