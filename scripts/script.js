const cardContainer = document.getElementById("card-container");
const issuesCountElement = document.getElementById("issues-count");
const searchInput = document.getElementById("search");
const loadingElement = document.getElementById("loading");
const allIssuesUrl = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

// loading while data fetching
const loading = (status) => {
  if (status) {
    cardContainer.classList.add("hidden");
    loadingElement.classList.remove("hidden");
  } else {
    cardContainer.classList.remove("hidden");
    loadingElement.classList.add("hidden");
  }
};

// date and time formatting
const formatDateTime = (isoDate) => {
  const date = new Date(isoDate);

  return `${date.toLocaleDateString("en-GB")} at ${date.toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    },
  )}`;
};

// create dynamic issue labels
const issueLabels = (labelArr) => {
  const configs = {
    bug: {
      style: "bg-[#fee2e2] border-[#fecaca] text-[#ef4444]",
      icon: "fa-solid fa-bug",
    },
    "help wanted": {
      style: "bg-[#fef9c3] border-[#fef08a] text-[#ca8a04]",
      icon: "fa-regular fa-life-ring",
    },
    enhancement: {
      style: "bg-[#dbeafe] border-[#bfdbfe] text-[#2563eb]",
      icon: "fa-solid fa-wand-magic-sparkles",
    },
    "good first issue": {
      style: "bg-[#dcfce7] border-[#bbf7d0] text-[#16a34a]",
      icon: "fa-solid fa-seedling",
    },
    documentation: {
      style: "bg-[#f3e8ff] border-[#e9d5ff] text-[#9333ea]",
      icon: "fa-solid fa-book",
    },
  };

  return labelArr
    .map((label) => {
      const config = configs[label] || {
        style: "bg-gray-100 border-gray-200 text-gray-600",
        icon: "",
      };
      return `
        <span class="flex items-center gap-1 px-2.5 py-1 rounded-full border ${config.style} text-[10px] font-bold">
          ${config.icon ? `<i class="${config.icon}"></i>` : ""}
          ${label}
        </span>`.trim();
    })
    .join("");
};

// active button style
const activeBtnStyle = (btnId) => {
  searchInput.value = "";

  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((btn) => {
    btn.className =
      "btn filter-btn max-sm:flex-1 h-10 px-8 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 normal-case font-medium rounded-lg transition-all";
  });
  const activeButton = document.getElementById(btnId);
  activeButton.className =
    "btn filter-btn max-sm:flex-1 h-10 px-8 bg-[#5800FF] hover:bg-[#4800D4] border-none text-white normal-case font-bold rounded-lg shadow-md transition-all";
};

// remove active button style
const removeActiveStyle = () => {
  const filterButtons = document.querySelectorAll(".filter-btn");
  filterButtons.forEach((btn) => {
    btn.className =
      "btn filter-btn max-sm:flex-1 h-10 px-8 bg-white hover:bg-slate-50 border border-slate-200 text-slate-500 normal-case font-medium rounded-lg transition-all";
  });
};

// load all issues
const loadAllIssues = async (btnId = "all") => {
  activeBtnStyle(btnId);
  loading(true);

  const response = await fetch(allIssuesUrl);
  const data = await response.json();
  displayIssues(data.data);
};

// load and display issue details
const loadIssueDetails = async (issueId) => {
  const issueDetailsUrl = `https://phi-lab-server.vercel.app/api/v1/lab/issue/${issueId}`;

  const response = await fetch(issueDetailsUrl);
  const data = await response.json();
  displayIssueDetails(data.data);
};

// load and display open issues
const loadOpenIssues = async (btnId) => {
  activeBtnStyle(btnId);
  loading(true);

  const response = await fetch(allIssuesUrl);
  const data = await response.json();

  const issuesData = data.data;
  const openIssues = issuesData.filter((issue) => issue.status === "open");
  displayIssues(openIssues);
};

