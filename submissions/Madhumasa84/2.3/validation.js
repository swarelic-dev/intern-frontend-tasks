// Exercise 2.3: Form with Validation

const form = document.getElementById("recordForm");
const toast = document.getElementById("toast");
const notesCounter = document.getElementById("notes-counter");
const NOTES_MAX = 200;
const FIELD_NAMES = ["contactName", "phone", "apptDate", "apptTime", "notes"];
let toastTimer = null;

// "YYYY-MM-DD" in the user's LOCAL time zone (toISOString would use UTC).
function todayISO() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${now.getFullYear()}-${month}-${day}`;
}

const validators = {
  contactName: (value) => {
    const name = value.trim();
    if (name === "") {
      return "Contact name is required.";
    }
    return name.length < 2 ? "Contact name must be at least 2 characters." : "";
  },
  phone: (value) => {
    const digits = value.replace(/[\s-]/g, "");
    if (digits === "") {
      return "Phone number is required.";
    }
    return /^\d{10}$/.test(digits) ? "" : "Phone must be exactly 10 digits.";
  },
  apptDate: (value) => {
    if (value === "") {
      return "Appointment date is required.";
    }
    return value < todayISO() ? "Date cannot be in the past." : "";
  },
  apptTime: (value) => (value === "" ? "Appointment time is required." : ""),
  notes: (value) => (value.length > NOTES_MAX ? `Notes must be ${NOTES_MAX} characters or fewer.` : ""),
};

function validateField(name) {
  const input = document.getElementById(name);
  const errorEl = document.getElementById(`${name}-error`);
  const message = validators[name](input.value);
  errorEl.textContent = message;
  input.classList.toggle("invalid", message !== "");
  input.setAttribute("aria-invalid", message !== "" ? "true" : "false");
  return message === "";
}

function validateForm() {
  let firstInvalid = null;
  FIELD_NAMES.forEach((name) => {
    if (!validateField(name) && firstInvalid === null) {
      firstInvalid = document.getElementById(name);
    }
  });
  if (firstInvalid) {
    firstInvalid.focus();
    return false;
  }
  return true;
}

function updateCounter() {
  const length = document.getElementById("notes").value.length;
  notesCounter.textContent = `${length} / ${NOTES_MAX}`;
}

function clearErrors() {
  FIELD_NAMES.forEach((name) => {
    const input = document.getElementById(name);
    document.getElementById(`${name}-error`).textContent = "";
    input.classList.remove("invalid");
    input.removeAttribute("aria-invalid");
  });
}

function showToast(message) {
  clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add("show"));
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.hidden = true;
    }, 300);
  }, 3000);
}

function handleSubmit(event) {
  event.preventDefault();
  if (validateForm()) {
    showToast("Record saved successfully!");
    form.reset();
    clearErrors();
    updateCounter();
  }
}

document.getElementById("apptDate").min = todayISO();

form.addEventListener("submit", handleSubmit);

FIELD_NAMES.forEach((name) => {
  const input = document.getElementById(name);
  input.addEventListener("blur", () => validateField(name));
  input.addEventListener("input", () => {
    if (input.classList.contains("invalid")) {
      validateField(name);
    }
  });
});

document.getElementById("notes").addEventListener("input", updateCounter);
