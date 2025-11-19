import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../ui/DataTable/DataTable";
import {
  AddButton,
  EditButton,
} from "../../styles/design-system";
import AssignProgramToAthletesModal from "../modals/AssignProgramToAthletesModal";
import { getPaginationNumber } from "../../utils/tableUtils";
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

const ProgramsTable = ({ paginationNum }) => {
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(600);
  const [assignProgramOpen, setAssignProgramOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState({});
  const [programsData, setProgramsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const data = await programsApi.getAll();
      setProgramsData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrograms();
  }, []);

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

  const optimalPagination = getPaginationNumber(paginationNum, containerHeight);

  const handleRowClick = (row) => {
    navigate(`/programs/${row.prog_rk}`);
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
            onClick={(e) => {
              e.stopPropagation();
              setSelectedProgram(row);
              setAssignProgramOpen(true);
            }}
          >
            Assign
          </EditButton>
          <EditButton
            $size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(row);
            }}
          >
            Details
          </EditButton>
        </div>
      ),
    },
  ];

  const actions = (
    <>
      <AddButton onClick={() => navigate("/programs/new")}>Add</AddButton>
      <AddButton onClick={fetchPrograms}>Refresh</AddButton>
    </>
  );

  return (
    <div ref={containerRef}>
      {assignProgramOpen && selectedProgram.prog_rk && (
        <AssignProgramToAthletesModal
          open={assignProgramOpen}
          onClose={() => setAssignProgramOpen(false)}
          program={selectedProgram}
          refresh={fetchPrograms}
        />
      )}
      <DataTable
        title="Programs"
        columns={columns}
        data={programsData}
        loading={loading}
        pagination={{ page: 1, perPage: optimalPagination }}
        onRowClick={handleRowClick}
        actions={actions}
        customStyles={TableStyles}
        defaultSortFieldId="Program Name"
        defaultSortAsc={true}
      />
    </div>
  );
};

export default ProgramsTable;

