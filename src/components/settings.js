///////////////////////////////////////////////////////////////////////////////
////  NAV HEADER //// ATRIBUTES: https://codepen.io/0pensource/pen/GRLopQM

import $ from 'jquery';


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

///////////////////////////////////////////////////////////////////////////////
////  UPDATE BUTTON ////
// document.getElementById("updateButton").addEventListener("click", function () {
//   // Get all checkbox elements within the wrapper
//   var checkboxes = document.querySelectorAll(
//     '#checkbox-list .label input[type="checkbox"]'
//   );
//   var allChecked = true;

//   // Check if all checkboxes are checked
//   for (var i = 0; i < checkboxes.length; i++) {
//     if (!checkboxes[i].checked) {
//       allChecked = false;
//       break;
//     }
//   }

//   // If not all checkboxes are checked, display a warning
//   if (!allChecked) {
//     alert("Warning: Please complete all landmarks before updating.");
//   }
// });


//const buttons = document.querySelectorAll("button");
//const minValue = 0;
//const maxValue = 10;

//buttons.forEach((button) => {
//  button.addEventListener("click", (event) => {
//    // 1. Get the clicked element
//    const element = event.currentTarget;
//    // 2. Get the parent
//    const parent = element.parentNode;
//    // 3. Get the number (within the parent)
//    const numberContainer = parent.querySelector(".number");
//    const number = parseFloat(numberContainer.textContent);
//    // 4. Get the minus and plus buttons
//    const increment = parent.querySelector(".plus");
//    const decrement = parent.querySelector(".minus");
//    // 5. Change the number based on click (either plus or minus)
//    const newNumber = element.classList.contains("plus")
//      ? number + 1
//      : number - 1;
//    numberContainer.textContent = newNumber;
//    console.log(newNumber);
//    // 6. Disable and enable buttons based on number value (and undim number)
//    if (newNumber === minValue) {
//      decrement.disabled = true;
//      numberContainer.classList.add("dim");
//      // Make sure the button won't get stuck in active state (Safari)
//      element.blur();
//    } else if (newNumber > minValue && newNumber < maxValue) {
//      decrement.disabled = false;
//      increment.disabled = false;
//      numberContainer.classList.remove("dim");
//    } else if (newNumber === maxValue) {
//      increment.disabled = true;
//      numberContainer.textContent = `${newNumber}+`;
//      element.blur();
//    }
//  });
//});



///////////////////////////////////////////////////////////////////////////////
////  AxES PLUS MINUS////

//$(document).on('click', '.inputs-block .minus', function () {
//    var $_inp = $(this).parent().find('input');
//    $_inp.val(parseInt($_inp.val()) - 1);
//    $_inp.trigger('propertychange');
//    return false;
//});

//$(document).on('click', '.inputs-block .plus', function () {
//    var $_inp = $(this).parent().find('input');
//    $_inp.val(parseInt($_inp.val()) + 1);
//    $_inp.trigger('propertychange');
//    return false;
//});

//$('.inputs-block input').bind('input propertychange', function () {
//    var $this = $(this);
//    $this.val($this.val().replace(/[^0-9]/gim, ''));
//    if ($this.val().length == 0 || parseInt($this.val()) <= 0)
//        $this.val(1);
//    var a = $('.inputs-block input').val();
//    var b = $('body').find('#pum-344').find('input[name="count"]').val(a);
//});

//$("#element").anglepicker({
//    start: function (e, ui) {

//    },
//    change: function (e, ui) {
//        $("#label").text(ui.value)
//    },
//    stop: function (e, ui) {

//    },
//    value: 90
//});



//$("#element").anglepicker("value", 50);



// following code needs some refactoring




//const curve = {
//    x: 0,
//    y: 50,
//    cpx: 60,
//    cpy: 0,
//    endx: 120,
//    endy: 50
//}
//let percent = 0.7

//let curveEl = document.getElementById('curve')
//let thumbEl = document.getElementById('thumb')

//// get the XY at the specified percentage along the curve
//const getQuadraticBezierXYatPercent = (curve, percent) => {
//    let x = Math.pow(1 - percent, 2) * curve.x + 2 * (1 - percent) * percent
//        * curve.cpx + Math.pow(percent, 2) * curve.endx
//    let y = Math.pow(1 - percent, 2) * curve.y + 2 * (1 - percent) * percent
//        * curve.cpy + Math.pow(percent, 2) * curve.endy

//    return { x, y }
//}

//const drawCurve = () => {
//    curveEl.setAttribute(
//        'd',
//        `M${curve.x},${curve.y} Q${curve.cpx},${curve.cpy} ${curve.endx},${curve.endy}`
//    )
//}

