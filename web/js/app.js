const DEFAULT_SOURCE = {
  label: "juanjimpad/claude-rules",
  rawBase: "https://raw.githubusercontent.com/juanjimpad/claude-rules/main",
};

let rules = [];
let activeCategory = "all";
let searchQuery = "";

// ── Sources ──────────────────────────────────────────────────────────────────

function githubToRaw(url) {
  // https://github.com/user/repo(/tree/branch)?  →  raw base
  const m = url.trim().match(
    /^https?:\/\/github\.com\/([^/]+\/[^/]+?)(?:\/tree\/([^/]+))?(?:\/.*)?$/
  );
  if (!m) return null;
  const slug = m[1];
  const branch = m[2] || "main";
  return { label: slug, rawBase: `https://raw.githubusercontent.com/${slug}/${branch}` };
}

async function fetchSource(source) {
  const res = await fetch(`${source.rawBase}/rules/index.json`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return data.map(r => ({ ...r, _source: source }));
}

async function loadRules() {
  try {
    rules = await fetchSource(DEFAULT_SOURCE);
  } catch {
    rules = [];
  }
  render();
}

async function addSource(url) {
  const source = githubToRaw(url);
  if (!source) {
    showToast("URL de GitHub no válida", true);
    return;
  }

  const btn = document.getElementById("btn-add-source");
  const input = document.getElementById("source-input");
  btn.disabled = true;
  btn.textContent = "Cargando…";

  try {
    const newRules = await fetchSource(source);
    // Remove existing rules from this source, then add fresh ones
    rules = rules.filter(r => r._source.rawBase !== source.rawBase).concat(newRules);
    input.value = "";
    showToast(`${newRules.length} regla(s) añadidas de ${source.label}`);
    render();
  } catch {
    showToast(`No se encontró rules/index.json en ${source.label}`, true);
  } finally {
    btn.disabled = false;
    btn.textContent = "Añadir";
  }
}

// ── Install command ───────────────────────────────────────────────────────────

function installCmd(rule) {
  const installSh = `${rule._source.rawBase}/install.sh`;
  return `curl -sL ${installSh} | bash -s ${rule.id}`;
}

// ── Render ────────────────────────────────────────────────────────────────────

function categories() {
  return [...new Set(rules.map(r => r.category))];
}

function render() {
  renderFilters();
  renderGrid();
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
      render();
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

  const isMultiSource = new Set(rules.map(r => r._source.rawBase)).size > 1;

  el.innerHTML = filtered.map(r => `
    <div class="card">
      <div class="card-header">
        <span class="card-title">${r.title}</span>
        <span class="card-category">${r.category}</span>
      </div>
      <p class="card-desc">${r.description}</p>
      <div class="card-tags">${r.tags.map(t => `<span class="tag">${t}</span>`).join("")}</div>
      <div class="card-footer">
        <span class="card-author">
          ${isMultiSource ? `<span class="source-badge">${r._source.label}</span>` : `por ${r.author}`}
        </span>
        <button class="btn-install" data-cmd="${installCmd(r)}">Instalar</button>
      </div>
    </div>
  `).join("");

  el.querySelectorAll(".btn-install").forEach(btn => {
    btn.addEventListener("click", () => {
      navigator.clipboard.writeText(btn.dataset.cmd).then(() => {
        btn.textContent = "¡Copiado!";
        btn.classList.add("copied");
        showToast("Comando copiado");
        setTimeout(() => {
          btn.textContent = "Instalar";
          btn.classList.remove("copied");
        }, 2000);
      });
    });
  });
}

// ── Toast ─────────────────────────────────────────────────────────────────────

function showToast(msg = "Comando copiado", isError = false) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.toggle("toast-error", isError);
  toast.classList.remove("hidden");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.add("hidden"), 2500);
}

// ── Events ────────────────────────────────────────────────────────────────────

document.getElementById("search").addEventListener("input", e => {
  searchQuery = e.target.value;
  renderGrid();
});

const popup = document.getElementById("source-popup");

document.getElementById("btn-open-popup").addEventListener("click", e => {
  e.stopPropagation();
  popup.classList.toggle("hidden");
  if (!popup.classList.contains("hidden")) {
    document.getElementById("source-input").focus();
  }
});

document.getElementById("btn-add-source").addEventListener("click", () => {
  const url = document.getElementById("source-input").value;
  if (url.trim()) { popup.classList.add("hidden"); addSource(url.trim()); }
});

document.getElementById("source-input").addEventListener("keydown", e => {
  if (e.key === "Enter") {
    const url = e.target.value;
    if (url.trim()) { popup.classList.add("hidden"); addSource(url.trim()); }
  }
  if (e.key === "Escape") popup.classList.add("hidden");
});

document.addEventListener("click", e => {
  if (!popup.classList.contains("hidden") && !popup.closest(".source-wrap").contains(e.target)) {
    popup.classList.add("hidden");
  }
});

loadRules();
