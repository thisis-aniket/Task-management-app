let globalTaskData = [];

const addCard = () => {
  const newCardDetails = {
    id: `${Date.now()}`,
    url: document.getElementById("imageURL").value,
    title: document.getElementById("taskTitle").value,
    type: document.getElementById("taskType").value,
    description: document.getElementById("taskDescription").value,
  };

  taskContents = document.getElementById("taskContentsRow");
  taskContents.insertAdjacentHTML(
    "beforeend",
    generateTaskCard(newCardDetails)
  );

  globalTaskData.push(newCardDetails);
  saveToLocalStorage();
};

const generateTaskCard = ({ id, url, title, type, description }) => {
  return `<div class="col-md-6 col-lg-4 mt-3" id=${id} key=${id} >
    <div class="card">
      <div class="card-header">
        <div class="d-flex justify-content-end mb-2">
          <button type="button" class="btn btn-outline-info" name=${id} onclick="editTask(this)">
            <i class="fas fa-pencil-alt" name=${id}></i>
          </button>
          <button type="button" class="btn btn-outline-danger" name=${id} onclick="deleteTask(this)">
            <i class="far fa-trash-alt" name=${id}></i>
          </button>
        </div>
      </div>

      <img
        src=${url}
        class="card-img-top"
        alt="image"
      />

      <div class="card-body">
        <h5 class="card-title">${title}</h5>
        <p class="card-text">${description}</p>
        <span class="badge bg-primary">${type}</span>
      </div>

      <div class="card-footer">
        <button class="btn btn-outline-primary float-end saveBtn" name=${id}>
          OPEN TASK
        </button>
      </div>
    </div>
  </div>`;
};

const saveToLocalStorage = () => {
  localStorage.setItem("tasky", JSON.stringify({ tasks: globalTaskData }));
};

const reloadTaskCard = () => {
  const localStorageCopy = JSON.parse(localStorage.getItem("tasky"));
  if (localStorageCopy) {
    globalTaskData = localStorageCopy["tasks"];
  }
  globalTaskData.map((cardData) => {
    taskContents = document.getElementById("taskContentsRow");
    taskContents.insertAdjacentHTML("beforeend", generateTaskCard(cardData));
  });
};

const deleteTask = (e) => {
  const targetID = e.getAttribute("name");
  globalTaskData = globalTaskData.filter(
    (cardData) => cardData.id !== targetID
  );
  saveToLocalStorage();
  window.location.reload();
};

const editTask = (e) => {
  if (!e) e = window.event;
  const targetID = e.getAttribute("name");
  const type = e.tagName;

  let parentNode;
  let taskTitle;
  let taskDescription;
  let taskType;
  let submitButton;

  if (type === "BUTTON") {
    parentNode = e.parentNode.parentNode.parentNode;
  } else {
    parentNode = e.parentNode.parentNode.parentNode.parentNode;
  }

  taskTitle = parentNode.childNodes[5].childNodes[1];
  taskDescription = parentNode.childNodes[5].childNodes[3];
  submitButton = parentNode.childNodes[7].childNodes[1];
  taskType = parentNode.childNodes[5].childNodes[5];

  taskTitle.setAttribute("contenteditable", "true");
  taskDescription.setAttribute("contenteditable", "true");
  taskType.setAttribute("contenteditable", "true");
  submitButton.setAttribute("onclick", "saveEdit.apply(this)");
  submitButton.setAttribute("onclick", "saveEdit.apply(this)");
  submitButton.removeAttribute("data-bs-toggle");
  submitButton.removeAttribute("data-bs-target");
  submitButton.innerHTML = "Save Changes";
};

const saveEdit = (e) => {
  if (!e) e = window.event;
  const targetID = e.target.getAttribute("name");
  console.log(targetID);
  const parentNode = e.target.parentNode.parentNode;

  const taskTitle = parentNode.childNodes[5].childNodes[1];
  const taskDescription = parentNode.childNodes[5].childNodes[3];
  const taskType = parentNode.childNodes[5].childNodes[5];
  const submitButton = parentNode.childNodes[7].childNodes[1];

  const updateData = {
    taskTitle: taskTitle.innerHTML,
    taskDescription: taskDescription.innerHTML,
    taskType: taskType.innerHTML,
  };

  let stateCopy = globalTaskData;
  stateCopy = stateCopy.map((task) =>
    task.id === targetID
      ? {
          id: task.id,
          title: updateData.taskTitle,
          description: updateData.taskDescription,
          type: updateData.taskType,
          url: task.url,
        }
      : task
  );

  globalTaskData = stateCopy;
  saveToLocalStorage();
  taskTitle.setAttribute("contenteditable", "false");
  taskDescription.setAttribute("contenteditable", "false");
  taskType.setAttribute("contenteditable", "false");
  submitButton.innerHTML = "Open Task";
};