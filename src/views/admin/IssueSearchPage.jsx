import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import TopFilters from "./components/TopFilters";
import IssueTable from "./components/IssueTable";

const IssueSearchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Parse URL query params into filters object
  const getFiltersFromURL = () => {
    const params = new URLSearchParams(location.search);
    const filterObj = {};
    for (const [key, value] of params.entries()) {
      filterObj[key] = value;
    }
    return filterObj;
  };

  // Initialize filters from URL on mount
  const [filters, setFilters] = useState(getFiltersFromURL());

  // Update filters state whenever URL changes (e.g., back/forward)
  useEffect(() => {
    setFilters(getFiltersFromURL());
  }, [location.search]);

  // Update URL query params when filters change from UI
  const updateFilters = (newFilters) => {
    const currentParams = new URLSearchParams(location.search);

    Object.entries(newFilters).forEach(([key, value]) => {
      if (value && value !== "") {
        currentParams.set(key, value);
      } else {
        currentParams.delete(key);
      }
    });

    navigate(
      {
        pathname: location.pathname,
        search: currentParams.toString(),
      },
      { replace: true }
    );
  };

  return (
    <Box pt={{ base: '130px', md: '55px', xl: '55px' }} position="relative" maxH="490px">
      <TopFilters filters={filters} setFilters={updateFilters} />
      <IssueTable filters={filters} />
    </Box>
  );
};

export default IssueSearchPage;
