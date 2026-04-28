const allCardContainer = document.getElementById("all-card-container");
const totalCount = document.getElementById("total-count");
const buttons = document.querySelectorAll(".button");
const allBtn = document.getElementById("allBtn");
const openBtn = document.getElementById("openBtn");
const closedBtn = document.getElementById("closedBtn");
let issueData = [];
const modalContainer = document.getElementById("modal-container");
const loader = document.getElementById("loader");
console.log(loader);
// Loader
const showLoader = () => {
  loader.classList.remove("hidden");
};
const hideLoader = () => {
  loader.classList.add("hidden");
};
// Load All Issue
const loadIssues = async () => {
  showLoader();
  const url = "https://phi-lab-server.vercel.app/api/v1/lab/issues";
  const res = await fetch(url);
  const data = await res.json();

  issueData = data.data;
  displayIssues(issueData);
  hideLoader();
};
loadIssues();
const displayIssues = (id) => {
  allCardContainer.innerHTML = "";
  id.forEach((issue) => {
    const statusStyle = getStatus(issue.status);
    const card = document.createElement("div");
    card.dataset.id = issue.id;

    card.className = `bg-white mt-4 rounded-md p-5 space-y-3 ${statusStyle.border} card`;
    card.innerHTML = `
    <div class="flex justify-between items-center ">
         <img src="${statusStyle.image}"/>   
        <p  class=" px-6 py-1 rounded-3xl ${getPriorityColor(issue.priority)}">${issue.priority}</p>
      </div>
      <div>
        <h2 class="font-semibold text-[#1F2937] text-[14px]">
         ${issue.title}
        </h2>
        <p class="text-[#64748B] text-[12px] wrap-break-word ">
         ${issue.description}
        </p>
      </div>
      <div class="flex items-center gap-3">
        ${array(issue.labels)}
      </div>
      <hr class="text-yellow-500 -mx-5 border-1" />

      <div>
        <p class="text-[12px] text-[#64748B]">${issue.author}</p>
        <p class="text-[12px] text-[#64748B]">${issue.createdAt}</p>
      </div>
    `;
    card.addEventListener("click", () => {
      const id = card.dataset.id;
      loadInfo(id);
      document.getElementById("word_modal").showModal();
    });
    allCardContainer.appendChild(card);
  });
  updateCount();
};

const showActive = (id) => {
  buttons.forEach((btn) => {
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline");
  });

  id.classList.add("btn-primary");
  id.classList.remove("btn-outline");
};

// Priority color

const getPriorityColor = (priority) => {
  if (priority === "high") {
    return "bg-red-300 text-red-700";
  } else if (priority === "medium") {
    return "bg-yellow-200 text-yellow-700";
  } else {
    return "bg-gray-200 text-gray-700";
  }
};

const getPriorityBgColor = (text) => {
  if (text.includes("bug")) {
    return "bg-red-300 text-red-700";
  } else if (text.includes("help")) {
    return "bg-yellow-200 text-yellow-700";
  } else if (text.includes("enhancement")) {
    return "bg-green-200 text-green-700";
  } else {
    return "bg-gray-200";
  }
};

// Update Count
const updateCount = () => {
  totalCount.innerText = allCardContainer.children.length + " Issues";
};

// Filter Button

allBtn.addEventListener("click", () => {
  displayIssues(issueData);
  showActive(allBtn);
});

openBtn.addEventListener("click", () => {
  const openIssues = issueData.filter((issue) => issue.status === "open");
  displayIssues(openIssues);
  showActive(openBtn);
});
closedBtn.addEventListener("click", () => {
  const closedIssues = issueData.filter((issue) => issue.status === "closed");
  displayIssues(closedIssues);
  showActive(closedBtn);
});

// array
const array = (arr) =>
  arr
    .map(
      (element) => `
      <span class="px-3 py-1 rounded-2xl text-xs ${getPriorityBgColor(element)}">${element}</span>`,
    )
    .join("");

// Style border and image

const getStatus = (status) => {
  if (status === "closed") {
    return {
      image: "/assets/Closed- Status .png",
      border: "border-t-4 border-purple-500",
    };
  }
  if (status === "open") {
    return {
      image: "/assets/Open-status.png",
      border: "border-t-4 border-green-500",
    };
  }
};

// modalContainer

const loadInfo = async (id) => {
  showLoader();
  const url = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`;
  const res = await fetch(url);
  const data = await res.json();
  displayInfo(data.data);
  hideLoader();
};
const displayInfo = (info) => {
  console.log(info);
  modalContainer.innerHTML = "";

  const div = document.createElement("div");
  div.className = "space-y-5 p-3 md:p-10";
  div.innerHTML = `
    <h2 id="modal-title" class="font-bold text-2xl text-[#1F2937]">${info.title}</h2>
          <div class="flex items-center gap-2">
            <button
              class="btn btn-success text-[12px] rounded-3xl"
              id="modal-status"
            >${info.status}</button>
            <span class="inline-block">&bull;</span>
            <p
              class="inline-block text-[#64748B] text-[12px] modal-assignee-top"
            >${info?.assignee || "Unassigned"}</p>
            <span class="inline-block">&bull;</span>
            <p
              class="inline-block text-[#64748B] text-[12px]"
              id="modal-date"
            > ${new Date(info.createdAt).toLocaleDateString()}</p>
          </div>
          <div>
          ${array(info.labels)}         
          </div>
          <p id="modal-desc" class="text-base text-[#64748B]">${info.description}</p>
          <div class="bg-gray-100 p-3 flex gap-25 rounded-md">
            <div>
              <p class="text-base text-[#64748B]">Assignee:</p>
              <h3 class="modal-assignee-bottom font-bold text-[#1F2937] text-base">${info?.assignee || "Unassigned"}</h3>
            </div>
            <div>
              <p class="text-base text-[#64748B]">Priority:</p>
              <button
                id="priority"
                class="btn bg-red-600 text-white text-[12px] rounded-3xl"
              >${info.priority}</button>
            </div>
          </div>
    `;
  modalContainer.appendChild(div);
};

// Search Issue
const searchIssues = () => {
  const search = document.getElementById("search-input");
  const searchValue = search.value.toLowerCase().trim();
  const filtered = issueData.filter((issue) =>
    issue.title.toLowerCase().includes(searchValue),
  );

  displayIssues(filtered);
};
