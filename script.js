// Column Lists
const backlogListEl = document.querySelector(".backlog");
const progressListEl = document.querySelector(".in-progress");
const completeListEl = document.querySelector(".complete");
const onHoldListEl = document.querySelector(".on-hold");

const columnListEl = {
  backlog: backlogListEl,
  progress: progressListEl,
  complete: completeListEl,
  onHold: onHoldListEl,
};

const columnList = ["backlog", "progress", "complete", "onHold"];

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let storageItems;

// Items
let updatedOnLoad = false;

// Button element monitor
const addBtns = document.querySelectorAll(".add-item");
const savBtns = document.querySelectorAll(".save-item");

// Get Arrays from localStorage if available, set default values if not
function getSavedColumnsFromLocalStorage() {
  if (localStorage.getItem("kanbanBoard")) {
    storageItems = JSON.parse(localStorage.getItem("kanbanBoard"));
    backlogListArray = storageItems.backlog;
    progressListArray = storageItems.progress;
    completeListArray = storageItems.complete;
    onHoldListArray = storageItems.onHold;
  } else {
    backlogListArray = [
      { title: "Release the course", body: "Sit back and relax" },
      { title: "Make dark mode", body: "Watch tutorial on how to do it" },
    ];
    progressListArray = [
      {
        title: "Database Management Tool",
        body: "Full CRUD, RESTful, Authentication App",
      },
      { title: "Kanban Board", body: "Sit back and relax, this one is easy" },
    ];
    completeListArray = [
      {
        title: "Stock Watchlist App",
        body: "Watchlist and history list with stock charts and company information",
      },
      {
        title: "Stock Portfolio Manager App",
        body: "Fully usable portfolio management app",
      },
      {
        title: "TV Show searcher",
        body: "Find the trending and on schedule TV, plus search all you want with an autocompleter",
      },
    ];
    onHoldListArray = [
      { title: "Being uncool", body: "being here is so not cool man" },
    ];
    storageItems = {
      backlog: backlogListArray,
      progress: progressListArray,
      complete: completeListArray,
      onHold: onHoldListArray,
    };
  }
}

//update the DOM to relfect the changes
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumnsFromLocalStorage();
  }
  // Don't run more than once, Update Local Storage
  updatedOnLoad = true;
  updateSavedColumnsToLocalStorage();
}

// Set localStorage Arrays
function updateSavedColumnsToLocalStorage() {
  localStorage.setItem(`kanbanBoard`, JSON.stringify(storageItems));
}

// Create and render saved tasks to kanban board
// This will create each individual kanban item element
function createAndRenderItem(column, kanbanItem) {
  const itemListEl = column.querySelector(".kanban-item-list");
  const kanbanItemEl = document.createElement("div");
  kanbanItemEl.classList = "kanban-item";
  kanbanItemEl.setAttribute("draggable", "true");

  const kanbanItemTitleEl = document.createElement("div");
  kanbanItemTitleEl.classList = "kanban-item-title-bar";
  kanbanItemTitleEl.textContent = kanbanItem.title;

  const kanbanItemContentEl = document.createElement("div");
  kanbanItemContentEl.classList = "kanban-item-content";
  kanbanItemContentEl.textContent = kanbanItem.body;
  kanbanItemEl.appendChild(kanbanItemTitleEl);
  kanbanItemEl.appendChild(kanbanItemContentEl);
  itemListEl.appendChild(kanbanItemEl);
}

// Update from localStorage
// This will use the above function to render all kanban items
function renderAndDisplayFromStorage() {
  if (storageItems) {
    columnList.forEach((columnList) => {
      storageItems[columnList].forEach((item) => {
        createAndRenderItem(columnListEl[columnList], item);
      });
    });
  }
}

//on load
updateDOM();
updateSavedColumnsToLocalStorage();
renderAndDisplayFromStorage();

// Only one button to listen on load
// Add button
addBtns.forEach((addBtn) => {
  addBtn.addEventListener("click", function (e) {
    addBtn.style.display = "none";
    const addItemBlkEl = e.target.closest(".add-item-block");

    saveContentBtn(addItemBlkEl);
    deleteContentBtn(addItemBlkEl);
  });
});

// add a delete new content button and listen for it
function deleteContentBtn(parent) {
  const deleteBtn = document.createElement("div");
  deleteBtn.classList = "delete-new-content-btn";
  deleteBtn.textContent = "X";
  parent.append(deleteBtn);
  deleteBtn.addEventListener("click", function () {
    parent.querySelector(".save-item").style.display = "none";
    parent.querySelector(".new-item-content").style.display = "none";
    parent.querySelector(".add-item").style.display = "block";

    // set the text content of new item title and body to nothing
    parent
      .querySelector(".new-item-content")
      .querySelector(".new-item-title").textContent = "";
    parent
      .querySelector(".new-item-content")
      .querySelector(".new-item-body").textContent = "";

    deleteBtn.remove();
  });
}

// save button listen and save to the column
function saveContentBtn(parent) {
  const saveBtn = parent.querySelector(".save-item");
  const newContent = parent.querySelector(".new-item-content");
  saveBtn.style.display = "flex";
  newContent.style.display = "flex";
  newContent.querySelector(".new-item-title").textContent = "Title: ";
  newContent.querySelector(".new-item-body").textContent = "Body: ";

  saveBtn.addEventListener("click", function (e) {
    const columnEl = e.target.closest(".kanban-column");
    const column = columnEl.getAttribute("column");

    // get the title and body of new content
    const title = newContent.querySelector(".new-item-title").textContent;
    const body = newContent.querySelector(".new-item-body").textContent;
    const kanbanItem = { title, body };
    // set the text content to nothing
    newContent.querySelector(".new-item-title").textContent = "";
    newContent.querySelector(".new-item-body").textContent = "";

    // if either content was filled then we allow it to save
    if (title || body) {
      storageItems[column].push(kanbanItem);
      console.table(storageItems[column]);
      updateSavedColumnsToLocalStorage();
      createAndRenderItem(columnListEl[column], kanbanItem);
    }
  });
}
