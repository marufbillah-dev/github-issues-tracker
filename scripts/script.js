const cardContainer = document.getElementById("card-container");

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

// load all issues
const loadAllIssues = async () => {
  const allIssuesUrl = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

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

// display issue details
const displayIssueDetails = (details) => {
  const modalInfoContainer = document.getElementById("modal-info-container");
  modalInfoContainer.innerHTML = "";
  modalInfoContainer.innerHTML = `
            <div class="mb-1">
                <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Issue #${details.id}</span>
            </div>
            <h3 class="text-2xl font-bold text-slate-800 tracking-tight mb-3">
                ${details.title}
            </h3>

            <div class="flex flex-wrap items-center gap-3 mb-8 text-sm font-medium">
                <span class="badge h-7 px-4 ${details.status === "open" ? `bg-[#10a37f]` : `bg-purple-500`} border-none text-white rounded-full">${details.status}</span>
                <span class="text-slate-400">•</span>
                <span class="text-slate-500">Opened by <span
                        class="text-slate-700 font-semibold">${details.author}</span></span>
                <span class="text-slate-400">•</span>
                <span class="text-slate-500">${formatDateTime(details.createdAt)}</span>
            </div>

            <div class="flex gap-2 mb-8">
                ${issueLabels(details.labels)}
            </div>

            <div class="mb-8">
                <h4 class="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Description</h4>
                <p class="text-slate-600 leading-relaxed text-[15px]">
                    ${details.description}
                </p>
            </div>

            <div class="bg-slate-50 rounded-xl p-6 mb-4 grid grid-cols-2 gap-8 border border-slate-100">
                <div>
                    <span class="block text-slate-500 text-sm font-medium mb-1.5">Assignee:</span>
                    <div class="flex items-center gap-2">
                        <span class="text-slate-800 font-bold text-lg">${details.assignee}</span>
                    </div>
                </div>
                <div>
                    <span class="block text-slate-500 text-sm font-medium mb-1.5">Priority:</span>
                    <span
                        class="badge h-7 px-4 ${details.priority === "high" ? `text-[#fee2e2] bg-[#ef4444]` : details.priority === "medium" ? `text-[#fef9c3] bg-[#ca8a04]` : `text-slate-100 bg-slate-500`} border-none text-white font-semibold rounded-lg text-xs tracking-wider uppercase">${details.priority}</span>
                </div>
            </div>

            <div class="flex justify-between items-center text-[11px] text-slate-400 font-medium px-1">
                <span>Last updated: ${formatDateTime(details.updatedAt)}</span>
            </div>
        `;
  issue_details_modal.showModal();
};

// display issues
const displayIssues = async (data) => {
  data.forEach((issue) => {
    // create new card for each issue
    const newCard = document.createElement("div");
    newCard.className = `card cursor-pointer bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 border-t-4 ${issue.status === "open" ? `border-t-[#10a37f]` : `border-t-purple-500`} overflow-hidden transition-all hover:-translate-y-0.5`;
    newCard.setAttribute("onclick", `loadIssueDetails(${issue.id})`);
    newCard.innerHTML = `
              <div class="p-5">
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
                          class="px-3 py-1 rounded-full ${issue.priority === "high" ? `bg-[#fee2e2] text-[#ef4444]` : issue.priority === "medium" ? `bg-[#fef9c3] text-[#ca8a04]` : `bg-slate-100 text-slate-500`} text-[11px] font-bold tracking-wider uppercase">${issue.priority}</span>
                  </div>
      
                  <h3 class="text-[15px] font-bold text-[#1e293b] leading-snug mb-2">${issue.title}</h3>
                  <p class="text-[13px] text-slate-500 leading-relaxed mb-4 line-clamp-2">${issue.description}</p>
      
                  <div class="flex flex-wrap gap-2 mb-6">
                      ${issueLabels(issue.labels)}
                  </div>
      
                  <div class="pt-4 border-t border-slate-100 space-y-1">
                      <p class="text-[12px] text-slate-500">#${issue.id} by <span
                              class="hover:underline cursor-pointer">${issue.author}</span></p>
                      <p class="text-[12px] text-slate-400 font-medium">${formatDateTime(issue.createdAt)}</p>
                  </div>
              </div>
          `;

    // append cards to the card container
    cardContainer.appendChild(newCard);
  });
};

// this () call will load all issues by default
loadAllIssues();
