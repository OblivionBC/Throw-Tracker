import React, { useEffect, useState, useRef, startTransition } from "react";
import { useNavigate } from "react-router-dom";
import DataTable from "../ui/DataTable/DataTable";
import {
  AddButton,
  EditButton,
} from "../../styles/design-system";
import dayjs from "dayjs";
import ConfirmPracDeleteModal from "../modals/ConfirmPracDeleteModal";
import { practicesApi, trainingPeriodsApi } from "../../api";
import { useDataChange } from "../contexts/DataChangeContext";
import { useIsCoach, useSelectedAthlete } from "../../stores/userStore";
import { getPaginationNumber } from "../../utils/tableUtils";
import Logger from "../../utils/logger";
import styled from "styled-components";

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
  headRow: { style: { minHeight: "25px", maxHeight: "40px" } },
};

const FilterSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white;
  font-size: 14px;
  min-width: 200px;
`;

const PracticesTable = ({
  trpe_rk,
  bAdd,
  bDetail,
  bDelete,
  paginationNum: propPaginationNum,
}) => {
  const containerRef = useRef(null);
  const [containerHeight, setContainerHeight] = useState(600);
  const [practiceData, setPracticeData] = useState([]);
  const [confirmPracDelete, setConfirmPracDelete] = useState(false);
  const [selectedPrac, setSelectedPrac] = useState({});
  const [trainingPeriods, setTrainingPeriods] = useState([]);
  const [selectedTrainingPeriod, setSelectedTrainingPeriod] = useState("");
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

  const loadTrainingPeriods = async () => {
    try {
      const periods = await trainingPeriodsApi.getAll();
      setTrainingPeriods(periods);
    } catch (error) {
      Logger.error("Error loading training periods:", error);
    }
  };

  useEffect(() => {
    loadTrainingPeriods();
  }, []);

  const getPracticeData = async (forceRefresh = false) => {
    const cacheKey = `practices_${selectedAthlete || "all"}_${selectedTrainingPeriod || "all"}`;

    if (!forceRefresh && isCacheValid(cacheKey)) {
      const cachedData = getCachedData(cacheKey);
      if (cachedData && cachedData.data) {
        setPracticeData(cachedData.data);
        return;
      }
    }

    setCacheLoading(cacheKey, true);

    try {
      let response;

      if (isCoach) {
        if (!selectedAthlete) {
          response = [];
        } else {
          response = await practicesApi.getAllForCoach();
          response = response.filter(
            (practice) =>
              String(practice.athlete_prsn_rk) === String(selectedAthlete)
          );

          if (selectedTrainingPeriod) {
            response = response.filter(
              (practice) =>
                String(practice.trpe_rk) === String(selectedTrainingPeriod)
            );
          } else if (trpe_rk) {
            response = response.filter(
              (practice) => String(practice.trpe_rk) === String(trpe_rk)
            );
          }
        }
      } else {
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
  };

  useEffect(() => {
    getPracticeData();
  }, [isCoach, selectedAthlete, selectedTrainingPeriod, trpe_rk, refreshFlags.practices, isCacheValid, getCachedData, setCacheLoading, setCacheData]);

  const handleRefresh = () => {
    getPracticeData(true);
  };

  const handleDataChange = () => {
    invalidateCache("practices");
  };

  const handleTrainingPeriodChange = (event) => {
    startTransition(() => {
      setSelectedTrainingPeriod(event.target.value);
    });
  };

  const handleRowClick = (row) => {
    if (bDetail) {
      navigate(`/practices/${row.prac_rk}`);
    }
  };

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

  if (bDetail || bDelete) {
    columns.push({
      name: "Actions",
      cell: (row) => (
        <div style={{ display: "flex", gap: "5px" }}>
          {bDetail && (
            <EditButton
              $size="sm"
              onClick={(e) => {
                e.stopPropagation();
                handleRowClick(row);
              }}
            >
              Details
            </EditButton>
          )}
          {bDelete && (
            <EditButton
              $size="sm"
              onClick={(e) => {
                e.stopPropagation();
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

  const actions = (
    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
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
      {bAdd && <AddButton onClick={() => navigate("/practices/new")}>Add</AddButton>}
      <AddButton onClick={handleRefresh}>Refresh</AddButton>
    </div>
  );

  return (
    <div ref={containerRef}>
      {confirmPracDelete && (
        <ConfirmPracDeleteModal
          open={confirmPracDelete}
          onClose={() => setConfirmPracDelete(false)}
          pracObj={selectedPrac}
          refresh={handleDataChange}
        />
      )}
      <DataTable
        title="Practices"
        columns={columns}
        data={practiceData}
        loading={false}
        pagination={{ page: 1, perPage: optimalPagination }}
        onRowClick={bDetail ? handleRowClick : undefined}
        actions={actions}
        customStyles={TableStyles}
        paginationRowsPerPageOptions={[2, 4, 7, 10]}
      />
    </div>
  );
};

export default PracticesTable;

