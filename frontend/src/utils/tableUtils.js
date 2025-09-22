// Utility functions for table components

/**
 * Calculates the optimal number of rows to display based on available vertical space
 * @param {number} containerHeight - The height of the container in pixels
 * @param {number} rowHeight - The height of each table row in pixels (default: 52)
 * @param {number} headerHeight - The height of the table header in pixels (default: 50)
 * @param {number} paginationHeight - The height of the pagination controls in pixels (default: 50)
 * @param {number} titleHeight - The height of the title/controls section in pixels (default: 60)
 * @param {number} padding - Additional padding to account for margins and borders (default: 40)
 * @returns {number} The optimal number of rows to display
 */
export const calculateOptimalPagination = (
  containerHeight,
  rowHeight = 52,
  headerHeight = 50,
  paginationHeight = 50,
  titleHeight = 60,
  padding = 40
) => {
  // Calculate available space for table rows
  const availableSpace =
    containerHeight - headerHeight - paginationHeight - titleHeight - padding;

  // Calculate how many rows can fit
  const optimalRows = Math.floor(availableSpace / rowHeight);

  // Ensure we have at least 1 row, but no more than 20
  return Math.max(1, Math.min(optimalRows, 20));
};

/**
 * Gets the container height based on the current viewport
 * @param {string} containerSelector - CSS selector for the container (default: 'body')
 * @returns {number} The height of the container in pixels
 */
export const getContainerHeight = (containerSelector = "body") => {
  if (typeof window === "undefined") return 600; // Default for SSR

  const container = document.querySelector(containerSelector);
  if (container) {
    return container.clientHeight;
  }

  // Fallback to viewport height
  return window.innerHeight;
};

/**
 * Calculates pagination for a table component based on available space
 * @param {number} specifiedPagination - The pagination number if specified
 * @param {number} containerHeight - The height of the container
 * @returns {number} The pagination number to use
 */
export const getPaginationNumber = (specifiedPagination, containerHeight) => {
  // If pagination is specified, use it
  if (specifiedPagination !== undefined && specifiedPagination !== null) {
    return specifiedPagination;
  }

  // Otherwise, calculate optimal pagination based on available space
  return calculateOptimalPagination(containerHeight);
};
