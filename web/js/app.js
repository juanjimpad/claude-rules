const INDEX_URL = "https://raw.githubusercontent.com/juanjimpad/claude-rules/main/rules/index.json";
const INSTALL_BASE = "https://raw.githubusercontent.com/juanjimpad/claude-rules/main/install.sh";

let rules = [];
let activeCategory = "all";
let searchQuery = "";

async function loadRules() {
  try {
    const res = await fetch(INDEX_URL);
    rules = await res.json();
  } catch {
    rules = [];
  }
  renderFilters();
  renderGrid();
}

function categories() {
  const cats = [...new Set(rules.map(r => r.category))];
  return cats;
}

function installCmd(rule) {
  return `curl -sL ${INSTALL_BASE} | bash -s ${rule.id}`;
}

function renderFilters() {
  const el = document.getElementById("filters");
  const cats = categories();
  el.innerHTML = [
    `<button class="filter-btn${activeCategory === "all" ? " active" : ""}" data-cat="all">Todas</button>`,
    ...cats.map(c => `<button class="filter-btn${activeCategory === c ? " active" : ""}" data-cat="${c}">${c}</button>`)
  ].join("");

  el.querySelectorAll(".filter-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      activeCategory = btn.dataset.cat;
      renderFilters();
      renderGrid();
    });
  });
}

function renderGrid() {
  const el = document.getElementById("grid");
  const q = searchQuery.toLowerCase();

  const filtered = rules.filter(r => {
    const matchCat = activeCategory === "all" || r.category === activeCategory;
    const matchQ = !q || r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.tags.some(t => t.includes(q));
    return matchCat && matchQ;
  });

  if (!filtered.length) {
    el.innerHTML = `<div class="empty">No se encontraron reglas</div>`;
    return;
  }

  el.innerHTML = filtered.map(r => `
    <div class="card">
      <div class="card-header">
        <span class="card-title">${r.title}</span>
        <span class="card-category">${r.category}</span>
      </div>
      <p class="card-desc">${r.description}</p>
      <div class="card-tags">${r.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
      <div class="card-footer">
        <span class="card-author">por ${r.author}</span>
        <button class="btn-install" data-cmd="${installCmd(r)}">Instalar</button>
      </div>
    </div>
  `).join("");

  el.querySelectorAll(".btn-install").forEach(btn => {
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(btn.dataset.cmd).then(() => {
        btn.textContent = "¡Copiado!";
        btn.classList.add("copied");
        showToast();
        setTimeout(() => {
          btn.textContent = "Instalar";
          btn.classList.remove("copied");
        }, 2000);
      });
    });
  });
}

function showToast() {
  const toast = document.getElementById("toast");
  toast.classList.remove("hidden");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.add("hidden"), 2000);
}

document.getElementById("search").addEventListener("input", e => {
  searchQuery = e.target.value;
  renderGrid();
});

loadRules();
