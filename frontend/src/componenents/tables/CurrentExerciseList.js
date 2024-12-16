import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "typeface-nunito";
import DataTable from "react-data-table-component";
import DynamicModal from "../dynamicModals/DynamicModal";
import EditExerciseForm from "../forms/EditExercise";
import AddExerciseForm from "../forms/AddExercise";
import { useUser } from "../contexts/UserContext";
import ConfirmExerciseDelete from "../modals/ConfirmExceriseDelete";
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

const CurrentExcersiseList = ({ paginationNum }) => {
  const [excrData, setExcrData] = useState([]);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState([]);
  const { user } = useUser();
  let pagination = 3;
  paginationNum === undefined ? (pagination = 3) : (pagination = paginationNum);
  const getExerciseData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/get-exerciseForCoach`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            coach_prsn_rk: user.prsn_rk,
          }),
        }
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
  }, []);

  const columns = [
    {
      name: "Exercise",
      selector: (row) => row.excr_nm,
      sortable: true,
    },
    {
      name: "Notes",
      selector: (row) => row.excr_notes,
      sortable: true,
    },
    {
      name: "Units",
      selector: (row) => row.excr_units,
      sortable: true,
    },

    {
      cell: (row) => (
        <AddButton
          onClick={() => {
            setSelectedRow(row);
            setEditModalOpen(true);
          }}
        >
          Details
        </AddButton>
      ),
    },
    {
      cell: (row) => (
        <AddButton
          onClick={() => {
            setSelectedRow(row);
            setDeleteModalOpen(true);
          }}
        >
          Delete
        </AddButton>
      ),
    },
  ];
  return (
    <CompWrap>
      <DynamicModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        refresh={() => getExerciseData()}
        Component={AddExerciseForm}
        props={{ coach_prsn_rk: user.prsn_rk }}
      />
      <DynamicModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        refresh={() => getExerciseData()}
        Component={EditExerciseForm}
        props={selectedRow}
      />
      <ConfirmExerciseDelete
        open={deleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        refresh={() => getExerciseData()}
        excr={selectedRow}
      />
      <RowDiv>
        <Title>Current Exercises</Title>
        <AddButton
          onClick={() => {
            setAddModalOpen(true);
          }}
        >
          Add
        </AddButton>
      </RowDiv>
      <TableWrap>
        <Table
          columns={columns}
          data={excrData}
          fixedHeader
          pagination
          paginationPerPage={pagination}
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

const CompWrap = styled.div`
  display: flex;
  flex-direction: column;
  width: 95%;
  height: 100%;
`;
const RowDiv = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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
export default CurrentExcersiseList;
