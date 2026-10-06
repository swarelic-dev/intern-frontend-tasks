const form = document.getElementById("recordForm");
const toast = document.getElementById("toast");
const inputs = form.querySelectorAll("input, textarea");
const notes = document.getElementById("notes");
const notesCounter = document.getElementById("notesCounter");

function todayISO() {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

const apptDateInput = document.getElementById("apptDate");
apptDateInput.min = todayISO();

const validators = {
  contactName: (value) => {
    if (!value.trim()) return "Contact name is required.";
    return "";
  },
  phone: (value) => {
    const cleaned = value.replace(/[\s-]/g, "");
    if (!cleaned) return "Phone number is required.";
    if (!/^\d{10}$/.test(cleaned)) return "Phone must be 10 digits.";
    return "";
  },
  apptDate: (value) => {
    if (!value) return "Appointment date is required.";
    if (value < todayISO()) return "Date cannot be in the past.";
    return "";
  },
  apptTime: (value) => {
    if (!value) return "Appointment time is required.";
    return "";
  },
  notes: (value) => {
    if (value.length > 200) return "Notes cannot exceed 200 characters.";
    return "";
  },
};

function validateField(name) {
  const field = form.elements[name];
  const value = field.value;
  const errorMsg = validators[name](value);
  
  const errorEl = document.getElementById(`${name}-error`);
  
  if (errorMsg) {
    errorEl.textContent = errorMsg;
    field.classList.add("invalid");
    field.setAttribute("aria-invalid", "true");
    return false;
  } else {
    errorEl.textContent = "";
    field.classList.remove("invalid");
    field.removeAttribute("aria-invalid");
    return true;
  }
}

function validateForm() {
  let firstInvalid = null;
  let isValid = true;

  Object.keys(validators).forEach(name => {
    const fieldValid = validateField(name);
    if (!fieldValid) {
      isValid = false;
      if (!firstInvalid) {
        firstInvalid = form.elements[name];
      }
    }
  });

  if (firstInvalid) {
    firstInvalid.focus();
  }

  return isValid;
}

let toastTimeout;
function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.hidden = true;
  }, 3000);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (validateForm()) {
    showToast("Record saved successfully!");
    form.reset();
    notesCounter.textContent = "0 / 200";
    notesCounter.style.color = "var(--text-muted)";
    apptDateInput.min = todayISO();
  }
});

inputs.forEach(input => {
  input.addEventListener("blur", () => {
    validateField(input.name);
  });
  
  input.addEventListener("input", () => {
    if (input.classList.contains("invalid")) {
      validateField(input.name);
    }
  });
});

notes.addEventListener("input", () => {
  const len = notes.value.length;
  notesCounter.textContent = `${len} / 200`;
  if (len > 200) {
    notesCounter.style.color = "var(--error-color)";
  } else {
    notesCounter.style.color = "var(--text-muted)";
  }
});
