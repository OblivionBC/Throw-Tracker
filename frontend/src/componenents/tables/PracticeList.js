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
import { practicesApi } from "../../api";

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
  headRow: { style: { minHeight: "25px", maxHeight: "40px" } }, // Set your desired height here
};

const Practices = ({ trpe_rk, bAdd, bDetail, bDelete }) => {
  const [practiceData, setPracticeData] = useState([]);
  const [addPracticeOpen, setAddPracticeOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [confirmPracDelete, setConfirmPracDelete] = useState(false);
  const [selectedPrac, setSelectedPrac] = useState({});
  const [paginationNum, setPaginationNum] = useState(4);

  const { getUser } = useUser();
  const updateVisibleRows = () => {
    const height = window.innerHeight;
    console.log(window.innerHeight);
    console.log("Calling Update Rows");
    let newPaginationNum;
    if (height < 400) {
      newPaginationNum = 1;
      console.log("Set to 2");
    } else if (height < 600) {
      newPaginationNum = 2;
      console.log("Set to 4");
    } else if (height < 800) {
      newPaginationNum = 4;
      console.log("Set to 4");
    } else {
      newPaginationNum = 7;
      console.log("Set to 7");
    }
    console.log("Pagination is " + paginationNum);
    setPaginationNum(newPaginationNum);
  };
  useEffect(() => {
    window.addEventListener("resize", updateVisibleRows);
    updateVisibleRows();
    return () => window.removeEventListener("resize", updateVisibleRows);
  }, []);

  const getPracticeData = async () => {
    try {
      let response;
      //If the training period was passed in, we want to get the practices only from the training period
      if (trpe_rk) {
        response = await practicesApi.getForTRPE(trpe_rk);
      } else {
        //No Training Period was specified so get all for the person
        console.log("Getting All for Person");
        response = await practicesApi.getAllForPerson(getUser());
      }

      setPracticeData(response);
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
  }, [trpe_rk]);

  if (paginationNum <= 0) paginationNum = 8;
  const columns = [
    {
      name: "ID",
      selector: (row) => row.prac_rk,
      sortable: true,
    },
    {
      name: "Date",
      cell: (row) => <div>{dayjs(row.prac_dt).format("MMM D YYYY")}</div>,
      selector: (row) => row.prac_dt,
      sortable: true,
    },
    {
      name: "Measurables",
      selector: (row) => row.measurement_count,
      sortable: true,
    },
    {
      name: "TRPE",
      selector: (row) => trpe_rk || row.trpe_rk,
      sortable: true,
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
          paginationRowsPerPageOptions={[2, 4, 7, 10]}
          paginationComponentOptions={{
            rowsPerPageText: "Rows",
            rangeSeparatorText: "of",
            selectAllRowsItem: false,
          }}
          customStyles={TableStyles}
          key={paginationNum}
        />
      </TableWrap>
    </CompWrap>
  );
};

export default Practices;
