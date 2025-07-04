import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import {
  Table,
  TableWrap,
  RowDiv,
  Title,
  CompWrap,
  AddButton,
  EditButton,
} from "../../styles/styles.js";
import ConfirmTRPEDelete from "../modals/ConfirmTRPEDelete";
import AddTRPEModal from "../modals/AddTRPEModal";
import TrainingPeriodEditModal from "../modals/TrainingPeriodEditModal";
import ProgramsModal from "../modals/ProgramsModal";
import { trainingPeriodsApi } from "../../api";

const TableStyles = {
  pagination: {
    style: {
      minHeight: "30px", // Adjust the height as needed
      padding: "0 0px",
      margin: "0 0px",
    },
    pageButtonsStyle: {
      minWidth: "30px", // Adjust the width as needed
      height: "20px", // Adjust the height as needed
      margin: "0 0px",
      padding: "0 0px",
    },
  },
};

const TrainingPeriodList = ({
  prsn_rk,
  bAdd,
  bEdit,
  bDelete,
  paginationNum,
  sharedState,
  bPrograms,
  selectable,
  setSharedState,
}) => {
  const [trpeData, setTrpeData] = useState([]);
  const [addTRPEOpen, setAddTRPEOpen] = useState(false);
  const [deleteTRPEOpen, setDeleteTRPEOpen] = useState(false);
  const [programs, setPrograms] = useState(false);
  const [editTRPEOpen, setEditTRPEOpen] = useState(false);
  const [selectedTRPE, setSelectedTRPE] = useState({});
  let pagination = 3;
  paginationNum === undefined ? (pagination = 3) : (pagination = paginationNum);
  selectable === undefined ? (selectable = false) : (selectable = true);
  const getTRPEData = async () => {
    try {
      const response = await trainingPeriodsApi.getAllForPerson();
      setTrpeData(response);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    try {
      getTRPEData();
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  const handleChange = ({ selectedRows }) => {
    if (selectedRows) {
      const ids = selectedRows?.map((row) => {
        return row.trpe_rk;
      });
      if (setSharedState) setSharedState(ids);
    }
  };
  const columns = [
    /* {
      name: "ID",
      selector: (row) => row.trpe_rk,
      sortable: true,
    },*/
    {
      name: "Start",
      selector: (row) => row.trpe_start_dt,
      cell: (row) => <div>{dayjs(row.trpe_start_dt).format("MMM D YYYY")}</div>,
      sortable: true,
    },
    {
      name: "End",
      selector: (row) => row.trpe_end_dt,
      cell: (row) =>
        row.trpe_end_dt === null ? (
          ""
        ) : (
          <div>{dayjs(row.trpe_end_dt).format("MMM D YYYY")}</div>
        ),
      sortable: true,
    },
  ];
  if (bEdit === true)
    columns.push({
      cell: (row) => (
        <EditButton
          onClick={() => {
            setEditTRPEOpen(true);
            setSelectedTRPE(row);
          }}
        >
          Edit
        </EditButton>
      ),
    });
  if (bDelete === true)
    columns.push({
      cell: (row) => (
        <EditButton
          onClick={() => {
            setDeleteTRPEOpen(true);
            setSelectedTRPE(row);
          }}
        >
          Delete
        </EditButton>
      ),
    });
  if (bPrograms === true)
    columns.push({
      cell: (row) => (
        <EditButton
          onClick={() => {
            setSelectedTRPE(row);
            setPrograms(true);
          }}
        >
          Programs
        </EditButton>
      ),
    });
  //Add the Detail/Edit modal now
  return (
    <CompWrap>
      <ConfirmTRPEDelete
        open={deleteTRPEOpen}
        onClose={() => setDeleteTRPEOpen(false)}
        trpeObj={selectedTRPE}
        refresh={() => getTRPEData()}
      />
      <AddTRPEModal
        open={addTRPEOpen}
        onClose={() => setAddTRPEOpen(false)}
        refresh={() => getTRPEData()}
      />
      <TrainingPeriodEditModal
        open={editTRPEOpen}
        onClose={() => setEditTRPEOpen(false)}
        refresh={() => getTRPEData()}
        trpeObj={selectedTRPE}
      />
      <ProgramsModal
        open={programs}
        onClose={() => setPrograms(false)}
        trpe_rk={selectedTRPE.trpe_rk}
      />
      <RowDiv>
        <Title>Training Periods</Title>
        {bAdd === true && (
          <AddButton onClick={() => setAddTRPEOpen(true)}>Add</AddButton>
        )}
        <AddButton onClick={() => getTRPEData()}>Refresh</AddButton>
      </RowDiv>
      <TableWrap>
        <Table
          columns={columns}
          data={trpeData}
          pagination
          paginationPerPage={pagination}
          paginationComponentOptions={{
            rowsPerPageText: "Rows per page:",
            rangeSeparatorText: "of",
            selectAllRowsItem: false,
          }}
          customStyles={TableStyles}
          defaultSortFieldId="Start"
          defaultSortAsc={false}
          selectableRows={selectable}
          onSelectedRowsChange={handleChange}
        />
      </TableWrap>
    </CompWrap>
  );
};

export default TrainingPeriodList;