// load and display closed issues
const loadClosedIssues = async (btnId) => {
  activeBtnStyle(btnId);
  loading(true);

  const response = await fetch(allIssuesUrl);
  const data = await response.json();

  const issuesData = data.data;
  const closedIssues = issuesData.filter((issue) => issue.status === "closed");
  displayIssues(closedIssues);
};

// load search issue and display
const loadSearchIssues = async (searchText) => {
  removeActiveStyle();
  loading(true);

  searchText = searchInput.value;
  const searchIssuesUrl = `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${searchText}`;

  const response = await fetch(searchIssuesUrl);
  const data = await response.json();

  // validation for empty string as input
  if (searchText) {
    displayIssues(data.data);
  } else {
    loadAllIssues();
  }
};

// display issue details
const displayIssueDetails = (details) => {
  const modalInfoContainer = document.getElementById("modal-info-container");
  modalInfoContainer.innerHTML = "";
  modalInfoContainer.innerHTML = `
            <div class="mb-1">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    Issue #${details?.id ? details.id : "000"}
                </span>
            </div>

            <h3 class="text-2xl font-bold text-slate-800 tracking-tight mb-3">
                ${details?.title ? details.title : "Untitled Issue"}
            </h3>

            <div class="flex flex-wrap items-center max-sm:gap-1 gap-3 mb-8 text-sm font-medium">
                <span class="badge h-7 px-4 
                    ${
                      details?.status === "open"
                        ? "bg-[#10a37f]"
                        : details?.status === "closed"
                          ? "bg-purple-500"
                          : "bg-slate-300"
                    } 
                    border-none text-white rounded-full">
                    ${details?.status ? details.status : "Unknown"}
                </span>
                <div class="max-sm:inline-flex max-sm:w-full hidden"></div>
                <span class="text-slate-400 max-sm:hidden">•</span>
                
                <span class="text-slate-500">Opened by 
                    <span class="text-slate-700 font-semibold">
                        ${details?.author ? details.author : "System"}
                    </span>
                </span>

                <span class="text-slate-400">•</span>
                
                <span class="text-slate-500">
                    ${details?.createdAt ? formatDateTime(details.createdAt) : "Date unavailable"}
                </span>
            </div>

            <div class="flex gap-2 mb-8">
                ${details?.labels?.length > 0 ? issueLabels(details.labels) : ""}
            </div>

            <div class="mb-8">
                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                <p class="text-slate-600 leading-relaxed text-[15px]">
                    ${details?.description ? details.description : "No description provided for this issue."}
                </p>
            </div>

            <div class="bg-slate-50 rounded-xl p-6 mb-4 grid grid-cols-2 gap-8 border border-slate-100">
                <div>
                    <span class="block text-slate-500 text-sm font-medium mb-1.5">Assignee:</span>
                    <div class="flex items-center gap-2">
                        <span class="${details?.assignee ? "text-slate-800" : "text-slate-400 font-normal italic"} font-bold text-lg">
                            ${details?.assignee ? details.assignee : "Unassigned"}
                        </span>
                    </div>
                </div>
                <div>
                    <span class="block text-slate-500 text-sm font-medium mb-1.5">Priority:</span>
                    <span
                        class="badge h-7 px-4 ${details.priority === "high" ? `text-[#fee2e2] bg-[#ef4444]` : details.priority === "medium" ? `text-[#fef9c3] bg-[#ca8a04]` : `text-slate-100 bg-slate-500`} border-none text-white font-semibold rounded-lg text-xs tracking-wider uppercase">${details.priority}</span>
                </div>
            </div>

            <div class="flex justify-between items-center text-[11px] text-slate-400 font-medium px-1">
                <span>
                    ${
                      details?.updatedAt
                        ? `Last updated: ${formatDateTime(details.updatedAt)}`
                        : "No updates recorded"
                    }
                </span>
            </div>
        `;
  issue_details_modal.showModal();
};

// display issues
const displayIssues = async (data) => {
  cardContainer.innerHTML = "";

  data.forEach((issue) => {
    // create new card for each issue
    const newCard = document.createElement("div");
    newCard.className = `card cursor-pointer bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 border-t-4 ${issue.status === "open" ? `border-t-[#10a37f]` : `border-t-purple-500`} overflow-hidden transition-all hover:-translate-y-0.5`;
    newCard.setAttribute("onclick", `loadIssueDetails(${issue.id})`);
    newCard.innerHTML = `
                <div class="p-5 flex flex-col h-full gap-5">
                    <div class="h-full">
                        <div class="flex justify-between items-start mb-4">
                        ${
                          issue.status === "open"
                            ? `<div class="w-8 h-8 rounded-full bg-[#dcfce7] flex items-center justify-center">
                                <svg viewBox="0 0 24 24" class="w-5 h-5 text-[#10a37f]" fill="none" stroke="currentColor"
                                    stroke-width="2.5">
                                    <circle cx="12" cy="12" r="10" stroke-dasharray="4 4" />
                                </svg>
                            </div>`
                            : `<div class="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" class="w-5 h-5 text-purple-500" fill="none" stroke="currentColor"
                                    stroke-width="2.5">
                                    <circle cx="12" cy="12" r="9" />
                                    <path d="M8 12l3 3 5-5" stroke-linecap="round" stroke-linejoin="round" />
                                </svg>
                            </div>`
                        }
                        <span
                            class="px-3 py-1 rounded-full ${issue.priority === "high" ? `bg-[#fee2e2] text-[#ef4444]` : issue.priority === "medium" ? `bg-[#fef9c3] text-[#ca8a04]` : `bg-slate-100 text-slate-500`} text-[11px] font-bold tracking-wider uppercase">${issue?.priority ? issue.priority : "No Priority"}</span>
                        </div>
        
                        <h3 class="text-[15px] font-bold text-[#1e293b] leading-snug mb-2">${issue?.title ? issue.title : "No Title Provided"}</h3>
                        <p class="text-[13px] text-slate-500 leading-relaxed mb-4 line-clamp-2">
                            ${issue?.description ? issue.description : "No description available for this issue."}
                        </p>
                    </div>
                    <div class="">
                        <div class="flex flex-wrap gap-2 mb-6">
                            ${issue?.labels?.length > 0 ? issueLabels(issue.labels) : '<span class="text-xs text-slate-400">No labels</span>'}
                        </div>

                        <div class="pt-4 border-t border-slate-100 space-y-1">
                            <p class="text-[12px] text-slate-500">
                                #${issue?.id || "000"} by 
                                <span class="hover:underline cursor-pointer">
                                    ${issue?.author ? issue.author : "Anonymous"}
                                </span>
                            </p>
                            <p class="text-[12px] text-slate-400 font-medium">
                                ${issue?.createdAt ? formatDateTime(issue.createdAt) : "Date unknown"}
                            </p>
                        </div>
                    </div>
              </div>
          `;

    // append cards to the card container
    cardContainer.appendChild(newCard);
  });
  const issueCount = cardContainer.children.length;
  issuesCountElement.innerText = issueCount;

  if (!issueCount) {
    cardContainer.innerHTML = "";
    cardContainer.innerHTML = `
        <div class="col-span-full flex flex-col items-center justify-center py-10 md:py-20 text-center">
            <div class="bg-slate-200 flex items-center justify-center aspect-square text-[#5800FF] p-6 rounded-full text-4xl mb-6">
                <i class="fa-solid fa-magnifying-glass-plus"></i>
            </div>

            <h3 class="text-xl font-semibold text-slate-800 mb-2">No items found</h3>
            <p class="text-slate-500 max-w-xs mx-auto mb-8">
                We couldn't find any results matching your search. Try checking your spelling or using different
                keywords.
            </p>
        </div>
    `;
  }
  loading(false);
};

// this () call will load all issues by default
loadAllIssues();
