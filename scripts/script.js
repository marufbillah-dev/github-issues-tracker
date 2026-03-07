const cardContainer = document.getElementById("card-container");

const loadAllIssues = async () => {
  const allIssuesUrl = "https://phi-lab-server.vercel.app/api/v1/lab/issues";

  const response = await fetch(allIssuesUrl);
  const data = await response.json();
  displayIssues(data.data);
};

const displayIssues = async (data) => {
  data.forEach((issue) => {
    // date formatting
    const isoDate = `${issue.createdAt}`;
    const createdAt = new Date(isoDate).toLocaleDateString("en-US");

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

    // create new card for each issue
    const newCard = document.createElement("div");
    newCard.className = `card cursor-pointer bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-slate-100 border-t-4 ${issue.status === "open" ? `border-t-[#10a37f]` : `border-t-purple-500`} overflow-hidden transition-all hover:-translate-y-0.5`;
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
                      <p class="text-[12px] text-slate-500">${issue.id} by <span
                              class="hover:underline cursor-pointer">${issue.author}</span></p>
                      <p class="text-[12px] text-slate-400 font-medium">${createdAt}</p>
                  </div>
              </div>
          `;

    // append cards to the card container
    cardContainer.appendChild(newCard);
  });
};

loadAllIssues();
