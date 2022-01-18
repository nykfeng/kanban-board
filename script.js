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
let draggedItem;
let currentColumn;
let itemOriginalColumn;

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
      { title: "Image and file uploader", body: "This one will be useful" },
      {
        title: "Make dark mode",
        body: "Feature that every website is doing now..",
      },
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
      {
        title: "Full stock information web app",
        body: "Gonna learn more React and sass first, will build later",
      },
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

  kanbanItemEl.addEventListener("dragstart", dragStart);
  kanbanItemEl.addEventListener("dragend", dragEnd);
  // kanbanItemEl.addEventListener("drag", draggingItem);

  const kanbanItemTitleEl = document.createElement("div");
  kanbanItemTitleEl.classList = "kanban-item-title-bar";
  kanbanItemTitleEl.textContent = kanbanItem.title;

  const kanbanItemContentEl = document.createElement("div");
  kanbanItemContentEl.classList = "kanban-item-content";
  kanbanItemContentEl.textContent = kanbanItem.body;
  kanbanItemEl.appendChild(kanbanItemTitleEl);
  kanbanItemEl.appendChild(kanbanItemContentEl);
  kanbanItemEl.insertAdjacentHTML("beforeend", optionButtons());
  itemListEl.appendChild(kanbanItemEl);
}

// html element for edit and delete buttons
function optionButtons() {
  const html = `
    <div class="edit-delete-options">
        <div class="edit-opt">
            <ion-icon name="create-outline"></ion-icon>
        </div>
        <div class="delete-opt">
            <ion-icon name="close-circle-outline"></ion-icon>
        </div>
    </div>
    `;
  return html;
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

// Listen for drop zones
function kanbanListDropZone() {
  const kanbanListEls = document.querySelectorAll(".kanban-item-list");
  kanbanListEls.forEach((listEl) => {
    listEl.addEventListener("drop", drop);
    listEl.addEventListener("dragover", allowDrop);
    listEl.addEventListener("dragenter", dragEnter);
    listEl.addEventListener("dragleave", dragLeave);
  });
}

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
    removeAddItemsElements(parent);
    deleteBtn.remove();
  });
}

// remove the add item elements
function removeAddItemsElements(element) {
  element.querySelector(".save-item").style.display = "none";
  element.querySelector(".new-item-content").style.display = "none";
  element.querySelector(".add-item").style.display = "block";

  // set the text content of new item title and body to nothing
  element
    .querySelector(".new-item-content")
    .querySelector(".new-item-title").textContent = "";
  element
    .querySelector(".new-item-content")
    .querySelector(".new-item-body").textContent = "";

  const removeBtn = element.querySelector(".delete-new-content-btn");
  if (removeBtn) removeBtn.remove();
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
      addKanbanItem(column, kanbanItem);
      updateSavedColumnsToLocalStorage();
      createAndRenderItem(columnListEl[column], kanbanItem);
      removeAddItemsElements(parent);
      editAndDeleteKanbanItem();
    }
  });
}

// Update a kanban item with edit button
function editAndDeleteKanbanItem() {
  const editDeleteKanbanItemEls = document.querySelectorAll(
    ".edit-delete-options"
  );

  editDeleteKanbanItemEls.forEach((editDeleteKanbanItemEl) => {
    editDeleteKanbanItemEl.addEventListener("click", function (e) {
      const kanbanItem = e.target.closest(".kanban-item");
      const columnEl = e.target.closest(".kanban-column");
      const column = columnEl.getAttribute("column");
      const oldItem = getKanbanItemTitleAndBody(kanbanItem);

      if (e.target.closest(".edit-opt")) {
        // make the element editable
        makeKanbanItemEditable(kanbanItem);
        // listen for out of foucs event so to save it
        kanbanItem.addEventListener("blur", () => {
          // Get title and body from the new element
          const newItem = getKanbanItemTitleAndBody(kanbanItem);
          // Update the kanban item title and body at app memory
          updateKanbanList(column, oldItem, newItem);
          // save the new list / change to localStorage
          updateSavedColumnsToLocalStorage();
          // make the element none editable after
          makeKanbanItemNoneditable(kanbanItem);
        });
      }
      if (e.target.closest(".delete-opt")) {
        // delete from app memory
        deleteKanbanItem(column, oldItem);
        // delete from DOM
        kanbanItem.remove();
        // save the new list to localstorage
        updateSavedColumnsToLocalStorage();
      }
    });
  });
}

// Make kanban item editable
function makeKanbanItemEditable(kanbanEl) {
  kanbanEl.contentEditable = true;
}

