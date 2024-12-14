import styled from "styled-components";
import "typeface-nunito";
import DataTable from "react-data-table-component";
import { useState } from "react";
import AddExerciseAssignment from "../modals/AddExerciseAssignmentModal";
import ExerciseAssignmentDetails from "../modals/ExerciseAssignmentDetails";
import { useUser } from "../contexts/UserContext";
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

const ProgramContent = ({ paginationNum, data, prog_rk, prsn_rk, refresh }) => {
  //Make modal/form for adding exercise_assignment and deleteing one
  const [assignExercise, setAssignExercise] = useState(false);
  const [selectedExcr, setSelectedExcr] = useState({});
  const [editExcr, setEditExcr] = useState(false);
  let pagination = 3;
  const { user } = useUser();
  paginationNum === undefined ? (pagination = 3) : (pagination = paginationNum);
  console.log(data);
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
        prsn_rk={prsn_rk}
      />
      <ExerciseAssignmentDetails
        open={editExcr}
        onClose={() => setEditExcr(!editExcr)}
        refresh={() => refresh()}
        excrObj={selectedExcr}
        bEdit={user.prsn_role === "COACH"}
        bDelete={user.prsn_role === "COACH"}
        prsn_rk={prsn_rk}
      />
      <RowDiv>
        <Title>Program : {prog_rk} </Title>
        {user.prsn_role === "COACH" && (
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
export default ProgramContent;
