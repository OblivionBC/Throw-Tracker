import React, { useEffect, useState } from "react";
import { Table, TableWrap, Title, CompWrap } from "../../styles/styles.js";
import { meetsApi } from "../../api";
import dayjs from "dayjs";

const TableStyles = {
  pagination: {
    style: {
      minHeight: "30px", // Adjust the height as needed
      padding: "0 0px",
      margin: "0 0px",
    },
    pageButtonsStyle: {
      minWidth: "30px", // Adjust the width as needed
      height: "10px", // Adjust the height as needed
      margin: "0 0px",
      padding: "0 0px",
    },
  },
};

const MeetList = () => {
  const [meetData, setMeetData] = useState([]);
  const getMeetData = async () => {
    try {
      const response = await meetsApi.getAll();

      setMeetData(response);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    try {
      getMeetData();
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  const handleChange = ({ selectedRows }) => {
    if (selectedRows) {
      const ids = selectedRows?.map((row) => {
        return row.trpe_rk;
      });
    }
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.meet_nm,
      sortable: true,
    },
    {
      name: "Date",
      selector: (row) => row.meet_dt,
      cell: (row) => <div>{dayjs(row.meet_dt).format("MMM D YYYY")}</div>,
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => row.meet_location,
      sortable: true,
    },
  ];
  return (
    <CompWrap>
      <Title>Meets</Title>
      <TableWrap>
        <Table
          columns={columns}
          data={meetData}
          fixedHeader
          pagination
          paginationPerPage={3}
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

export default MeetList;
