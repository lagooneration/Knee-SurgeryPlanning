///////////////////////////////////////////////////////////////////////////////
////  NAV HEADER //// ATRIBUTES: https://codepen.io/0pensource/pen/GRLopQM

const indicator = document.querySelector(".nav-indicator-wrapper");
const items = document.querySelectorAll(".nav-item");

function handleIndicator(el) {
  items.forEach((item) => {
    item.classList.remove("is-active");
  });

  indicator.style.width = `${el.offsetWidth}px`;
  indicator.style.left = `${el.offsetLeft}px`;

  el.classList.add("is-active");
}

items.forEach((item) => {
  item.addEventListener("click", (e) => {
    handleIndicator(item);
  });

  item.classList.contains("is-active") && handleIndicator(item);
});

///////////////////////////////////////////////////////////////////////////////
//// POINTS //// ATRIBUTES: https://codepen.io/Yanis-Ahmidach/pen/VwNNGrO

document.getElementById("open-popup").addEventListener("click", function () {
  document.getElementById("popup").classList.toggle("hidden");
  addOverlay(); // Call function to add overlay
});

document.getElementById("close-popup").addEventListener("click", function () {
  document.getElementById("popup").classList.add("hidden");
  removeOverlay(); // Call function to remove overlay
});

const links = document.querySelectorAll(".nav a");

links.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();

    // Toggle active class on sidebar links
    links.forEach((link) => link.classList.remove("active"));
    this.classList.add("active");

    // Show the relevant section
    const targetSection = document.querySelector(this.getAttribute("href"));
    document
      .querySelectorAll(".content-section")
      .forEach((section) => section.classList.add("hidden"));
    targetSection.classList.remove("hidden");
  });
});

function addOverlay() {
  // Create overlay element
  const overlay = document.createElement("div");
  overlay.classList.add("overlay"); // Add class for styling
  document.body.appendChild(overlay); // Append overlay to the body
}

function removeOverlay() {
  const overlay = document.querySelector(".overlay");
  if (overlay) {
    overlay.parentNode.removeChild(overlay); // Remove overlay if exists
  }
}

// function handleIndicator(el) {
//   links.forEach((item) => {
//     item.classList.remove("is-active");
//   });

//   indicator.style.width = `${el.offsetWidth}px`;
//   indicator.style.left = `${el.offsetLeft}px`;

//   el.classList.add("is-active");
// }

///////////////////////////////////////////////////////////////////////////////
//// LANDMARK REMOVAL

const checkboxList = document.getElementById("checkbox-list");
const dropdown = document.getElementById("dropdown");
const newItemText = document.getElementById("new-item-text");
const addButton = document.getElementById("add-landmark");
const removeButton = document.getElementById("remove-landmark");

// Initialize the dropdown with existing items
function initializeDropdown() {
  const labels = checkboxList.querySelectorAll(".label-text");
  labels.forEach((label) => {
    const option = document.createElement("option");
    option.value = label.innerText;
    option.innerText = label.innerText;
    dropdown.appendChild(option);
  });
}

// Add new item to checkbox list and dropdown
function addItem() {
  const text = newItemText.value.trim();
  if (text === "") return;

  // Create new checkbox item
  const newLabel = document.createElement("label");
  newLabel.classList.add("label");
  const newCheckbox = document.createElement("input");
  newCheckbox.type = "checkbox";
  newCheckbox.name = "value-radio";
  newCheckbox.classList.add("check-box");
  const newLabelText = document.createElement("div");
  newLabelText.classList.add("label-text");
  newLabelText.innerText = text;

  newLabel.appendChild(newCheckbox);
  newLabel.appendChild(newLabelText);
  checkboxList.appendChild(newLabel);

  // Add to dropdown
  const newOption = document.createElement("option");
  newOption.value = text;
  newOption.innerText = text;
  dropdown.appendChild(newOption);

  // Clear the input field
  newItemText.value = "";
}

// Remove selected item from checkbox list and dropdown
function removeItem() {
  const selectedValue = dropdown.value;
  if (selectedValue === "") return;

  // Remove from checkbox list
  const labels = checkboxList.querySelectorAll(".label");
  labels.forEach((label) => {
    const labelText = label.querySelector(".label-text").innerText;
    if (labelText === selectedValue) {
      checkboxList.removeChild(label);
    }
  });

  // Remove from dropdown
  const options = dropdown.querySelectorAll("option");
  options.forEach((option) => {
    if (option.value === selectedValue) {
      dropdown.removeChild(option);
    }
  });
}

addButton.addEventListener("click", addItem);
removeButton.addEventListener("click", removeItem);

// Initialize the dropdown with existing items on page load
initializeDropdown();