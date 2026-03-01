import { renderOferta, renderPlanteles, renderPromos, initSmartForm } from "./render-sections.js";

async function includePartials() {
  const nodes = document.querySelectorAll("[data-include]");

  await Promise.all(
    [...nodes].map(async (el) => {
      const file = el.getAttribute("data-include");
      if (!file) return;

      const res = await fetch(file);
      if (!res.ok) {
        el.innerHTML = `<!-- Error cargando ${file}: ${res.status} -->`;
        return;
      }

      el.innerHTML = await res.text();
      el.removeAttribute("data-include");
    })
  );
}

document.addEventListener("DOMContentLoaded", async () => {
  await includePartials();

  await Promise.allSettled([
    renderPromos(),
    renderOferta(),
    renderPlanteles(),
    initSmartForm()
  ]);
});