import { bibleIconString } from "./src/bible-icon.js";

// DOM elements
const goalForm = document.querySelector("#goal-form");
const goalList = document.querySelector(".goals");
const totalGoals = document.querySelector("#total-goals");
const completedGoals = document.querySelector("#completed-goals");
const remainingGoals = document.querySelector("#remaining-goals");
const mainInput = document.querySelector("#goal-form input");
const draggableList = document.getElementById("draggable-list");

let goals = JSON.parse(localStorage.getItem("goals")) || [];

if (localStorage.getItem("goals")) {
  goals.map(createGoal);
}

goalForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = mainInput.value;

  if (inputValue == "") {
    return;
  }

  const goal = {
    id: Date.now(),
    name: inputValue,
    isCompleted: false,
  };

  goals.push(goal);
  localStorage.setItem("goals", JSON.stringify(goals));

  createGoal(goal);

  goalForm.reset();
  mainInput.focus();
});

goalList.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("remove-goal") ||
    e.target.parentElement.classList.contains("remove-goal") ||
    e.target.parentElement.parentElement.classList.contains("remove-goal")
  ) {
    const goalId = e.target.closest("li").id;

    removeGoal(goalId);
  }
});

goalList.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();

    e.target.blur();
  }
});

goalList.addEventListener("input", (e) => {
  const goalId = e.target.closest("li").id;

  updateGoal(goalId, e.target);
});

function createGoal(goal) {
  const goalEl = document.createElement("li");

  goalEl.setAttribute("id", goal.id);
  goalEl.setAttribute("draggable", "true");

  if (goal.isCompleted) {
    goalEl.classList.add("complete");
  }

  const goalElMarkup = `
  <div>
  <input type="checkbox" name="goals" id="${goal.id}" ${
    goal.isCompleted ? "checked" : ""
  }>
  <span ${!goal.isCompleted ? "contenteditable" : ""}>${goal.name}</span>
  </div>
    <button title="Remove the "${goal.name}" goal" class="remove-goal">
    ${bibleIconString}
    </button>
  `;
  goalEl.innerHTML = goalElMarkup;

  goalList.appendChild(goalEl);

  countGoals();

  addEventListeners();
}

function dragStart() {
  console.log("Event: ", "dragstart");
}

function dragEnter() {
  console.log("Event: ", "dragenter");
}

function dragLeave() {
  console.log("Event: ", "dragleave");
}

function dragOver() {
  console.log("Event: ", "dragover");
}

function dragDrop() {
  console.log("Event: ", "drop");
}

function addEventListeners() {
  const draggables = document.querySelectorAll(".draggable");
  const dragListItems = document.querySelectorAll(".draggable-list li");

  draggables.forEach((draggable) => {
    draggable.addEventListener("dragstart", dragStart);
  });

  dragListItems.forEach((item) => {
    item.addEventListener("dragover", dragOver);
    item.addEventListener("drop", dragDrop);
    item.addEventListener("dragenter", dragEnter);
    item.addEventListener("dragleave", dragLeave);
  });
}

function countGoals() {
  const completedGoalsArray = goals.filter((goal) => goal.isCompleted === true);

  totalGoals.textContent = goals.length;
  completedGoals.textContent = completedGoalsArray.length;
  remainingGoals.textContent = goals.length - completedGoalsArray.length;
}

function removeGoal(goalId) {
  goals = goals.filter((goal) => goal.id !== parseInt(goalId));

  localStorage.setItem("goals", JSON.stringify(goals));

  document.getElementById(goalId).remove();

  countGoals();
}

function updateGoal(goalId, el) {
  const goal = goals.find((goal) => goal.id === parseInt(goalId));

  if (el.hasAttribute("contenteditable")) {
    goal.name = el.textContent;
  } else {
    const span = el.nextElementSibling;
    const parent = el.closest("li");

    goal.isCompleted = !goal.isCompleted;

    if (goal.isCompleted) {
      span.removeAttribute("contenteditable");
      parent.classList.add("complete");
    } else {
      span.setAttribute("contenteditable", "true");
      parent.classList.remove("complete");
    }
  }

  localStorage.setItem("goals", JSON.stringify(goals));

  countGoals();
}

function insertBibleIcons() {
  const bibleDivs = document.querySelectorAll("[data-bible-icon]");
  bibleDivs.forEach((div) => {
    div.outerHTML = bibleIconString;
  });
}

insertBibleIcons();