//const drawThumb = percent => {
//    let pos = getQuadraticBezierXYatPercent(curve, percent)
//    document.getElementById('value').textContent = Math.floor(percent * 100);

//    thumbEl.setAttribute('cx', pos.x)
//    thumbEl.setAttribute('cy', pos.y)
//}

//const moveThumb = e => {
//    console.log(e.target.value)
//    percent = e.target.value / 100
//    drawThumb(percent)
//}

//// event on the range input
//let rangeEl = document.getElementById('range')
//rangeEl.value = percent * 100
//rangeEl.addEventListener('input', moveThumb)

//// init
//drawCurve()
//drawThumb(percent)




const sliderWrapper = document.querySelector('.slider-wrapper');
const sliderSvg = document.querySelector('.slider-svg');
const sliderPath = document.querySelector('.slider-svg-path');
const sliderPathLength = sliderPath.getTotalLength();
const sliderThumb = document.querySelector('.slider-thumb');
const sliderInput = document.querySelector('.slider-input');
const sliderMinValue = +sliderInput.min || 0;
const sliderMaxValue = +sliderInput.max || 100;

const time = document.querySelector('.slider-value');

const updateTime = (timeInMinutes) => {
    let hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    const isMorning = hours < 12;
    const formattedHours = String(isMorning ? hours || 12 : (hours - 12 || 12)).padStart(2, '0');
    const formattedMinutes = String(minutes).padStart(2, '0');
    time.textContent = `${formattedHours}:${formattedMinutes} ${isMorning || (hours === 24) ? 'AM' : 'PM'}`;
}

const setColor = (progress) => {
    const colorStops = [
        { r: 243, g: 217, b: 112 },  // #F3D970
        { r: 252, g: 187, b: 93 },   // #FCBB5D
        { r: 246, g: 135, b: 109 },  // #F6876D
        { r: 147, g: 66, b: 132 },   // #934284
        { r: 64, g: 40, b: 98 },     // #402862
        { r: 1, g: 21, b: 73 }        // #011549
    ];
    const numStops = colorStops.length;

    const index = (numStops - 1) * progress;
    const startIndex = Math.floor(index);
    const endIndex = Math.ceil(index);

    const startColor = colorStops[startIndex];
    const endColor = colorStops[endIndex];

    const percentage = index - startIndex;

    const [r, g, b] = [Math.round(startColor.r + (endColor.r - startColor.r) * percentage), Math.round(startColor.g + (endColor.g - startColor.g) * percentage), Math.round(startColor.b + (endColor.b - startColor.b) * percentage)];

    sliderThumb.style.setProperty('--color', `rgb(${r} ${g} ${b})`);
}

// updating position could be done with CSS Motion Path instead of absolute positioning but Safari <15.4 doesn�t seem to support it
const updatePosition = (progress) => {
    const point = sliderPath.getPointAtLength(progress * sliderPathLength);
    const svgRect = sliderSvg.getBoundingClientRect();
    const scaleX = svgRect.width / sliderSvg.viewBox.baseVal.width;
    const scaleY = svgRect.height / sliderSvg.viewBox.baseVal.height;
    sliderThumb.style.left = `${point.x * scaleX * 100 / svgRect.width}%`;
    sliderThumb.style.top = `${point.y * scaleY * 100 / svgRect.height}%`;
    const value = Math.round(progress * (sliderMaxValue - sliderMinValue));
    sliderInput.value = value;
    updateTime(value);
    setColor(progress);
};

sliderInput.addEventListener('input', () => {
    const progress = sliderInput.valueAsNumber / (sliderMaxValue - sliderMinValue);
    updatePosition(progress);
});

const handlePointerMove = (event) => {
    const sliderWidth = sliderPath.getBoundingClientRect().width;
    const pointerX = event.clientX - sliderPath.getBoundingClientRect().left;
    const progress = Math.min(Math.max(pointerX / sliderWidth, 0), 1);
    updatePosition(progress);
};

const handlePointerDown = (event) => {
    const sliderWidth = sliderPath.getBoundingClientRect().width;
    const pointerX = event.clientX - sliderPath.getBoundingClientRect().left;
    const progress = Math.min(Math.max(pointerX / sliderWidth, 0), 1);
    const isThumb = event.target.classList.contains('slider-thumb');
    if (!isThumb) updatePosition(progress);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', () => {
        window.removeEventListener('pointermove', handlePointerMove);
    });
};

sliderThumb.addEventListener('pointerdown', handlePointerDown);
sliderPath.addEventListener('pointerdown', handlePointerDown);

updatePosition(sliderInput.valueAsNumber / (sliderMaxValue - sliderMinValue));

sliderWrapper.addEventListener('selectstart', (event) => {
    event.preventDefault();
})