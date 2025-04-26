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
import DynamicModal from "../dynamicModals/DynamicModal";
import EditExerciseForm from "../forms/EditExercise";
import AddExerciseForm from "../forms/AddExercise";
import { useUser } from "../contexts/UserContext";
import ConfirmExerciseDelete from "../modals/ConfirmExceriseDelete";
import { API_BASE_URL } from "../../config.js";
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
      const response = await fetch(`${API_BASE_URL}/api/get-exerciseForCoach`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coach_prsn_rk: user.prsn_rk,
        }),
      });
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

export default CurrentExcersiseList;
