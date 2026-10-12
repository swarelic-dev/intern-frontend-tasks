const API_URL = "https://jsonplaceholder.typicode.com/users";

const loader = document.getElementById("loader");
const errorBox = document.getElementById("errorBox");
const errorMessage = document.getElementById("errorMessage");
const retryBtn = document.getElementById("retryBtn");
const userGrid = document.getElementById("userGrid");

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
  errorMessage.textContent = "Could not load users. (" + message + ")";
}

function showSuccess() {
  loader.hidden = true;
  errorBox.hidden = true;
  userGrid.hidden = false;
  retryBtn.disabled = false;
}

function initials(name) {
  return name
    .split(" ")
    .map(function (word) {
      return word[0];
    })
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function createCard(user) {
  const card = document.createElement("article");
  card.className = "card";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = initials(user.name);
  avatar.setAttribute("aria-hidden", "true");

  const heading = document.createElement("h2");
  heading.textContent = user.name;

  const email = document.createElement("p");
  const emailLink = document.createElement("a");
  emailLink.href = "mailto:" + user.email;
  emailLink.textContent = user.email;
  email.appendChild(emailLink);

  const phone = document.createElement("p");
  const phoneLink = document.createElement("a");
  phoneLink.href = "tel:" + user.phone;
  phoneLink.textContent = user.phone;
  phone.appendChild(phoneLink);

  const company = document.createElement("span");
  company.className = "badge";
  company.textContent = user.company && user.company.name ? user.company.name : "";

  card.appendChild(avatar);
  card.appendChild(heading);
  card.appendChild(email);
  card.appendChild(phone);
  card.appendChild(company);
  return card;
}

function renderUsers(users) {
  userGrid.textContent = "";
  users.forEach(function (user) {
    userGrid.appendChild(createCard(user));
  });
}

async function fetchUsers() {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Server responded with " + response.status);
  }
  return response.json();
}

async function loadUsers() {
  showLoading();
  try {
    const users = await fetchUsers();
    renderUsers(users);
    showSuccess();
  } catch (err) {
    showError(err.message);
  } finally {
    retryBtn.disabled = false;
  }
}

retryBtn.addEventListener("click", loadUsers);
loadUsers();