// Make kanban item non-editable
function makeKanbanItemNoneditable(kanbanEl) {
  kanbanEl.contentEditable = false;
}

// make update to the kanban list array
function updateKanbanList(column, oldItem, newItem) {
  storageItems[column].forEach((item) => {
    if (item.title === oldItem.title) {
      item.title = newItem.title;
      item.body = newItem.body;
    }
  });
}

// Get the kanban item title and body
function getKanbanItemTitleAndBody(kanbanItemElement) {
  const title = kanbanItemElement.querySelector(
    ".kanban-item-title-bar"
  ).textContent;
  const body = kanbanItemElement.querySelector(
    ".kanban-item-content"
  ).textContent;
  return { title, body };
}

// Handling dragging event
function dragStart(e) {
  // e.preventDefault();
  draggedItem = e.target;

  draggedItem.classList.add("dragging");

  itemOriginalColumn = e.target
    .closest(".kanban-column")
    .getAttribute("column");

  // set some minimum height so that when there is no element on the list
  // it can still be dropped
  const kanbanItemLists = document.querySelectorAll(".kanban-item-list");
  kanbanItemLists.forEach((list) => {
    list.style.minHeight = "10rem";
  });

  // add style to dragged item
  setTimeout(() => {
    e.target.style.visibility = "hidden";
  }, 0);

  // adding style to the dragging state
  e.target.classList.add("dragging");
}

// finished dragging the item
function dragEnd(e) {
  e.preventDefault();
  e.target.style.visibility = "visible";
  e.target.classList.remove("dragging");
}

// drag state - change dragging state style
function draggingItem(e) {
  const kanbanItemEl = e.target;
}

function dragEnter(e) {
  e.preventDefault();
}

function dragLeave(e) {
  e.preventDefault();
}

function allowDrop(e) {
  // by default, dragged element is not allowed to drop
  e.preventDefault();

  const kanbanListEl = e.target.closest(".kanban-item-list");

  const afterElement = getDragAfterElement(kanbanListEl, e.clientY);

  if (afterElement == null) {
    kanbanListEl.appendChild(draggedItem);
  } else {
    kanbanListEl.insertBefore(draggedItem, afterElement);
  }

  kanbanListEl.classList.add("drag-over");
}

function drop(e) {
  // if (!e.target.classList.contains("kanban-item")) return;
  // by default, dragged element is not allowed to drop
  e.preventDefault();

  // Find the origin column and delete the kanban item
  deleteKanbanItem(itemOriginalColumn, getKanbanItemTitleAndBody(draggedItem));

  // Find the dropped column
  const droppedColumnEl = e.target.closest(".kanban-column");
  const droppedColumnName = droppedColumnEl.getAttribute("column");

  // add the kanban item to the dropped column
  addKanbanItem(droppedColumnName, getKanbanItemTitleAndBody(draggedItem));

  // sort the kanban items before saving them to localStorage
  const newList = sortKanbanItemsInColumn(droppedColumnEl);
  storageItems[droppedColumnName] = newList;
  updateSavedColumnsToLocalStorage();

  const kanbanListEls = document.querySelectorAll(".kanban-item-list");
  kanbanListEls.forEach((list) => {
    list.classList.remove("drag-over");
    list.style.minHeight = "";
  });
}

// add and delete kanban item from column after drag and drop
function deleteKanbanItem(column, kanbanItem) {
  let indexToRemove;
  storageItems[column].forEach((item, index) => {
    if (item.title === kanbanItem.title) {
      if (item.body === kanbanItem.body) {
        indexToRemove = index;
      }
    }
  });
  storageItems[column].splice(indexToRemove, 1);
}

function addKanbanItem(column, kanbanItem) {
  storageItems[column].push(kanbanItem);
}

// sortable drop
function getDragAfterElement(kanbanItemListEl, y) {
  const draggableElements = Array.from(
    kanbanItemListEl.querySelectorAll(".kanban-item:not(.dragging)")
  );

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;
      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// sortable save
function sortKanbanItemsInColumn(columnEl) {
  const allItems = Array.from(columnEl.querySelectorAll(".kanban-item"));
  const newKanbanColumn = allItems.map((item) => {
    return getKanbanItemTitleAndBody(item);
  });
  return newKanbanColumn;
}

//on load
updateDOM();
updateSavedColumnsToLocalStorage();
renderAndDisplayFromStorage();
editAndDeleteKanbanItem();
kanbanListDropZone();
