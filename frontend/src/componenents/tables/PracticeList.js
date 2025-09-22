import React, { useEffect, useState, useRef, useCallback } from "react";
import {
  Table,
  TableWrap,
  RowDiv,
  Title,
  CompWrap,
  AddButton,
  EditButton,
} from "../../styles/design-system";
import dayjs from "dayjs";
import PracticeDetailsModal from "../modals/PracticeDetailsModal";
import ConfirmPracDeleteModal from "../modals/ConfirmPracDeleteModal";
import AddPracticeModal from "../modals/AddPracticeModal";
import { practicesApi, trainingPeriodsApi } from "../../api";
import { useDataChange } from "../contexts/DataChangeContext";
import { useIsCoach, useSelectedAthlete } from "../../stores/userStore";
import useUserStore from "../../stores/userStore";
import { getPaginationNumber } from "../../utils/tableUtils";
import Logger from "../../utils/logger";
import styled from "styled-components";

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

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
`;

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  min-width: 200px;
`;

const Practices = ({
  trpe_rk,
  bAdd,
  bDetail,
  bDelete,
  paginationNum: propPaginationNum,
}) => {
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(600);
  const [practiceData, setPracticeData] = useState([]);
  const [addPracticeOpen, setAddPracticeOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [confirmPracDelete, setConfirmPracDelete] = useState(false);
  const [selectedPrac, setSelectedPrac] = useState({});
  const [trainingPeriods, setTrainingPeriods] = useState([]);
  const [selectedTrainingPeriod, setSelectedTrainingPeriod] = useState("");
  const isCoach = useIsCoach();
  const selectedAthlete = useSelectedAthlete();
  const getUserId = useUserStore((state) => state.getUserId);

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

  // Load training periods
  const loadTrainingPeriods = useCallback(async () => {
    try {
      let personId;
      if (isCoach) {
        // For coaches, use selected athlete if available
        personId = selectedAthlete;
      } else {
        // For athletes, get their own training periods
        personId = getUserId();
      }

      if (personId) {
        const response = await trainingPeriodsApi.getAllForPerson(personId);
        setTrainingPeriods(response);
      } else {
        setTrainingPeriods([]);
      }
    } catch (error) {
      Logger.error("Error loading training periods:", error);
      setTrainingPeriods([]);
    }
  }, [isCoach, selectedAthlete, getUserId]);

  useEffect(() => {
    loadTrainingPeriods();
  }, [loadTrainingPeriods]);

  const getPracticeData = useCallback(
    async (forceRefresh = false) => {
      // Create cache key that includes athlete selection for coaches
      const cacheKey = isCoach
        ? `practices_coach_${selectedAthlete || "no_athlete"}_${
            selectedTrainingPeriod || trpe_rk || "all"
          }`
        : `practices_${selectedTrainingPeriod || trpe_rk || "all"}`;

      // Check if we have valid cached data and don't need to force refresh
      if (!forceRefresh && isCacheValid(cacheKey)) {
        const cachedData = getCachedData(cacheKey);
        if (cachedData && cachedData.data) {
          setPracticeData(cachedData.data);
          return;
        }
      }

      // Set loading state
      setCacheLoading(cacheKey, true);

      try {
        let response;

        if (isCoach) {
          // For coaches, always get all practices for their athletes
          if (!selectedAthlete) {
            // No athlete selected, show empty data
            response = [];
          } else {
            // Get all practices for coach's athletes
            response = await practicesApi.getAllForCoach();

            // Filter by selected athlete
            response = response.filter(
              (practice) =>
                String(practice.athlete_prsn_rk) === String(selectedAthlete)
            );

            // If a training period is selected, also filter by that
            if (selectedTrainingPeriod) {
              response = response.filter(
                (practice) =>
                  String(practice.trpe_rk) === String(selectedTrainingPeriod)
              );
            } else if (trpe_rk) {
              // If trpe_rk prop is provided, filter by that
              response = response.filter(
                (practice) => String(practice.trpe_rk) === String(trpe_rk)
              );
            }
          }
        } else {
          // For athletes, use existing logic
          if (selectedTrainingPeriod) {
            response = await practicesApi.getInTrainingPeriod(
              selectedTrainingPeriod
            );
          } else if (trpe_rk) {
            response = await practicesApi.getInTrainingPeriod(trpe_rk);
          } else {
            response = await practicesApi.getAll();
          }
        }

        setPracticeData(response);
        setCacheData(cacheKey, response);
      } catch (error) {
        Logger.error(error.message);
      } finally {
        setCacheLoading(cacheKey, false);
      }
    },
    [isCoach, selectedAthlete, selectedTrainingPeriod, trpe_rk]
  );

  useEffect(() => {
    getPracticeData();
  }, [getPracticeData, refreshFlags.practices]);

  const handleRefresh = () => {
    getPracticeData(true);
  };

  const handleDataChange = () => {
    invalidateCache("practices");
  };

  const handleTrainingPeriodChange = (event) => {
    setSelectedTrainingPeriod(event.target.value);
  };

  // Calculate optimal pagination
  const optimalPagination = getPaginationNumber(
    propPaginationNum,
    containerHeight
  );
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
      selector: (row) => selectedTrainingPeriod || trpe_rk || row.trpe_rk,
      sortable: true,
    },
  ];

  // Add Actions column if any action buttons are enabled
  if (bDetail || bDelete) {
    columns.push({
      name: "Actions",
      cell: (row) => (
        <div style={{ display: "flex", gap: "5px" }}>
          {bDetail && (
            <EditButton
              $size="sm"
              onClick={() => {
                setDetailModalOpen(true);
                setSelectedPrac(row);
              }}
            >
              Details
            </EditButton>
          )}
          {bDelete && (
            <EditButton
              $size="sm"
              onClick={() => {
                setConfirmPracDelete(true);
                setSelectedPrac(row);
              }}
            >
              Delete
            </EditButton>
          )}
        </div>
      ),
    });
  }
  return (
    <CompWrap ref={containerRef}>
      {detailModalOpen && (
        <PracticeDetailsModal
          open={detailModalOpen}
          onClose={() => setDetailModalOpen(false)}
          pracObj={selectedPrac}
          refresh={handleDataChange}
        />
      )}
      {confirmPracDelete && (
        <ConfirmPracDeleteModal
          open={confirmPracDelete}
          onClose={() => setConfirmPracDelete(false)}
          pracObj={selectedPrac}
          refresh={handleDataChange}
        />
      )}
      {addPracticeOpen && (
        <AddPracticeModal
          open={addPracticeOpen}
          onClose={() => setAddPracticeOpen(false)}
          refresh={handleDataChange}
        />
      )}
      <RowDiv>
        <Title>Practices</Title>
        <FilterContainer>
          {/* Only show training period filter if no specific trpe_rk is provided */}
          {!trpe_rk && (
            <FilterSelect
              value={selectedTrainingPeriod}
              onChange={handleTrainingPeriodChange}
            >
              <option value="">All Training Periods</option>
              {trainingPeriods.map((period) => (
                <option key={period.trpe_rk} value={period.trpe_rk}>
                  {dayjs(period.trpe_start_dt).format("MMM D YYYY")} -
                  {period.trpe_end_dt
                    ? dayjs(period.trpe_end_dt).format("MMM D YYYY")
                    : "Ongoing"}
                </option>
              ))}
            </FilterSelect>
          )}
          {bAdd ? (
            <AddButton onClick={() => setAddPracticeOpen(true)}>Add</AddButton>
          ) : null}
          <AddButton onClick={handleRefresh}>Refresh</AddButton>
        </FilterContainer>
      </RowDiv>

      <TableWrap>
        <Table
          columns={columns}
          data={practiceData}
          pagination
          paginationPerPage={optimalPagination}
          paginationRowsPerPageOptions={[2, 4, 7, 10]}
          paginationComponentOptions={{
            rowsPerPageText: "Rows",
            rangeSeparatorText: "of",
            selectAllRowsItem: false,
          }}
          customStyles={TableStyles}
          key={optimalPagination}
        />
      </TableWrap>
    </CompWrap>
  );
};

export default Practices;
