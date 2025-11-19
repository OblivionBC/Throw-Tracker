import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../ui/DataTable/DataTable";
import {
  AddButton,
  EditButton,
  StyledButton,
} from "../../styles/design-system";
import { meetsApi } from "../../api";
import dayjs from "dayjs";
import Logger from "../../utils/logger";

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

const MeetsTable = () => {
  const [meetData, setMeetData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getMeetData = async () => {
    setLoading(true);
    try {
      const response = await meetsApi.getForCoachOrg();
      setMeetData(response);
    } catch (error) {
      Logger.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getMeetData();
  }, []);


  const handleRowClick = (row) => {
    navigate(`/meets/${row.meet_rk}`);
  };

  const columns = [
    {
      name: "Name",
      selector: (row) => row.meet_nm,
      sortable: true,
    },
    {
      name: "Date Range",
      selector: (row) => row.meet_start_dt || row.meet_dt,
      cell: (row) => (
        <div>
          {row.meet_start_dt && row.meet_end_dt ? (
            <>
              {dayjs(row.meet_start_dt).format("MMM D")} -{" "}
              {dayjs(row.meet_end_dt).format("MMM D, YYYY")}
            </>
          ) : row.meet_dt ? (
            dayjs(row.meet_dt).format("MMM D, YYYY")
          ) : (
            "No date"
          )}
        </div>
      ),
      sortable: true,
    },
    {
      name: "Location",
      selector: (row) => row.meet_location || "N/A",
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div style={{ display: "flex", gap: "5px" }}>
          <EditButton
            $size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/meets/${row.meet_rk}/edit`);
            }}
          >
            Edit
          </EditButton>
          <StyledButton
            $size="sm"
            onClick={(e) => {
              e.stopPropagation();
              handleRowClick(row);
            }}
          >
            View
          </StyledButton>
        </div>
      ),
    },
  ];

  const actions = (
    <AddButton onClick={() => navigate("/meets/new")}>Create Meet</AddButton>
  );

  return (
    <DataTable
        title="Meets"
        columns={columns}
        data={meetData}
        loading={loading}
        pagination={{ page: 1, perPage: 10 }}
        onRowClick={handleRowClick}
        actions={actions}
        customStyles={TableStyles}
      />
    </>
  );
};

export default MeetsTable;

