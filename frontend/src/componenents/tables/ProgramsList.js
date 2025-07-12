import React, { useEffect, useState, useRef } from "react";
import dayjs from "dayjs";
import {
  Table,
  TableWrap,
  RowDiv,
  Title,
  CompWrap,
  AddButton,
  EditButton,
} from "../../styles/styles.js";
import AddProgramModal from "../modals/AddProgramModal";
import AssignProgramModal from "../modals/AssignProgramModal";
import ProgramDetailsModal from "../modals/ProgramDetailsModal";
import AssignProgramToAthletesModal from "../modals/AssignProgramToAthletesModal";
import { useProgramsData } from "../../hooks/useCachedData";
import {
  getPaginationNumber,
  getContainerHeight,
} from "../../utils/tableUtils";
import useUserStore, { useUser } from "../../stores/userStore";

const TableStyles = {
  pagination: {
    style: {
      minHeight: "30px",
      padding: "0 0px",
      margin: "0 0px",
    },
    pageButtonsStyle: {
      minWidth: "30px",
      height: "20px",
      margin: "0 0px",
      padding: "0 0px",
    },
  },
};

const ProgramsList = ({ paginationNum }) => {
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(600);
  const [addProgramOpen, setAddProgramOpen] = useState(false);
  const [assignProgramOpen, setAssignProgramOpen] = useState(false);
  const [detailsProgramOpen, setDetailsProgramOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState({});
  const [assignToAthletesOpen, setAssignToAthletesOpen] = useState(false);
  const user = useUser();

  // Use the cached data hook
  const {
    data: programsData = [],
    loading,
    error,
    refetch,
  } = useProgramsData();

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

  // Calculate optimal pagination
  const optimalPagination = getPaginationNumber(paginationNum, containerHeight);

  const handleRefresh = () => {
    refetch();
  };

  const handleDataChange = () => {
    refetch();
  };

  const columns = [
    {
      name: "Program Name",
      selector: (row) => row.prog_nm,
      sortable: true,
    },
    {
      name: "Training Period",
      selector: (row) => row.trpe_rk,
      cell: (row) => (
        <div>
          {dayjs(row.trpe_start_dt).format("MMM D YYYY")} -
          {row.trpe_end_dt
            ? dayjs(row.trpe_end_dt).format("MMM D YYYY")
            : "Active"}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Exercises",
      selector: (row) => row.exercise_count,
      sortable: true,
    },
    {
      name: "Athletes",
      selector: (row) => row.athlete_count,
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div style={{ display: "flex", gap: "5px" }}>
          <EditButton
            onClick={() => {
              setSelectedProgram(row);
              setAssignProgramOpen(true);
            }}
          >
            Assign
          </EditButton>
          <EditButton
            onClick={() => {
              setSelectedProgram(row);
              setDetailsProgramOpen(true);
            }}
          >
            Details
          </EditButton>
        </div>
      ),
    },
  ];

  return (
    <CompWrap ref={containerRef}>
      {addProgramOpen && (
        <AddProgramModal
          open={addProgramOpen}
          onClose={() => setAddProgramOpen(false)}
          refresh={handleDataChange}
        />
      )}
      {assignProgramOpen && selectedProgram.prog_rk && (
        <AssignProgramToAthletesModal
          open={assignProgramOpen}
          onClose={() => setAssignProgramOpen(false)}
          program={selectedProgram}
          refresh={handleDataChange}
        />
      )}
      {detailsProgramOpen && selectedProgram.prog_rk && (
        <ProgramDetailsModal
          open={detailsProgramOpen}
          onClose={() => setDetailsProgramOpen(false)}
          refresh={handleDataChange}
          program={selectedProgram}
        />
      )}
      <RowDiv>
        <Title>Programs</Title>
        <AddButton onClick={() => setAddProgramOpen(true)}>Add</AddButton>
        <AddButton onClick={handleRefresh}>Refresh</AddButton>
      </RowDiv>
      <TableWrap>
        <Table
          columns={columns}
          data={programsData}
          pagination
          paginationPerPage={optimalPagination}
          paginationComponentOptions={{
            rowsPerPageText: "Rows per page:",
            rangeSeparatorText: "of",
            selectAllRowsItem: false,
          }}
          customStyles={TableStyles}
          defaultSortFieldId="Program Name"
          defaultSortAsc={true}
        />
      </TableWrap>
    </CompWrap>
  );
};

export default ProgramsList;
