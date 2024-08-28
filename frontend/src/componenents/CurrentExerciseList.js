import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "typeface-nunito";
import DataTable from "react-data-table-component";
import dayjs from "dayjs";
// This is your PracticeItem component
//Test that this works and add it to the practices component
const CompWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;
  height: 100%;
`;
const TableWrap = styled.div`
  display: flex;
  flex-direction: column;

  width: 100%;
  height: auto;
  padding: 0.2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  border-radius: 5px;
`;
const Table = styled(DataTable)`
  width: 100%;
  .rdt_Table {
    background-color: white;
  }
  .rdt_TableHeadRow {
    background-color: #a9a5ba;
    font-weight: bold;
  }
  .rdt_TableRow {
    &:nth-of-type(odd) {
      background-color: white;
    }
    &:nth-of-type(even) {
      background-color: #eeeeee;
    }
  }
  .rdt_Pagination {
    background-color: #343a40;
    color: #fff;
  }
`;
const Title = styled.h1`
  display: flex;
  align-self: flex-start;
  margin: 0;
  padding: 0 5px 5px;
`;

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

const CurrentExcersiseList = () => {
  const [excrData, setExcrData] = useState([]);
  const getExerciseData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/get-exercisesInCurrentTRPE`
      );
      const jsonData = await response.json();
      setExcrData(jsonData.rows);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    try {
      getExerciseData();
    } catch (error) {
      console.error(error.message);
    }
    console.log("TRPE data loading Succeeded");
  }, []);

  const columns = [
    {
      name: "Exercise",
      selector: (row) => row.excr_nm,
      sortable: true,
      width: "20%",
    },
    {
      name: "Sets",
      selector: (row) => row.excr_sets,
      sortable: true,
      width: "13%",
    },
    {
      name: "Reps",
      selector: (row) => row.excr_reps,
      sortable: true,
      width: "13%",
    },
    {
      name: "Weight",
      selector: (row) => row.excr_weight + "lbs",
      sortable: true,
      width: "15%",
    },
    {
      name: "Notes",
      selector: (row) => row.excr_notes,
      sortable: true,
    },
  ];
  return (
    <CompWrap>
      <Title>Current Exercises</Title>
      <TableWrap>
        <Table
          columns={columns}
          data={excrData}
          fixedHeader
          pagination
          paginationPerPage={3}
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
export default CurrentExcersiseList;
