import React from "react";
import styled from "styled-components";
import DataTable from "react-data-table-component";
import { useEffect, useState } from "react";

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

const MeasurementList = ({ prac_rk }) => {
  const [measurables, setMeasurables] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeasurables = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:5000/api//get-measurementsForPrac`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              prac_rk: prac_rk,
            }),
          }
        );
        const jsonData = await response.json();
        setMeasurables(jsonData.rows);
      } catch (error) {
        console.error(error.message);
      }
      setLoading(false);
    };
    fetchMeasurables();
  }, [prac_rk]);

  const columns = [
    {
      name: "ID",
      selector: (row) => row.meas_id,
      sortable: true,
      //width: "9%",
    },
    {
      name: "Type",
      selector: (row) => row.meas_typ,
      sortable: true,
      //width: "15%",
    },
    {
      name: "Measurement",
      selector: (row) => row.msrm_value + " " + row.meas_unit,
      sortable: true,
      width: "20%",
    },
  ];

  if (loading) return <div>Loading</div>;
  return (
    <Content>
      Measurements
      <TableWrap>
        <Table
          columns={columns}
          data={measurables}
          fixedHeader
          pagination
          paginationPerPage={8}
          paginationComponentOptions={{
            rowsPerPageText: "Rows per page:",
            rangeSeparatorText: "of",
            selectAllRowsItem: false,
          }}
          customStyles={TableStyles}
        />
      </TableWrap>
    </Content>
  );
};

const Content = styled.div`
  display: flex;
  margin: 1rem;
  width: 100%;
  height: auto;
  flex-direction: column;
`;
const TableWrap = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0.3rem;
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
export default MeasurementList;
