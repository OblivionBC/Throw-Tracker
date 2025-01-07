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
        <EditButton
          onClick={() => {
            setDetailModalOpen(true);
            setSelectedPrac(row);
          }}
          style={{ display: "block" }}
        >
          Details
        </EditButton>
      ),
    });
  if (bDelete)
    columns.push({
      cell: (row) => (
        <EditButton
          onClick={() => {
            setConfirmPracDelete(true);
            setSelectedPrac(row);
          }}
        >
          Delete
        </EditButton>
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

export default Practices;
