import React, { useEffect, useState } from "react";
import styled from "styled-components";
import "typeface-nunito";
import DataTable from "react-data-table-component";
import { useUser } from "../contexts/UserContext";
import AthleteDetails from "../modals/AthleteDetails";
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

const AthleteList = ({ paginationNum }) => {
  const [excrData, setExcrData] = useState([]);
  const [programOpen, setProgramOpen] = useState(false);
  const [selectedPrsn, setSelectedPrsn] = useState();
  const { user } = useUser();
  let pagination = 3;
  paginationNum === undefined ? (pagination = 3) : (pagination = paginationNum);

  const getExerciseData = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/athletes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          coach_prsn_rk: user.prsn_rk,
          org_name: user.org_name,
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
      name: "Name",
      selector: (row) => row.prsn_first_nm + " " + row.prsn_last_nm,
      sortable: true,
    },
    {
      name: "Organization",
      selector: (row) => row.org_name,
      sortable: true,
    },
    {
      name: "Email",
      selector: (row) => row.prsn_email,
      sortable: true,
    },
    {
      cell: (row) => (
        <AddButton
          onClick={() => {
            setSelectedPrsn(row);
            setProgramOpen(true);
          }}
        >
          Details
        </AddButton>
      ),
    },
  ];
  return (
    <CompWrap>
      <AthleteDetails
        athlete={selectedPrsn}
        open={programOpen}
        onClose={() => setProgramOpen(false)}
      />
      <Title>Athletes</Title>
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
const AddButton = styled.button`
  background: linear-gradient(45deg, #808080 30%, white 95%);
  border: none;
  border-radius: 25px;
  color: white;
  padding: 3px 15px;
  font-size: 14px;
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
export default AthleteList;
