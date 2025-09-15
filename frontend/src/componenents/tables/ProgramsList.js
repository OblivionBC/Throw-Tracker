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
} from "../../styles/design-system";
import AddProgramModal from "../modals/AddProgramModal";
import AssignProgramModal from "../modals/AssignProgramModal";
import ProgramDetailsModal from "../modals/ProgramDetailsModal";
import AssignProgramToAthletesModal from "../modals/AssignProgramToAthletesModal";
import { getPaginationNumber } from "../../utils/tableUtils";
import useUserStore, { useUser } from "../../stores/userStore";
import { programsApi } from "../../api";

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
  const [programsData, setProgramsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const user = useUser();

  const fetchPrograms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await programsApi.getAll();
      setProgramsData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

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
    fetchPrograms();
  };

  const handleDataChange = () => {
    fetchPrograms();
  };

  const columns = [
    {
      name: "Program Name",
      selector: (row) => row.prog_nm,
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
            $size="sm"
            onClick={() => {
              setSelectedProgram(row);
              setAssignProgramOpen(true);
            }}
          >
            Assign
          </EditButton>
          <EditButton
            $size="sm"
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
        {loading ? (
          <div>Loading programs...</div>
        ) : error ? (
          <div style={{ color: "red" }}>Error: {error}</div>
        ) : (
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
        )}
      </TableWrap>
    </CompWrap>
  );
};

export default ProgramsList;
