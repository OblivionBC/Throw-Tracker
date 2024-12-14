import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "typeface-nunito";
import DataTable from "react-data-table-component";
import dayjs from "dayjs";
import ConfirmTRPEDelete from "../modals/ConfirmTRPEDelete";
import AddTRPEModal from "../modals/AddTRPEModal";
import { useUser } from "../contexts/UserContext";
import TrainingPeriodEditModal from "../modals/TrainingPeriodEditModal";
import ProgramsModal from "../modals/ProgramsModal";

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
  const { getUser } = useUser();
  let pagination = 3;
  paginationNum === undefined ? (pagination = 3) : (pagination = paginationNum);
  selectable === undefined ? (selectable = false) : (selectable = true);
  let user = getUser();
  if (prsn_rk !== undefined) user = prsn_rk;
  const getTRPEData = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/get-all-trainingPeriods`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prsn_rk: user,
          }),
        }
      );
      const jsonData = await response.json();
      setTrpeData(jsonData.rows);
      console.log(trpeData);
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
  }, [getUser()]);

  const handleChange = ({ selectedRows }) => {
    if (selectedRows) {
      const ids = selectedRows?.map((row) => {
        return row.trpe_rk;
      });
      if (setSharedState) setSharedState(ids);
    }
  };
  const columns = [
    {
      name: "ID",
      selector: (row) => row.trpe_rk,
      sortable: true,
    },
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
        <DeleteButton
          onClick={() => {
            setEditTRPEOpen(true);
            setSelectedTRPE(row);
          }}
        >
          Edit
        </DeleteButton>
      ),
    });
  if (bDelete === true)
    columns.push({
      cell: (row) => (
        <DeleteButton
          onClick={() => {
            setDeleteTRPEOpen(true);
            setSelectedTRPE(row);
          }}
        >
          Delete
        </DeleteButton>
      ),
    });
  if (bPrograms === true)
    columns.push({
      cell: (row) => (
        <DeleteButton
          onClick={() => {
            setSelectedTRPE(row);
            setPrograms(true);
          }}
        >
          Programs
        </DeleteButton>
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
        prsn_rk={user}
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

const DeleteButton = styled.button`
  background: linear-gradient(45deg, black 30%, #808080 95%);
  border: none;
  border-radius: 25px;
  color: white;
  padding: 5px 10px;
  margin: 0px;
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
  margin: 0 0 5px 0;
  padding: 0;
  height: 15%;
`;
export default TrainingPeriodList;
