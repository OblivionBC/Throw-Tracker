import {
  Table,
  TableWrap,
  RowDiv,
  Title,
  CompWrap,
  AddButton,
} from "../../styles/styles.js";
import { useState, useEffect } from "react";
import AddExerciseAssignment from "../modals/AddExerciseAssignmentModal";
import ExerciseAssignmentDetails from "../modals/ExerciseAssignmentDetails";
import useUserStore, { useUser } from "../../stores/userStore";
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

const ProgramContent = ({
  paginationNum,
  data,
  prog_rk,
  refresh,
  bAdd,
  bEdit,
  bDelete,
}) => {
  //Make modal/form for adding exercise_assignment and deleteing one
  const [assignExercise, setAssignExercise] = useState(false);
  const [selectedExcr, setSelectedExcr] = useState({});
  const [editExcr, setEditExcr] = useState(false);
  let pagination = 3;
  const user = useUser();
  paginationNum === undefined ? (pagination = 3) : (pagination = paginationNum);
  let columns = [];
  if (data.length === 1 && !data[0].excr_nm) {
    columns = [
      {
        name: "Exercise",
        selector: (row) => row.excr_nm,
        cell: (row) => <p>No Exercises</p>,
      },
    ];
  } else {
    columns = [
      {
        name: "Exercise",
        selector: (row) => row.excr_nm,
        sortable: true,
      },
      {
        name: "Reps",
        selector: (row) => row.exas_reps,
        sortable: true,
      },
      {
        name: "Sets",
        selector: (row) => row.exas_sets,
        sortable: true,
      },
      {
        name: "Weight",
        selector: (row) => row.exas_weight,
        sortable: true,
      },
      {
        name: "Notes",
        selector: (row) => row.excr_notes + " - " + row.exas_notes,
        sortable: true,
      },
      {
        name: "Measurable?",
        selector: (row) => row.is_measurable,
        cell: (row) => {
          return row.excr_nm ? (
            <input
              type="checkbox"
              id="measurable_checkbox"
              checked={row.is_measurable === "Y"}
              disabled
            />
          ) : null;
        },
      },
      {
        cell: (row) => {
          return row.excr_nm ? (
            <AddButton
              onClick={() => {
                setSelectedExcr(row);
                setEditExcr(true);
              }}
            >
              Details
            </AddButton>
          ) : null;
        },
      },
    ];
  }

  return (
    <CompWrap>
      <AddExerciseAssignment
        open={assignExercise}
        onClose={() => setAssignExercise(false)}
        refresh={() => refresh()}
        prog_rk={prog_rk}
      />
      <ExerciseAssignmentDetails
        open={editExcr}
        onClose={() => setEditExcr(!editExcr)}
        refresh={() => refresh()}
        excrObj={selectedExcr}
        bEdit={user?.role === "COACH" && bEdit}
        bDelete={user?.role === "COACH" && bDelete}
      />
      <RowDiv>
        <Title>Program : {data[0]?.prog_nm} </Title>
        {user?.role === "COACH" && bAdd && (
          <AddButton onClick={() => setAssignExercise(true)}>
            Add Exercise
          </AddButton>
        )}

        <AddButton onClick={() => refresh()}>Refresh</AddButton>
      </RowDiv>

      <TableWrap>
        <Table
          columns={columns}
          data={data}
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

export default ProgramContent;
