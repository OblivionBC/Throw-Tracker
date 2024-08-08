import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "typeface-nunito";
import DataTable from "react-data-table-component";
import dayjs from "dayjs";
// This is your PracticeItem component
//Test that this works and add it to the practices component

const CompWrap = styled.div`
  width: 90%;
  background-color: gray;
  padding: 0.2rem;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
  border-radius: 5px;
`;
const TableWrap = styled(DataTable)`
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
`;

const Practices = ({ sharedState, setSharedState }) => {
  const [practiceData, setPracticeData] = useState([]);

  const getPracticeData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/get-all-practices`
      );
      const jsonData = await response.json();
      setPracticeData(jsonData.rows);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    try {
      getPracticeData();
    } catch (error) {
      console.error(error.message);
    }
    console.log("Practice data loading Succeeded");
  }, []);

  const handleChange = ({ selectedRows }) => {
    // You can set state or dispatch with something like Redux so we can use the retrieved data
    if (selectedRows) {
      const ids = selectedRows?.map((row) => {
        return row.prac_rk;
      });
      setSharedState(ids);
    }
  };
  const columns = [
    {
      name: "ID",
      selector: (row) => row.prac_rk,
      sortable: true,
      width: "10%",
    },
    {
      name: "Date",
      selector: (row) => row.prac_dt,
      cell: (row) => <div>{dayjs(row.prac_dt).format("MMM D YYYY")}</div>,
      sortable: true,
    },
    {
      name: "Implement",
      selector: (row) => row.prac_implement,
      sortable: true,
    },
    {
      name: "Weight",
      selector: (row) => row.prac_implement_weight + "kg",
      sortable: true,
      width: "15%",
    },
    {
      name: "Best",
      selector: (row) => row.prac_best + "m",
      sortable: true,
    },
    {
      name: "Period ID",
      selector: (row) => row.trpe_rk,
      sortable: true,
    },
  ];
  return (
    <>
      <Title>Practices</Title>
      <CompWrap>
        <TableWrap
          columns={columns}
          data={practiceData}
          fixedHeader
          pagination
          selectableRows
          onSelectedRowsChange={handleChange}
        />
      </CompWrap>
    </>
  );
};

export default Practices;
