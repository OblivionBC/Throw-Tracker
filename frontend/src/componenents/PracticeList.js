import React from "react";
import styled from "styled-components";
import "typeface-nunito";
import DataTable from "react-data-table-component";
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

const Practices = ({ data, sharedState, setSharedState }) => {
  const handleChange = ({ selectedRows }) => {
    // You can set state or dispatch with something like Redux so we can use the retrieved data
    if (selectedRows) {
      const ids = selectedRows.map((row) => {
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
    },
    {
      name: "Date",
      selector: (row) => row.prac_dt,
      sortable: true,
    },
    {
      name: "Implement",
      selector: (row) => row.prac_implement,
      sortable: true,
    },
    {
      name: "Weight",
      selector: (row) => row.prac_implement_weight,
      sortable: true,
    },
    {
      name: "Best",
      selector: (row) => row.prac_best,
      sortable: true,
    },
  ];
  return (
    <>
      <Title>Practices</Title>
      <CompWrap>
        <TableWrap
          columns={columns}
          data={data}
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
