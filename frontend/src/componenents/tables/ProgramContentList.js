import {
  Table,
  TableWrap,
  RowDiv,
  Title,
  CompWrap,
  AddButton,
} from "../../styles/design-system";
import { useState } from "react";
import AddMeasurableToProgramModal from "../modals/AddMeasurableToProgramModal";
import MeasurableAssignmentDetails from "../modals/MeasurableAssignmentDetails";
import { useUser } from "../../stores/userStore";

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

const ProgramMeasurableContent = ({
  paginationNum,
  data,
  prog_rk,
  refresh,
  bAdd,
  bEdit,
  bDelete,
}) => {
  const [addMeasurable, setAddMeasurable] = useState(false);
  const [selectedMeasurable, setSelectedMeasurable] = useState({});
  const [editMeasurable, setEditMeasurable] = useState(false);
  let pagination = 3;
  const user = useUser();
  paginationNum === undefined ? (pagination = 3) : (pagination = paginationNum);

  let columns = [];
  if (data.length === 1 && !data[0].meas_id) {
    columns = [
      {
        name: "Measurable",
        selector: (row) => row.meas_id,
        cell: (row) => <p>No Measurables</p>,
      },
    ];
  } else {
    columns = [
      {
        name: "Measurable",
        selector: (row) => row.meas_id,
        sortable: true,
      },
      {
        name: "Type",
        selector: (row) => row.meas_typ,
        sortable: true,
      },
      {
        name: "Target Value",
        selector: (row) => row.target_val,
        sortable: true,
      },
      {
        name: "Target Reps",
        selector: (row) => row.target_reps,
        sortable: true,
      },
      {
        name: "Target Sets",
        selector: (row) => row.target_sets,
        sortable: true,
      },
      {
        name: "Target Weight",
        selector: (row) => row.target_weight,
        sortable: true,
      },
      {
        name: "Unit",
        selector: (row) => row.target_unit || row.meas_unit,
        sortable: true,
      },
      {
        name: "Measured?",
        selector: (row) => row.is_measured,
        cell: (row) => {
          return row.meas_id ? (
            <input
              type="checkbox"
              id="measured_checkbox"
              checked={row.is_measured === true}
              disabled
            />
          ) : null;
        },
      },
      {
        name: "Notes",
        selector: (row) => row.notes,
        sortable: true,
      },
      {
        name: "Actions",
        cell: (row) => {
          return row.meas_id ? (
            <div style={{ display: "flex", gap: "5px" }}>
              <AddButton
                $size="sm"
                onClick={() => {
                  setSelectedMeasurable(row);
                  setEditMeasurable(true);
                }}
              >
                Details
              </AddButton>
            </div>
          ) : null;
        },
      },
    ];
  }

  return (
    <CompWrap>
      <AddMeasurableToProgramModal
        open={addMeasurable}
        onClose={() => setAddMeasurable(false)}
        refresh={() => refresh()}
        prog_rk={prog_rk}
      />
      <MeasurableAssignmentDetails
        open={editMeasurable}
        onClose={() => setEditMeasurable(!editMeasurable)}
        refresh={() => refresh()}
        measurableObj={selectedMeasurable}
        bEdit={user?.role === "COACH" && bEdit}
        bDelete={user?.role === "COACH" && bDelete}
      />
      <RowDiv>
        <Title>Program : {data[0]?.prog_nm} </Title>
        {user?.role === "COACH" && bAdd && (
          <AddButton onClick={() => setAddMeasurable(true)}>
            Add Measurable
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

export default ProgramMeasurableContent;
