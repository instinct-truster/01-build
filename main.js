import { bibleIconString } from "./src/bible-icon.js";

// DOM elements
const goalForm = document.querySelector("#goal-form");
const goalList = document.querySelector(".goals");
const totalGoals = document.querySelector("#total-goals");
const completedGoals = document.querySelector("#completed-goals");
const remainingGoals = document.querySelector("#remaining-goals");
const mainInput = document.querySelector("#goal-form input");
const undoButton = document.getElementById("undo-button");
const goalListEl = document.getElementById("goal-list");

let lastGoalList = null;

let goals = JSON.parse(localStorage.getItem("goals")) || [];

if (localStorage.getItem("goals")) {
  drawGoalList(goals, goalListEl);
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

  drawGoalList(goals, goalListEl);

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

    lastGoalList = goals.slice();

    removeGoal(goalId);
  }
});

goalList.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    e.preventDefault();

    e.target.blur();
  }
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
  <button title='Remove the "${goal.name}" goal' class="remove-goal">
  ${bibleIconString}
  </button>
  `;
  goalEl.innerHTML = goalElMarkup;
  return goalEl;
}

function countGoals(list, type = "ALL") {
  switch (type) {
    case "ALL":
      return list.length;
    case "COMPLETE":
      return list.filter((goal) => goal.isCompleted).length;
    case "INCOMPLETE":
      return list.filter((goal) => !goal.isCompleted).length;
  }
}

function updateGoalCount() {
  const totalCount = goals.length;
  const completedCount = countGoals(goals, "COMPLETE");
  const remainingCount = totalCount - completedCount;

  totalGoals.textContent = totalCount;
  completedGoals.textContent = completedCount;
  remainingGoals.textContent = remainingCount;
}

function removeGoal(goalId) {
  goals = goals.filter((goal) => goal.id !== parseInt(goalId));

  localStorage.setItem("goals", JSON.stringify(goals));

  document.getElementById(goalId).remove();

  updateGoalCount();
}

function drawGoalList(goals, node) {
  node.replaceChildren(...goals.map(createGoal));
  updateGoalCount();
  updateUndoButton();
}

undoButton.addEventListener("click", () => {
  if (lastGoalList === null) {
    return;
  }
  goals = lastGoalList;
  lastGoalList = null;
  localStorage.setItem("goals", JSON.stringify(goals));
  drawGoalList(goals, goalListEl);
});

function updateUndoButton() {
  if (lastGoalList === null) {
    undoButton.disabled = true;
  } else {
    undoButton.disabled = false;
  }
}

function insertBibleIcons() {
  const bibleDivs = document.querySelectorAll("[data-bible-icon]");
  bibleDivs.forEach((div) => {
    div.outerHTML = bibleIconString;
  });
}

insertBibleIcons();
