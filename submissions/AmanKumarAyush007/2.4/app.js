// Exercise 2.4: Fetch and Display API Data

const API_URL = "https://jsonplaceholder.typicode.com/users";

// TODO 1 completed: required elements
const loader = document.getElementById("loader");
const errorBox = document.getElementById("errorBox");
const errorMessage = document.getElementById("errorMessage");
const retryBtn = document.getElementById("retryBtn");
const userGrid = document.getElementById("userGrid");

// TODO 2 completed: state helpers
function showLoading() {
  loader.hidden = false;
  errorBox.hidden = true;
  userGrid.hidden = true;
  retryBtn.disabled = true;
}

function showError(message) {
  loader.hidden = true;
  errorBox.hidden = false;
  userGrid.hidden = true;
  retryBtn.disabled = false;

  errorMessage.textContent = `Could not load users. (${message})`;
}

function showSuccess() {
  loader.hidden = true;
  errorBox.hidden = true;
  userGrid.hidden = false;
  retryBtn.disabled = false;
}

// TODO 3 completed: initials
function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

// TODO 4 completed: safely build one user card
function createCard(user) {
  const card = document.createElement("article");
  card.className = "card";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = initials(user.name);
  avatar.setAttribute("aria-hidden", "true");

  const name = document.createElement("h2");
  name.textContent = user.name;

  const emailRow = document.createElement("p");
  const emailLink = document.createElement("a");
  emailLink.href = `mailto:${user.email}`;
  emailLink.textContent = user.email;
  emailRow.appendChild(emailLink);

  const phoneRow = document.createElement("p");
  const phoneLink = document.createElement("a");
  phoneLink.href = `tel:${user.phone}`;
  phoneLink.textContent = user.phone;
  phoneRow.appendChild(phoneLink);

  const company = document.createElement("span");
  company.className = "company";
  company.textContent = user.company.name;

  card.append(
    avatar,
    name,
    emailRow,
    phoneRow,
    company
  );

  return card;
}

// TODO 5 completed: render all users
function renderUsers(users) {
  userGrid.replaceChildren();

  if (users.length === 0) {
    const emptyMessage = document.createElement("p");
    emptyMessage.textContent = "No users found.";
    userGrid.appendChild(emptyMessage);
    return;
  }

  const fragment = document.createDocumentFragment();

  users.forEach((user) => {
    fragment.appendChild(createCard(user));
  });

  userGrid.appendChild(fragment);
}

// TODO 6 completed: fetch data
async function fetchUsers() {
  showLoading();

  try {
    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}`);
    }

    const users = await response.json();

    renderUsers(users);
    showSuccess();
  } catch (error) {
    showError(error.message);
  } finally {
    loader.hidden = true;
  }
}

// TODO 7 completed: retry
retryBtn.addEventListener("click", fetchUsers);

// TODO 8 completed: initial request
fetchUsers();