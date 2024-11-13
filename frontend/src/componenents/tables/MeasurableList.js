import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "typeface-nunito";
import DataTable from "react-data-table-component";
import { useUser } from "../contexts/UserContext";
import AddMeasurableModal from "../modals/AddMeasurableModal";
import ConfirmMeasurableDeleteModal from "../modals/ConfirmMeasurableDeleteModal";
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

const Measurables = ({ paginationNum }) => {
  if (!paginationNum) paginationNum = 8;
  const [measurableData, setMeasurableData] = useState([]);
  const [addMeasurableOpen, setaddMeasurableOpen] = useState(false);
  const [confirmMeasDelete, setConfirmMeasDelete] = useState(false);
  const [selectedMeas, setSelectedMeas] = useState({});
  const { user } = useUser();
  const getMeasurableData = async () => {
    try {
      console.log("REFRESH");
      const params = new URLSearchParams({
        keys: JSON.stringify(user),
      });

      const response = await fetch(
        `http://localhost:5000/api//get-all-measurablesForPrsn`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prsn_rk: user.prsn_rk,
          }),
        }
      );

      const jsonData = await response.json();
      setMeasurableData(jsonData.rows);
      console.log(measurableData);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    try {
      getMeasurableData();
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  const columns = [
    {
      name: "ID",
      selector: (row) => row.meas_rk,
      sortable: true,
      //width: "9%",
    },
    {
      name: "Name",
      selector: (row) => row.meas_id,
      sortable: true,
      //width: "15%",
    },
    {
      name: "Units",
      selector: (row) => row.meas_unit,
      sortable: true,
      //width: "15%",
    },
    {
      cell: (row) => (
        <Detail // Swap to a edit modal for the measurables
          onClick={() => {
            setConfirmMeasDelete(true);
            setSelectedMeas(row);
          }}
        >
          Edit
        </Detail>
      ),
    },
    {
      cell: (row) => (
        <DeleteButton
          onClick={() => {
            setConfirmMeasDelete(true);
            setSelectedMeas(row);
          }}
        >
          Delete
        </DeleteButton>
      ),
    },
  ];
  return (
    <CompWrap>
      <ConfirmMeasurableDeleteModal
        open={confirmMeasDelete}
        onClose={() => setConfirmMeasDelete(false)}
        measObj={selectedMeas}
        refresh={() => getMeasurableData()}
      />
      <AddMeasurableModal
        open={addMeasurableOpen}
        onClose={() => setaddMeasurableOpen(false)}
        refresh={() => getMeasurableData()}
      />
      <RowDiv>
        <Title>Measurables</Title>
        <AddButton onClick={() => setaddMeasurableOpen(true)}>Add</AddButton>
        <AddButton onClick={() => getMeasurableData()}>Refresh</AddButton>
      </RowDiv>

      <TableWrap>
        <Table
          columns={columns}
          data={measurableData}
          fixedHeader
          pagination
          paginationPerPage={paginationNum}
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

const RowDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
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

const Detail = styled.button`
  background: linear-gradient(45deg, #808080 30%, black 95%);
  border: none;
  border-radius: 25px;
  color: white;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translateY(0);
  }
`;
const DeleteButton = styled.button`
  background: linear-gradient(45deg, black 30%, #808080 95%);
  border: none;
  border-radius: 25px;
  color: white;
  padding: 5px 10px;
  font-size: 12px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translateY(0);
  }
`;
const AddButton = styled.button`
  background: linear-gradient(45deg, #808080 30%, white 95%);
  border: none;
  border-radius: 25px;
  color: white;
  padding: 5px 20px;
  font-size: 16px;
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 6px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  &:active {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    transform: translateY(0);
  }
`;

export default Measurables;
