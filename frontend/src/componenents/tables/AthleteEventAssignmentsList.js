import React, { useEffect, useState } from "react";
import { Table, TableWrap, Title, CompWrap } from "../../styles/styles.js";
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

const AthleteEventAssignmentsList = ({ athlete_rk }) => {
  const [assignmentData, setAssignmentData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAssignmentData = async () => {
    if (!athlete_rk) {
      setLoading(false);
      return;
    }

    try {
      const response = await athleteEventAssignmentsApi.getByAthlete(
        athlete_rk
      );
      setAssignmentData(response);
    } catch (error) {
      console.error("Error fetching athlete event assignments:", error);
      setAssignmentData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAssignmentData();
  }, [athlete_rk]);

  const handleChange = ({ selectedRows }) => {
    if (selectedRows) {
      const ids = selectedRows?.map((row) => {
        return row.aevas_rk;
      });
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
      <Title>Athlete Event Assignments</Title>
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
};

export default AthleteEventAssignmentsList;
