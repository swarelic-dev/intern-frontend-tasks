const form = document.getElementById("recordForm");
const toast = document.getElementById("toast");
const notesInput = document.getElementById("notes");
const notesCounter = document.getElementById("notesCounter");
const dateInput = document.getElementById("apptDate");
const fieldNames = ["contactName", "phone", "apptDate", "apptTime", "notes"];

function pad(n) {
  return String(n).padStart(2, "0");
}

function todayISO() {
  const d = new Date();
  return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
}

dateInput.min = todayISO();

const validators = {
  contactName: function (value) {
    if (value.trim().length < 2) {
      return "Please enter the contact's name (min 2 characters).";
    }
    return "";
  },
  phone: function (value) {
    const digits = value.replace(/[\s-]/g, "");
    if (!/^\d{10}$/.test(digits)) {
      return "Phone number must be exactly 10 digits.";
    }
    return "";
  },
  apptDate: function (value) {
    if (!value) {
      return "Please pick a date.";
    }
    if (value < todayISO()) {
      return "Date cannot be in the past.";
    }
    return "";
  },
  apptTime: function (value) {
    if (!value) {
      return "Please choose a time.";
    }
    return "";
  },
  notes: function (value) {
    if (value.length > 200) {
      return "Notes must be 200 characters or fewer.";
    }
    return "";
  }
};

function setFieldError(input, message) {
  const errorEl = document.getElementById(input.id + "-error");
  errorEl.textContent = message;
  input.classList.toggle("invalid", Boolean(message));
  input.setAttribute("aria-invalid", message ? "true" : "false");
}

function validateField(name) {
  const input = document.getElementById(name);
  const message = validators[name](input.value);
  setFieldError(input, message);
  return message === "";
}

function validateForm() {
  let firstInvalid = null;
  fieldNames.forEach(function (name) {
    const ok = validateField(name);
    if (!ok && !firstInvalid) {
      firstInvalid = document.getElementById(name);
    }
  });
  if (firstInvalid) {
    firstInvalid.focus();
    return false;
  }
  return true;
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  setTimeout(function () {
    toast.hidden = true;
  }, 3000);
}

function updateNotesCount() {
  notesCounter.textContent = notesInput.value.length + " / 200";
}

form.addEventListener("submit", function (event) {
  event.preventDefault();
  if (!validateForm()) {
    return;
  }
  const name = document.getElementById("contactName").value.trim();
  showToast("Record saved for " + name);
  form.reset();
  dateInput.min = todayISO();
  updateNotesCount();
  fieldNames.forEach(function (fieldName) {
    setFieldError(document.getElementById(fieldName), "");
  });
});

fieldNames.forEach(function (name) {
  const input = document.getElementById(name);
  input.addEventListener("blur", function () {
    validateField(name);
  });
  input.addEventListener("input", function () {
    const errorEl = document.getElementById(name + "-error");
    if (errorEl.textContent) {
      validateField(name);
    }
  });
});

notesInput.addEventListener("input", updateNotesCount);
updateNotesCount();
