import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "typeface-nunito";
import DataTable from "react-data-table-component";
import dayjs from "dayjs";
// This is your PracticeItem component
//Test that this works and add it to the practices component

const CompWrap = styled.div`
  background-color: gray;
  width: 90%;
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
const TrainingPeriodList = ({ sharedState, setSharedState }) => {
  const [trpeData, setTrpeData] = useState([]);
  const getTRPEData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/get-all-trainingPeriods`
      );
      const jsonData = await response.json();
      setTrpeData(jsonData.rows);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    try {
      getTRPEData();
    } catch (error) {
      console.error(error.message);
    }
    console.log("TRPE data loading Succeeded");
  }, []);

  const handleChange = ({ selectedRows }) => {
    // You can set state or dispatch with something like Redux so we can use the retrieved data
    if (selectedRows) {
      const ids = selectedRows?.map((row) => {
        return row.trpe_rk;
      });
      setSharedState(ids);
    }
  };
  const columns = [
    {
      name: "ID",
      selector: (row) => row.trpe_rk,
      sortable: true,
    },
    {
      name: "Start",
      selector: (row) => row.prac_dt,
      cell: (row) => <div>{dayjs(row.trpe_start_dt).format("MMM D YYYY")}</div>,
      sortable: true,
    },
    {
      name: "End",
      selector: (row) => row.trpe_end_dt,
      cell: (row) =>
        row.trpe_end_dt === null ? (
          ""
        ) : (
          <div>{dayjs(row.trpe_end_dt).format("MMM D YYYY")}</div>
        ),
      sortable: true,
    },
  ];
  return (
    <>
      <Title>Training Periods</Title>
      <CompWrap>
        <TableWrap
          columns={columns}
          data={trpeData}
          fixedHeader
          pagination
          selectableRows
          onSelectedRowsChange={handleChange}
        />
      </CompWrap>
    </>
  );
};
export default TrainingPeriodList;
