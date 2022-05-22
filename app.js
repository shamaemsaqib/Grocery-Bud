const form = document.querySelector(".grocery-form");
const input = document.getElementById("input");
const formAlert = document.querySelector(".form-alert");
const groceryContainer = document.querySelector(".grocery-list");
const listContainer = document.querySelector(".item-container");
const clearBtn = document.querySelector(".clear-btn");
const submitBtn = document.querySelector(".submit-btn");

let itemID = 0;
let editFlag = false;
let editID;
let editElement;

window.addEventListener("DOMContentLoaded", function () {
  input.focus();
  loadFromLocalStorage();
});

function setItems(itemName) {
  const newElement = document.createElement("div");
  newElement.classList.add("single-item");
  itemID++;
  const newElementID = itemID.toString();
  newElement.setAttribute("data-id", `${newElementID}`);
  newElement.innerHTML = `<p class="item-title">${itemName}</p>
        <div class="btn-container">
          <button class="edit-btn">
            <i class="fas fa-edit"></i>
          </button>
          <button class="del-btn">
            <i class="fas fa-trash"></i>
          </button>
        </div>`;

  const delBtn = newElement.querySelector(".del-btn");
  delBtn.addEventListener("click", function (e) {
    const element = e.currentTarget.parentElement.parentElement;
    const id = element.dataset.id;
    listContainer.removeChild(element);

    if (listContainer.children.length === 0) {
      groceryContainer.classList.remove("show-grocery-list");
    }

    displayAlert("item deleted", "red");
    removeFromLocalStorage(id);
  });

  const editBtn = newElement.querySelector(".edit-btn");
  editBtn.addEventListener("click", function (e) {
    editElement = e.currentTarget.parentElement.previousElementSibling;
    editID = editElement.parentElement.dataset.id;
    input.value = editElement.textContent;
    submitBtn.textContent = "edit";
    editFlag = true;
    input.focus();
  });

  listContainer.appendChild(newElement);
  groceryContainer.classList.add("show-grocery-list");
  addToLocalStorage(newElementID, itemName);
}

function displayAlert(msg, type) {
  formAlert.textContent = msg;
  formAlert.classList.add(`alert-${type}`);

  setTimeout(function () {
    formAlert.textContent = ``;
    formAlert.classList.remove(`alert-${type}`);
  }, 1000);
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  const itemName = input.value;
  if (itemName && !editFlag) {
    displayAlert("item added", "green");
    setItems(itemName);
  } else if (itemName && editFlag) {
    editElement.textContent = itemName;

    editInLocalStorage(editID, itemName);
    displayAlert("item edited", "green");
    editFlag = false;
    submitBtn.textContent = "submit";
  } else {
    displayAlert("please enter value", "red");
  }
  input.value = "";
});

clearBtn.addEventListener("click", function () {
  listContainer.innerHTML = ``;
  groceryContainer.classList.remove("show-grocery-list");
  displayAlert("all items cleared", "green");

  localStorage.clear();
  itemID = 0;
});

function addToLocalStorage(key, value) {
  const newItem = { id: key, value };
  let grocery = localStorage.getItem("grocery")
    ? JSON.parse(localStorage.getItem("grocery"))
    : [];
  grocery.push(newItem);
  localStorage.setItem("grocery", JSON.stringify(grocery));
}

function removeFromLocalStorage(id) {
  let grocery = JSON.parse(localStorage.getItem("grocery"));
  grocery = grocery.filter(function (item) {
    if (item.id === id) {
      return false;
    } else {
      return true;
    }
  });
  localStorage.setItem("grocery", JSON.stringify(grocery));
}

function editInLocalStorage(id, value) {
  let grocery = JSON.parse(localStorage.getItem("grocery"));
  grocery = grocery.map(function (item) {
    if (item.id === id) {
      item.value = value;
      return item;
    } else {
      return item;
    }
  });
  localStorage.setItem("grocery", JSON.stringify(grocery));
}

function loadFromLocalStorage() {
  let grocery = JSON.parse(localStorage.getItem("grocery"));
  if (grocery) {
    groceryContainer.classList.add("show-grocery-list");
    grocery.forEach(function (item) {
      const newElement = document.createElement("div");
      newElement.classList.add("single-item");
      const newElementID = item.id;
      newElement.setAttribute("data-id", `${newElementID}`);
      newElement.innerHTML = `<p class="item-title">${item.value}</p>
        <div class="btn-container">
          <button class="edit-btn">
            <i class="fas fa-edit"></i>
          </button>
          <button class="del-btn">
            <i class="fas fa-trash"></i>
          </button>
        </div>`;
      listContainer.appendChild(newElement);
    });
    console.log(listContainer.lastChild.dataset.id);
    itemID = parseInt(listContainer.lastChild.dataset.id);
    itemID = itemID.toString();
  }
}
