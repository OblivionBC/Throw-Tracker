import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "typeface-nunito";
import DataTable from "react-data-table-component";
import dayjs from "dayjs";
import PracticeDetailsModal from "../modals/PracticeDetailsModal";
import ConfirmPracDeleteModal from "../modals/ConfirmPracDeleteModal";
import AddPracticeModal from "../modals/AddPracticeModal";
import { useUser } from "../contexts/UserContext";
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

const Practices = ({ trpe_rk, paginationNum, bAdd, bDetail, bDelete }) => {
  const [practiceData, setPracticeData] = useState([]);
  const [addPracticeOpen, setAddPracticeOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [confirmPracDelete, setConfirmPracDelete] = useState(false);
  const [selectedPrac, setSelectedPrac] = useState({});
  const { getUser } = useUser();
  const getPracticeData = async () => {
    try {
      let response;
      //If the training period was passed in, we want to get the practices only from the training period
      if (trpe_rk) {
        response = await fetch(
          `http://localhost:5000/api/get-practicesInTrpe`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              trpe_rk: trpe_rk,
            }),
          }
        );
      } else {
        //No Training Period was specified so get all for the person
        console.log("Getting All for Person");
        response = await fetch(`http://localhost:5000/api/get-all-practices`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            prsn_rk: getUser(),
          }),
        });
      }

      const jsonData = await response.json();
      setPracticeData(jsonData.rows);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    try {
      getPracticeData();
    } catch (error) {
      console.error(error.message);
    }
  }, [getUser()]);

  if (paginationNum <= 0) paginationNum = 8;
  const columns = [
    {
      name: "ID",
      selector: (row) => row.prac_rk,
      sortable: true,
      //width: "9%",
    },
    {
      name: "Date",
      cell: (row) => <div>{dayjs(row.prac_dt).format("MMM D YYYY")}</div>,
      selector: (row) => row.prac_dt,
      sortable: true,
      //width: "15%",
    },
    {
      name: "Measurables",
      selector: (row) => row.measurement_count,
      sortable: true,
      //width: "15%",
    },
    {
      name: "TRPE",
      selector: (row) => trpe_rk || row.trpe_rk,
      sortable: true,
      //width: "10%",
    },
  ];

  if (bDetail)
    columns.push({
      cell: (row) => (
        <Detail
          onClick={() => {
            setDetailModalOpen(true);
            setSelectedPrac(row);
          }}
          style={{ display: "block" }}
        >
          Details
        </Detail>
      ),
    });
  if (bDelete)
    columns.push({
      cell: (row) => (
        <DeleteButton
          onClick={() => {
            setConfirmPracDelete(true);
            setSelectedPrac(row);
          }}
        >
          Delete
        </DeleteButton>
      ),
    });
  return (
    <CompWrap>
      <PracticeDetailsModal
        open={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        pracObj={selectedPrac}
        refresh={() => getPracticeData()}
      />
      <ConfirmPracDeleteModal
        open={confirmPracDelete}
        onClose={() => setConfirmPracDelete(false)}
        pracObj={selectedPrac}
        refresh={() => getPracticeData()}
      />
      <AddPracticeModal
        open={addPracticeOpen}
        onClose={() => setAddPracticeOpen(false)}
        refresh={() => getPracticeData()}
      />
      <RowDiv>
        <Title>Practices</Title>
        {bAdd ? (
          <AddButton onClick={() => setAddPracticeOpen(true)}>Add</AddButton>
        ) : null}
        <AddButton onClick={() => getPracticeData()}>Refresh</AddButton>
      </RowDiv>

      <TableWrap>
        <Table
          columns={columns}
          data={practiceData}
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

export default Practices;
