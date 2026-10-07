// Exercise 2.2: Dynamic Filter UI
// Filters the table rows live by status AND caller number, with no page reload.

const statusFilter = document.getElementById("statusFilter");
const searchInput = document.getElementById("searchInput");
const resultCount = document.getElementById("resultCount");
const emptyState = document.getElementById("emptyState");
const clearButton = document.getElementById("clearFilters");
const rows = Array.from(document.querySelectorAll("#callsTable tbody tr"));

// "+91 98765-43210" -> "919876543210"
function normalize(text) {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function applyFilters() {
  const status = statusFilter.value;
  const query = normalize(searchInput.value);
  let visible = 0;

  rows.forEach((row) => {
    const matchesStatus = status === "all" || row.dataset.status === status;
    const number = normalize(row.cells[0].textContent);
    const matchesSearch = number.includes(query);
    const show = matchesStatus && matchesSearch;
    row.hidden = !show;
    if (show) {
      visible += 1;
    }
  });

  resultCount.textContent = `Showing ${visible} of ${rows.length} calls`;
  emptyState.hidden = visible !== 0;
}

function clearFilters() {
  statusFilter.value = "all";
  searchInput.value = "";
  applyFilters();
  searchInput.focus();
}

statusFilter.addEventListener("change", applyFilters);
searchInput.addEventListener("input", applyFilters);
clearButton.addEventListener("click", clearFilters);

applyFilters();
