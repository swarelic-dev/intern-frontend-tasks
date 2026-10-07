// Exercise 2.4: Fetch and Display API Data
const API_URL = "https://jsonplaceholder.typicode.com/users";

const loader = document.getElementById("loader");
const errorBox = document.getElementById("errorBox");
const errorMessage = document.getElementById("errorMessage");
const retryBtn = document.getElementById("retryBtn");
const userGrid = document.getElementById("userGrid");

// Exactly ONE of loader / errorBox / userGrid is visible at a time.
function showLoading() {
  loader.hidden = false;
  errorBox.hidden = true;
  userGrid.hidden = true;
}

function showError(message) {
  errorMessage.textContent = `Could not load users: ${message}`;
  loader.hidden = true;
  errorBox.hidden = false;
  userGrid.hidden = true;
}

function showSuccess() {
  loader.hidden = true;
  errorBox.hidden = true;
  userGrid.hidden = false;
}

// "Leanne Graham" -> "LG"
function initials(name) {
  return name
    .split(" ")
    .filter((part) => part !== "")
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");
}

function createLink(href, text) {
  const link = document.createElement("a");
  link.href = href;
  link.textContent = text;
  return link;
}

function createCard(user) {
  const card = document.createElement("article");
  card.className = "card";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.setAttribute("aria-hidden", "true");
  avatar.textContent = initials(user.name);

  const name = document.createElement("h2");
  name.textContent = user.name;

  const email = document.createElement("p");
  email.appendChild(createLink(`mailto:${user.email}`, user.email));

  const phone = document.createElement("p");
  phone.appendChild(createLink(`tel:${user.phone.replace(/[^\d+]/g, "")}`, user.phone));

  const company = document.createElement("span");
  company.className = "company";
  company.textContent = user.company.name;

  card.append(avatar, name, email, phone, company);
  return card;
}

function renderUsers(users) {
  userGrid.replaceChildren(...users.map(createCard));
}

async function loadUsers() {
  showLoading();
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Server responded with status ${response.status}`);
    }
    const users = await response.json();
    renderUsers(users);
    showSuccess();
  } catch (err) {
    showError(err.message);
  }
}

retryBtn.addEventListener("click", loadUsers);

loadUsers();
