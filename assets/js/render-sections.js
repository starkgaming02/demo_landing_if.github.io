async function fetchJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`No se pudo cargar ${url} (${res.status})`);
  return res.json();
}

function escapeHTML(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function safeTitleWithBr(html) {
  const escaped = escapeHTML(html);
  return escaped
    .replaceAll("&lt;br&gt;", "<br>")
    .replaceAll("&lt;br/&gt;", "<br/>")
    .replaceAll("&lt;br /&gt;", "<br/>");
}

export async function renderOferta() {
  const grid = document.getElementById("oferta-grid");
  if (!grid) return;

  const data = await fetchJSON("data/oferta.json");
  grid.innerHTML = (data.items || []).map((item) => {
    const title = escapeHTML(item.title || "");
    const href = escapeHTML(item.href || "#");
    const cta = escapeHTML(item.cta || "Conócelas");
    const image = escapeHTML(item.image || "");
    return `
      <div class="group bg-background-light dark:bg-gray-800 rounded-2xl overflow-hidden shadow-soft hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
        <div class="h-48 overflow-hidden relative">
          <div class="absolute inset-0 bg-primary/20 group-hover:bg-primary/0 transition-colors z-10"></div>
          <img alt="${title}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src="${image}" />
        </div>
        <div class="p-6 text-center">
          <h3 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">${title}</h3>
          <a class="inline-flex items-center justify-center px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-full text-sm font-semibold hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 dark:text-gray-300" href="${href}">
            ${cta} <span class="material-icons text-sm ml-1">chevron_right</span>
          </a>
        </div>
      </div>
    `;
  }).join("");
}

export async function renderPlanteles() {
  const grid = document.getElementById("planteles-grid");
  if (!grid) return;

  const data = await fetchJSON("data/planteles.json");
  grid.innerHTML = (data.items || []).map((p) => {
    const name = escapeHTML(p.name || "");
    const tag = escapeHTML(p.tag || "");
    const description = escapeHTML(p.description || "");
    const href = escapeHTML(p.href || "#");
    const cta = escapeHTML(p.cta || "Conoce más");
    const image = escapeHTML(p.image || "");
    return `
      <div class="group bg-white dark:bg-surface-dark rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 flex flex-col h-full transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700">
        <div class="h-64 overflow-hidden relative">
          <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10"></div>
          <img alt="${name}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" src="${image}" />
          <div class="absolute bottom-6 left-6 z-20 w-full pr-6">
            <h3 class="text-2xl font-bold text-white mb-2 shadow-sm">${name}</h3>
            <p class="text-sm text-gray-200 mb-4 line-clamp-2">${description}</p>
            <a href="${href}" class="inline-block bg-primary hover:bg-white hover:text-primary text-white text-sm font-bold py-2 px-6 rounded-full transition-colors duration-300">
              ${cta}
            </a>
          </div>
          ${tag ? `<div class="absolute top-4 right-4 z-20">
            <span class="inline-block bg-white/90 backdrop-blur-sm text-primary text-xs font-bold px-3 py-1 rounded-full shadow-sm">${tag}</span>
          </div>` : ""}
        </div>
      </div>
    `;
  }).join("");
}

export async function renderPromos() {
  const grid = document.getElementById("promo-grid");
  if (!grid) return;

  const data = await fetchJSON("data/promos.json");
  grid.innerHTML = (data.items || []).map((p) => {
    const title = safeTitleWithBr(p.title || "");
    const href = escapeHTML(p.href || "#");
    const icon = escapeHTML(p.icon || "star");
    const bg = escapeHTML(p.bg || "#002147");
    const hoverBg = escapeHTML(p.hoverBg || "#003366");

    return `
      <a class="promo-card group relative overflow-hidden rounded-md shadow-sm transition-all duration-300 hover:shadow-md h-16 flex items-center justify-start px-4"
         href="${href}"
         style="background:${bg}"
         data-bg="${bg}"
         data-hover="${hoverBg}">
        <div class="relative z-10 flex flex-row items-center justify-start text-left w-full h-full gap-3">
          <span class="material-icons text-2xl text-white/90 group-hover:scale-110 transition-transform duration-300 flex-shrink-0">${icon}</span>
          <h3 class="text-sm font-semibold text-white tracking-tight leading-tight">${title}</h3>
        </div>
        <div class="absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white/10 to-transparent"></div>
      </a>
    `;
  }).join("");

  grid.querySelectorAll(".promo-card").forEach((el) => {
    el.addEventListener("mouseenter", () => (el.style.background = el.dataset.hover));
    el.addEventListener("mouseleave", () => (el.style.background = el.dataset.bg));
  });
}

function setOptions(selectEl, options, placeholder) {
  selectEl.innerHTML = "";
  const ph = document.createElement("option");
  ph.value = "";
  ph.textContent = placeholder;
  selectEl.appendChild(ph);

  for (const opt of options) {
    const o = document.createElement("option");
    o.value = opt.id;
    o.textContent = opt.name;
    selectEl.appendChild(o);
  }
}

function resetSelect(selectEl, placeholder) {
  setOptions(selectEl, [], placeholder);
  selectEl.disabled = true;
}

export async function initSmartForm() {
  const plantelEl = document.getElementById("select-plantel");
  const nivelEl = document.getElementById("select-nivel");
  const modalidadEl = document.getElementById("select-modalidad");
  const programaEl = document.getElementById("select-programa");
  const hintEl = document.getElementById("form-hint");
  const btn = document.getElementById("btn-informes");

  // Si el partial aún no está inyectado o los IDs no existen, salimos sin romper
  if (!plantelEl || !nivelEl || !modalidadEl || !programaEl) return;

  const data = await fetchJSON("data/form-options.json");
  const planteles = data.planteles || [];

  // Llena Plantel
  setOptions(
    plantelEl,
    planteles.map((p) => ({ id: p.id, name: p.name })),
    "Plantel"
  );

  // Resetea cascada
  resetSelect(nivelEl, "Nivel");
  resetSelect(modalidadEl, "Modalidad");
  resetSelect(programaEl, "Programa");

  const setHint = (msg) => {
    if (hintEl) hintEl.textContent = msg || "";
  };

  setHint("Selecciona un plantel para ver niveles disponibles.");

  const getSelectedPlantel = () => planteles.find((p) => p.id === plantelEl.value);
  const getSelectedNivel = (plantel) => plantel?.niveles?.find((n) => n.id === nivelEl.value);
  const getSelectedModalidad = (nivel) => nivel?.modalidades?.find((m) => m.id === modalidadEl.value);

  plantelEl.addEventListener("change", () => {
    const p = getSelectedPlantel();

    resetSelect(nivelEl, "Nivel");
    resetSelect(modalidadEl, "Modalidad");
    resetSelect(programaEl, "Programa");

    if (!p) {
      setHint("Selecciona un plantel para ver niveles disponibles.");
      return;
    }

    setOptions(nivelEl, (p.niveles || []).map((n) => ({ id: n.id, name: n.name })), "Nivel");
    nivelEl.disabled = false;
    setHint("Ahora elige tu nivel.");
  });

  nivelEl.addEventListener("change", () => {
    const p = getSelectedPlantel();
    const n = getSelectedNivel(p);

    resetSelect(modalidadEl, "Modalidad");
    resetSelect(programaEl, "Programa");

    if (!n) {
      setHint("Elige un nivel para ver modalidades.");
      return;
    }

    setOptions(modalidadEl, (n.modalidades || []).map((m) => ({ id: m.id, name: m.name })), "Modalidad");
    modalidadEl.disabled = false;
    setHint("Elige tu modalidad.");
  });

  modalidadEl.addEventListener("change", () => {
    const p = getSelectedPlantel();
    const n = getSelectedNivel(p);
    const m = getSelectedModalidad(n);

    resetSelect(programaEl, "Programa");

    if (!m) {
      setHint("Elige una modalidad para ver programas.");
      return;
    }

    setOptions(programaEl, (m.programas || []).map((x) => ({ id: x.id, name: x.name })), "Programa");
    programaEl.disabled = false;
    setHint("Listo. Elige tu programa.");
  });

  programaEl.addEventListener("change", () => {
    setHint(programaEl.value ? "Perfecto. Ahora puedes solicitar informes." : "Elige un programa para continuar.");
  });

  btn?.addEventListener("click", (e) => {
    e.preventDefault();

    const p = getSelectedPlantel();
    const n = getSelectedNivel(p);
    const m = getSelectedModalidad(n);
    const prog = m?.programas?.find((x) => x.id === programaEl.value);

    if (!p || !n || !m || !prog) {
      setHint("Completa Plantel, Nivel, Modalidad y Programa antes de enviar.");
      return;
    }

    setHint(`Selección: ${p.name} • ${n.name} • ${m.name} • ${prog.name}`);
  });
}