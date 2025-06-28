import React, { useEffect, useState } from "react";
import {
  Table,
  TableWrap,
  Title,
  CompWrap,
  AddButton,
} from "../../styles/styles.js";
import { useUser } from "../contexts/UserContext";
import AthleteDetails from "../modals/AthleteDetails";
import { athletesApi } from "../../api";
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

  const getAthleteData = async () => {
    try {
      const response = await athletesApi.getForCoach(user.prsn_rk);
      setExcrData(response);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    try {
      getAthleteData();
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

export default AthleteList;
