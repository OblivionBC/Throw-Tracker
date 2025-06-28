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
import { useUser } from "../contexts/UserContext";
import AddMeasurableModal from "../modals/AddMeasurableModal";
import ConfirmMeasurableDeleteModal from "../modals/ConfirmMeasurableDeleteModal";
import MeasurableEditModal from "../modals/MeasurableEditModal";
import { measurablesApi } from "../../api";
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
  const [editMeas, setEditMeas] = useState(false);

  const [selectedMeas, setSelectedMeas] = useState({});
  const { getUser } = useUser();
  console.log(useUser());
  const getMeasurableData = async () => {
    try {
      const response = await measurablesApi.getAllForPerson(getUser());
      setMeasurableData(response);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    try {
      getMeasurableData();
      console.log("REFRESHINGGGGG");
    } catch (error) {
      console.error(error.message);
    }
  }, [getUser()]);

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
      name: "Type",
      selector: (row) => row.meas_typ,
      sortable: true,
    },
    {
      name: "Units",
      selector: (row) => row.meas_unit,
      sortable: true,
    },
    {
      cell: (row) => (
        <EditButton // Swap to a edit modal for the measurables
          onClick={() => {
            setEditMeas(true);
            setSelectedMeas(row);
          }}
        >
          Edit
        </EditButton>
      ),
    },
    {
      cell: (row) => (
        <EditButton
          onClick={() => {
            setConfirmMeasDelete(true);
            setSelectedMeas(row);
          }}
        >
          Delete
        </EditButton>
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
      <MeasurableEditModal
        open={editMeas}
        onClose={() => setEditMeas(false)}
        measObj={selectedMeas}
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

export default Measurables;
