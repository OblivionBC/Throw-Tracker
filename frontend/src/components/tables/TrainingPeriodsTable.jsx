import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import DataTable from "../ui/DataTable/DataTable";
import {
  AddButton,
  EditButton,
} from "../../styles/design-system";
import ConfirmTRPEDelete from "../modals/ConfirmTRPEDelete";
import ProgramsModal from "../modals/ProgramsModal";
import { trainingPeriodsApi } from "../../api";
import { useDataChange } from "../contexts/DataChangeContext";
import { useApi } from "../../hooks/useApi";
import { useIsCoach, useSelectedAthlete } from "../../stores/userStore";
import { getPaginationNumber } from "../../utils/tableUtils";
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
      height: "20px",
      margin: "0 0px",
      padding: "0 0px",
    },
  },
};

const TrainingPeriodsTable = ({
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
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(600);
  const [trpeData, setTrpeData] = useState([]);
  const [deleteTRPEOpen, setDeleteTRPEOpen] = useState(false);
  const [programs, setPrograms] = useState(false);
  const [selectedTRPE, setSelectedTRPE] = useState({});
  const { apiCall } = useApi();
  const isCoach = useIsCoach();
  const selectedAthlete = useSelectedAthlete();
  const navigate = useNavigate();

  const {
    isCacheValid,
    setCacheData,
    setCacheLoading,
    getCachedData,
    invalidateCache,
    refreshFlags,
  } = useDataChange();

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        setContainerHeight(containerRef.current.clientHeight);
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);
    return () => window.removeEventListener("resize", updateHeight);
  }, []);

  const optimalPagination = getPaginationNumber(paginationNum, containerHeight);
  const isSelectable = selectable !== undefined ? selectable : false;

  const getPersonForTrainingPeriods = () => {
    if (isCoach) {
      return selectedAthlete || prsn_rk;
    } else {
      return prsn_rk;
    }
  };

  const getTRPEData = async (forceRefresh = false) => {
    const personId = getPersonForTrainingPeriods();
    const cacheKey = isCoach
      ? `trpe_coach_${selectedAthlete || "no_athlete"}`
      : `trpe_${personId}`;

    if (!forceRefresh && isCacheValid(cacheKey)) {
      const cachedData = getCachedData(cacheKey);
      if (cachedData && cachedData.data) {
        setTrpeData(cachedData.data);
        return;
      }
    }

    setCacheLoading(cacheKey, true);

    try {
      let response;

      if (isCoach && !selectedAthlete) {
        response = [];
      } else {
        response = await apiCall(
          () => trainingPeriodsApi.getAllForPerson(personId),
          `Fetching training periods for person ${personId}`
        );
      }

      setTrpeData(response);
      setCacheData(cacheKey, response);
    } catch (error) {
      Logger.error(error.message);
    } finally {
      setCacheLoading(cacheKey, false);
    }
  };

  const personRefreshFlag = refreshFlags[prsn_rk];

  useEffect(() => {
    getTRPEData();
  }, [isCoach, selectedAthlete, prsn_rk, personRefreshFlag, apiCall, isCacheValid, getCachedData, setCacheLoading, setCacheData]);

  const handleRefresh = () => {
    getTRPEData(true);
  };

  const handleDataChange = () => {
    const personId = getPersonForTrainingPeriods();
    invalidateCache(personId);
    getTRPEData(true);
  };

  const handleChange = ({ selectedRows }) => {
    if (selectedRows && setSharedState) {
      const ids = selectedRows?.map((row) => row.trpe_rk);
      setSharedState(ids);
    }
  };

  const handleRowClick = (row) => {
    if (bEdit) {
      navigate(`/training-periods/${row.trpe_rk}/edit`);
    }
  };

  const columns = [
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

  if (bEdit === true || bDelete === true || bPrograms === true) {
    columns.push({
      name: "Actions",
      cell: (row) => (
        <div style={{ display: "flex", gap: "5px" }}>
          {bEdit === true && (
            <EditButton
              $size="sm"
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/training-periods/${row.trpe_rk}/edit`);
              }}
            >
              Edit
            </EditButton>
          )}
          {bDelete === true && (
            <EditButton
              $size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setDeleteTRPEOpen(true);
                setSelectedTRPE(row);
              }}
            >
              Delete
            </EditButton>
          )}
          {bPrograms === true && (
            <EditButton
              $size="sm"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedTRPE(row);
                setPrograms(true);
              }}
            >
              Programs
            </EditButton>
          )}
        </div>
      ),
    });
  }

  const actions = (
    <>
      {bAdd === true && (
        <AddButton onClick={() => navigate("/training-periods/new")}>
          Add
        </AddButton>
      )}
      <AddButton onClick={handleRefresh}>Refresh</AddButton>
    </>
  );

  return (
    <div ref={containerRef}>
      {deleteTRPEOpen && (
        <ConfirmTRPEDelete
          open={deleteTRPEOpen}
          onClose={() => setDeleteTRPEOpen(false)}
          trpeObj={selectedTRPE}
          refresh={handleDataChange}
        />
      )}
      {programs && selectedTRPE && selectedTRPE.trpe_rk && (
        <ProgramsModal
          open={programs}
          onClose={() => setPrograms(false)}
          trpe_rk={selectedTRPE.trpe_rk}
        />
      )}
      <DataTable
        title="Training Periods"
        columns={columns}
        data={trpeData}
        loading={false}
        pagination={{ page: 1, perPage: optimalPagination }}
        onRowClick={bEdit ? handleRowClick : undefined}
        actions={actions}
        customStyles={TableStyles}
        defaultSortFieldId="Start"
        defaultSortAsc={false}
        selectableRows={isSelectable}
        onSelectedRowsChange={isSelectable ? handleChange : undefined}
      />
    </div>
  );
};

export default TrainingPeriodsTable;

