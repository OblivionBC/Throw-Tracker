import React, { useEffect, useState } from "react";
import {
  Table,
  TableWrap,
  RowDiv,
  Title,
  CompWrap,
  AddButton,
  EditButton,
} from "../../styles/styles.js";
import { API_BASE_URL } from "../../config.js";
import dayjs from "dayjs";
// This is your PracticeItem component
//Test that this works and add it to the practices component

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
      const response = await fetch(`${API_BASE_URL}/api/get-all-meets`);
      const jsonData = await response.json();
      setMeetData(jsonData.rows);
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
    // You can set state or dispatch with something like Redux so we can use the retrieved data
    if (selectedRows) {
      const ids = selectedRows?.map((row) => {
        return row.trpe_rk;
      });
    }
  };
  //meet_nm, meet_dt, meet_location, prsn_rk
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
