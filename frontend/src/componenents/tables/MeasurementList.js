import React from "react";
import { Table, TableWrap, CompWrap } from "../../styles/styles.js";
import { useEffect, useState } from "react";
import { useUser } from "../contexts/UserContext";
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
  const { getUser } = useUser();
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
  }, [prac_rk, getUser()]);

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
    <CompWrap>
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
    </CompWrap>
  );
};

export default MeasurementList;
