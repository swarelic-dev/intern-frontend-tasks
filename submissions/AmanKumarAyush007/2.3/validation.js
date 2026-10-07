// Exercise 2.3: Form with Validation

// TODO 1 completed: select required elements
const form = document.getElementById("recordForm");
const toast = document.getElementById("toast");
const apptDate = document.getElementById("apptDate");
const notes = document.getElementById("notes");
const notesCounter = document.getElementById("notesCounter");

const fieldNames = [
  "contactName",
  "phone",
  "apptDate",
  "apptTime",
  "notes",
];

// TODO 2 completed: local YYYY-MM-DD date
function todayISO() {
  const date = new Date();
  const pad = (number) => String(number).padStart(2, "0");

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

apptDate.min = todayISO();

// TODO 3 completed: field validators
const validators = {
  contactName: (value) => {
    if (value.trim().length < 2) {
      return "Please enter the contact's name (min 2 characters).";
    }

    return "";
  },

  phone: (value) => {
    const normalizedPhone = value.replace(/[\s-]/g, "");

    if (!/^\d{10}$/.test(normalizedPhone)) {
      return "Phone number must be exactly 10 digits.";
    }

    return "";
  },

  apptDate: (value) => {
    if (!value) {
      return "Please choose an appointment date.";
    }

    if (value < todayISO()) {
      return "Appointment date cannot be in the past.";
    }

    return "";
  },

  apptTime: (value) => {
    if (!value) {
      return "Please choose a time.";
    }

    return "";
  },

  notes: (value) => {
    if (value.length > 200) {
      return "Notes must be 200 characters or fewer.";
    }

    return "";
  },
};

// TODO 4 completed: validate one field
function validateField(name) {
  const field = document.getElementById(name);
  const errorElement = document.getElementById(`${name}-error`);
  const message = validators[name](field.value);

  errorElement.textContent = message;

  const isInvalid = message !== "";

  field.classList.toggle("invalid", isInvalid);
  field.setAttribute("aria-invalid", String(isInvalid));

  return !isInvalid;
}

// TODO 5 completed: validate the entire form
function validateForm() {
  let firstInvalidField = null;
  let isFormValid = true;

  fieldNames.forEach((name) => {
    const isFieldValid = validateField(name);

    if (!isFieldValid) {
      isFormValid = false;

      if (!firstInvalidField) {
        firstInvalidField = document.getElementById(name);
      }
    }
  });

  if (firstInvalidField) {
    firstInvalidField.focus();
  }

  return isFormValid;
}

function updateNotesCounter() {
  notesCounter.textContent = `${notes.value.length} / 200`;
}

// TODO 7 completed: success toast
let toastTimer;

function showToast(message) {
  clearTimeout(toastTimer);

  toast.textContent = message;
  toast.hidden = false;

  toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 3000);
}

// TODO 6 completed: submit behavior
form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!validateForm()) {
    return;
  }

  const contactName = document
    .getElementById("contactName")
    .value
    .trim();

  showToast(`Record saved for ${contactName}`);

  form.reset();

  fieldNames.forEach((name) => {
    const field = document.getElementById(name);
    const errorElement = document.getElementById(`${name}-error`);

    field.classList.remove("invalid");
    field.setAttribute("aria-invalid", "false");
    errorElement.textContent = "";
  });

  apptDate.min = todayISO();
  updateNotesCounter();
});

// Validate fields when the user leaves them.
fieldNames.forEach((name) => {
  const field = document.getElementById(name);

  field.addEventListener("blur", () => {
    validateField(name);
  });

  // If an error is already visible, clear it as soon
  // as the user fixes the field.
  field.addEventListener("input", () => {
    const errorElement = document.getElementById(`${name}-error`);

    if (errorElement.textContent) {
      validateField(name);
    }
  });
});

// Keep the notes counter updated live.
notes.addEventListener("input", updateNotesCounter);

updateNotesCounter();