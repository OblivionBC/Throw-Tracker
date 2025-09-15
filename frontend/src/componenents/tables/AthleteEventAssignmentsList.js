import React, {
  useEffect,
  useState,
  useImperativeHandle,
  forwardRef,
} from "react";
import {
  Table,
  TableWrap,
  Title,
  CompWrap,
  AddButton,
} from "../../styles/design-system";
import { athleteEventAssignmentsApi } from "../../api";

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

const AthleteEventAssignmentsList = forwardRef(
  ({ athlete_rk, onRefresh }, ref) => {
    const [assignmentData, setAssignmentData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedRows, setSelectedRows] = useState([]);
    const [deleting, setDeleting] = useState(false);

    const getAssignmentData = async () => {
      if (!athlete_rk) {
        setLoading(false);
        return;
      }

      try {
        console.log("Fetching event assignments for athlete:", athlete_rk);
        const response = await athleteEventAssignmentsApi.getByAthlete(
          athlete_rk
        );
        console.log("Event assignments response:", response);
        setAssignmentData(response);
      } catch (error) {
        console.error("Error fetching athlete event assignments:", error);
        setAssignmentData([]);
      } finally {
        setLoading(false);
      }
    };

    // Expose refresh function to parent components
    useImperativeHandle(ref, () => ({
      refresh: async () => {
        await getAssignmentData();
      },
    }));

    useEffect(() => {
      getAssignmentData();
    }, [athlete_rk]);

    const handleChange = ({ selectedRows }) => {
      setSelectedRows(selectedRows || []);
    };

    const handleDeleteSelected = async () => {
      if (selectedRows.length === 0) {
        alert("Please select events to delete");
        return;
      }

      if (
        !window.confirm(
          `Are you sure you want to delete ${selectedRows.length} event assignment(s)?`
        )
      ) {
        return;
      }

      setDeleting(true);
      try {
        // Delete each selected assignment
        await Promise.all(
          selectedRows.map((row) =>
            athleteEventAssignmentsApi.unassign(athlete_rk, row.etyp_rk)
          )
        );

        // Refresh the data
        await getAssignmentData();
        setSelectedRows([]);

        // Call parent refresh if provided
        if (onRefresh) {
          onRefresh();
        }
      } catch (error) {
        console.error("Error deleting event assignments:", error);
        alert("Failed to delete event assignments. Please try again.");
      } finally {
        setDeleting(false);
      }
    };

    const columns = [
      {
        name: "Event",
        selector: (row) => row.etyp_type_name,
        sortable: true,
      },
      {
        name: "Event Group",
        selector: (row) => row.event_group_name || "N/A",
        sortable: true,
      },
      {
        name: "Description",
        selector: (row) => row.description || "N/A",
        sortable: false,
      },
    ];

    if (loading) {
      return <div>Loading athlete event assignments...</div>;
    }

    return (
      <CompWrap>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 10,
          }}
        >
          <Title>Athlete Event Assignments</Title>
          {selectedRows.length > 0 && (
            <AddButton
              onClick={handleDeleteSelected}
              disabled={deleting}
              style={{
                backgroundColor: "#dc3545",
                color: "white",
                padding: "5px 10px",
                fontSize: "12px",
              }}
            >
              {deleting
                ? "Deleting..."
                : `Delete Selected (${selectedRows.length})`}
            </AddButton>
          )}
        </div>
        <TableWrap>
          <Table
            columns={columns}
            data={assignmentData}
            fixedHeader
            pagination
            paginationPerPage={5}
            paginationComponentOptions={{
              rowsPerPageText: "Rows per page:",
              rangeSeparatorText: "of",
              selectAllRowsItem: false,
            }}
            customStyles={TableStyles}
            selectableRows
            onSelectedRowsChange={handleChange}
          />
        </TableWrap>
      </CompWrap>
    );
  }
);

export default AthleteEventAssignmentsList;
