// Exercise 2.2: Dynamic Filter UI
// Filter the table rows live by status AND caller number.

// TODO 1 completed: get the required elements
const statusFilter = document.getElementById("statusFilter");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const clearButton = document.getElementById("clearFilters");
const table = document.getElementById("callsTable");

const rows = Array.from(table.tBodies[0].rows);

// TODO 2 completed: normalize search text
function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// Check whether one row matches both active filters.
function matches(row, status, query) {
  const rowStatus = row.dataset.status;
  const callerNumber = normalize(row.cells[0].textContent);

  const matchesStatus =
    status === "all" || rowStatus === status;

  const matchesCaller =
    callerNumber.includes(query);

  return matchesStatus && matchesCaller;
}

// Update the live result count.
function updateCount(visibleCount) {
  resultCount.textContent =
    `Showing ${visibleCount} of ${rows.length} calls`;
}

// TODO 3 completed: apply both filters together
function applyFilters() {
  const selectedStatus = statusFilter.value;
  const searchQuery = normalize(searchInput.value);

  let visibleCount = 0;

  rows.forEach((row) => {
    const shouldShow = matches(
      row,
      selectedStatus,
      searchQuery
    );

    row.hidden = !shouldShow;

    if (shouldShow) {
      visibleCount += 1;
    }
  });

  updateCount(visibleCount);
  emptyState.hidden = visibleCount !== 0;
}

// TODO 4 completed: live event listeners
statusFilter.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);

// TODO 5 completed: reset both controls
clearButton.addEventListener("click", () => {
  statusFilter.value = "all";
  searchInput.value = "";
  applyFilters();
  searchInput.focus();
});

// TODO 6 completed: initialize the page
applyFilters();