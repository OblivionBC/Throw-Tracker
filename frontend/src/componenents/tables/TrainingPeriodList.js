import React, { useEffect, useState, useRef, useCallback } from "react";
import dayjs from "dayjs";
import {
  Table,
  TableWrap,
  RowDiv,
  Title,
  CompWrap,
  AddButton,
  EditButton,
} from "../../styles/design-system";
import ConfirmTRPEDelete from "../modals/ConfirmTRPEDelete";
import AddTRPEModal from "../modals/AddTRPEModal";
import TrainingPeriodEditModal from "../modals/TrainingPeriodEditModal";
import ProgramsModal from "../modals/ProgramsModal";
import { trainingPeriodsApi } from "../../api";
import { useDataChange } from "../contexts/DataChangeContext";
import { useApi } from "../../hooks/useApi";
import { useIsCoach, useSelectedAthlete } from "../../stores/userStore";
import { getPaginationNumber } from "../../utils/tableUtils";

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
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(600);
  const [trpeData, setTrpeData] = useState([]);
  const [addTRPEOpen, setAddTRPEOpen] = useState(false);
  const [deleteTRPEOpen, setDeleteTRPEOpen] = useState(false);
  const [programs, setPrograms] = useState(false);
  const [editTRPEOpen, setEditTRPEOpen] = useState(false);
  const [selectedTRPE, setSelectedTRPE] = useState({});
  const { apiCall } = useApi();
  const isCoach = useIsCoach();
  const selectedAthlete = useSelectedAthlete();
  const {
    isCacheValid,
    setCacheData,
    setCacheLoading,
    getCachedData,
    invalidateCache,
    refreshFlags,
  } = useDataChange();

  // Update container height on mount and resize
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

  // Calculate optimal pagination
  const optimalPagination = getPaginationNumber(paginationNum, containerHeight);
  selectable === undefined ? (selectable = false) : (selectable = true);

  // Determine which person to get training periods for
  const getPersonForTrainingPeriods = useCallback(() => {
    if (isCoach) {
      // For coaches, use selected athlete if available, otherwise use provided prsn_rk
      return selectedAthlete || prsn_rk;
    } else {
      // For athletes, use provided prsn_rk
      return prsn_rk;
    }
  }, [isCoach, selectedAthlete, prsn_rk]);

  const getTRPEData = useCallback(
    async (forceRefresh = false) => {
      const personId = getPersonForTrainingPeriods();

      // Create cache key that includes athlete selection for coaches
      const cacheKey = isCoach
        ? `trpe_coach_${selectedAthlete || "no_athlete"}`
        : `trpe_${personId}`;

      // Check if we have valid cached data and don't need to force refresh
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
          // No athlete selected for coach, show empty data
          response = [];
        } else {
          // Get training periods for the determined person
          response = await apiCall(
            () => trainingPeriodsApi.getAllForPerson(personId),
            `Fetching training periods for person ${personId}`
          );
        }

        setTrpeData(response);
        setCacheData(cacheKey, response);
      } catch (error) {
        console.error(error.message);
      } finally {
        setCacheLoading(cacheKey, false);
      }
    },

    [
      getPersonForTrainingPeriods,
      isCoach,
      selectedAthlete,
      apiCall,
      isCacheValid,
      getCachedData,
      setCacheLoading,
      setCacheData,
    ]
  );

  // Extract the complex expression from dependency array
  const personRefreshFlag = refreshFlags[prsn_rk];

  useEffect(() => {
    getTRPEData();
  }, [getTRPEData, personRefreshFlag]);

  const handleRefresh = () => {
    getTRPEData(true);
  };

  const handleDataChange = () => {
    const personId = getPersonForTrainingPeriods();
    invalidateCache(personId);
    getTRPEData(true); // Force refresh the data
  };
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
  // Add Actions column if any action buttons are enabled
  if (bEdit === true || bDelete === true || bPrograms === true) {
    columns.push({
      name: "Actions",
      cell: (row) => (
        <div style={{ display: "flex", gap: "5px" }}>
          {bEdit === true && (
            <EditButton
              $size="sm"
              onClick={() => {
                setEditTRPEOpen(true);
                setSelectedTRPE(row);
              }}
            >
              Edit
            </EditButton>
          )}
          {bDelete === true && (
            <EditButton
              $size="sm"
              onClick={() => {
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
              onClick={() => {
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
  //Add the Detail/Edit modal now
  return (
    <CompWrap ref={containerRef}>
      {deleteTRPEOpen && (
        <ConfirmTRPEDelete
          open={deleteTRPEOpen}
          onClose={() => setDeleteTRPEOpen(false)}
          trpeObj={selectedTRPE}
          refresh={handleDataChange}
        />
      )}
      {addTRPEOpen && (
        <AddTRPEModal
          open={addTRPEOpen}
          onClose={() => setAddTRPEOpen(false)}
          refresh={handleDataChange}
        />
      )}
      {editTRPEOpen && selectedTRPE && selectedTRPE.trpe_rk && (
        <TrainingPeriodEditModal
          open={editTRPEOpen}
          onClose={() => setEditTRPEOpen(false)}
          refresh={handleDataChange}
          trpeObj={selectedTRPE}
        />
      )}
      {programs && selectedTRPE && selectedTRPE.trpe_rk && (
        <ProgramsModal
          open={programs}
          onClose={() => setPrograms(false)}
          trpe_rk={selectedTRPE.trpe_rk}
        />
      )}
      <RowDiv>
        <Title>Training Periods</Title>
        {bAdd === true && (
          <AddButton onClick={() => setAddTRPEOpen(true)}>Add</AddButton>
        )}
        <AddButton onClick={handleRefresh}>Refresh</AddButton>
      </RowDiv>
      <TableWrap>
        <Table
          columns={columns}
          data={trpeData}
          pagination
          paginationPerPage={optimalPagination}
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
