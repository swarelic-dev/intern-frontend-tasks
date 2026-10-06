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
}

function showError(message) {
  loader.hidden = true;
  errorBox.hidden = false;
  userGrid.hidden = true;
  errorMessage.textContent = message;
}

function showSuccess() {
  loader.hidden = true;
  errorBox.hidden = true;
  userGrid.hidden = false;
}

function initials(name) {
  return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
}

function createCard(user) {
  const card = document.createElement("article");
  card.className = "card";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = initials(user.name);

  const name = document.createElement("h2");
  name.className = "name";
  name.textContent = user.name;

  const company = document.createElement("span");
  company.className = "company";
  company.textContent = user.company.name;

  const contact = document.createElement("div");
  contact.className = "contact";

  const emailLink = document.createElement("a");
  emailLink.href = `mailto:${user.email}`;
  emailLink.textContent = user.email;

  const phoneLink = document.createElement("a");
  phoneLink.href = `tel:${user.phone}`;
  phoneLink.textContent = user.phone;

  contact.appendChild(emailLink);
  contact.appendChild(phoneLink);

  card.appendChild(avatar);
  card.appendChild(name);
  card.appendChild(company);
  card.appendChild(contact);

  return card;
}

function renderUsers(users) {
  userGrid.replaceChildren();
  users.forEach(user => {
    userGrid.appendChild(createCard(user));
  });
}

async function loadUsers() {
  showLoading();
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch users (${response.status})`);
    }
    const users = await response.json();
    renderUsers(users);
    showSuccess();
  } catch (err) {
    showError(err.message);
  } finally {
    loader.hidden = true;
  }
}

retryBtn.addEventListener("click", loadUsers);

loadUsers();
