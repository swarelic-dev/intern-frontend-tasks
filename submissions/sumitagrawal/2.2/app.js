const statusFilter = document.getElementById("statusFilter");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const clearButton = document.getElementById("clearFilters");
const rows = Array.from(document.querySelectorAll("#callsTable tbody tr"));

function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function applyFilters() {
  const status = statusFilter.value;
  const query = normalize(searchInput.value);
  let visibleCount = 0;

  rows.forEach(row => {
    const rowStatus = row.dataset.status;
    const callerNumber = normalize(row.cells[0].textContent);
    
    const matchesStatus = status === "all" || rowStatus === status;
    const matchesQuery = callerNumber.includes(query);

    if (matchesStatus && matchesQuery) {
      row.hidden = false;
      visibleCount++;
    } else {
      row.hidden = true;
    }
  });

  resultCount.textContent = `Showing ${visibleCount} of ${rows.length} calls`;
  emptyState.hidden = visibleCount > 0;
}

statusFilter.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);

clearButton.addEventListener("click", () => {
  statusFilter.value = "all";
  searchInput.value = "";
  applyFilters();
});

applyFilters();
