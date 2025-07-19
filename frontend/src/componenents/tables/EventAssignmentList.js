import React, { useEffect, useState } from "react";
import { Table, TableWrap, Title, CompWrap } from "../../styles/styles.js";
import { eventAssignmentsApi } from "../../api";
import dayjs from "dayjs";

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

const EventAssignmentList = ({ meet_rk }) => {
  const [assignmentData, setAssignmentData] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAssignmentData = async () => {
    if (!meet_rk) {
      setLoading(false);
      return;
    }

    try {
      const response = await eventAssignmentsApi.getByMeet(meet_rk);
      setAssignmentData(response);
    } catch (error) {
      console.error("Error fetching event assignments:", error);
      setAssignmentData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAssignmentData();
  }, [meet_rk]);

  const handleChange = ({ selectedRows }) => {
    if (selectedRows) {
      const ids = selectedRows?.map((row) => {
        return row.meet_rk;
      });
    }
  };

  const columns = [
    {
      name: "Athlete",
      selector: (row) => `${row.athlete_first_nm} ${row.athlete_last_nm}`,
      sortable: true,
    },
    {
      name: "Event",
      selector: (row) => row.event_name,
      sortable: true,
    },
    {
      name: "Final Mark",
      selector: (row) => row.final_mark || "N/A",
      sortable: true,
    },
    {
      name: "Coach",
      selector: (row) => `${row.coach_first_nm} ${row.coach_last_nm}`,
      sortable: true,
    },
    {
      name: "Notes",
      selector: (row) => row.notes || "N/A",
      sortable: false,
    },
  ];

  if (loading) {
    return <div>Loading event assignments...</div>;
  }

  return (
    <CompWrap>
      <Title>Event Assignments</Title>
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

export default EventAssignmentList;
