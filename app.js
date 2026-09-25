const MONTHS = [
  "Januari","Februari","Maret","April","Mei","Juni",
  "Juli","Agustus","September","Oktober","November","Desember"
];
const WEEKDAYS = [
  "Minggu","Senin","Selasa","Rabu","Kamis","Jumat","Sabtu"
];

const DATA = Array.isArray(window.LECTURE_DATA) ? window.LECTURE_DATA : [];
let mode = "subject";

const $ = (id) => document.getElementById(id);

function esc(value) {
  return String(value ?? "").replace(/[&<>"']/g, c => ({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
  }[c]));
}

function dateObj(v) {
  return new Date(Number(v.year), Number(v.month)-1, Number(v.day));
}
function dateKey(v) {
  return `${String(v.year).padStart(4,"0")}-${String(v.month).padStart(2,"0")}-${String(v.day).padStart(2,"0")}`;
}
function prettyDate(v, withWeekday=true) {
  const d = dateObj(v);
  return `${withWeekday ? WEEKDAYS[d.getDay()] + ", " : ""}${v.day} ${MONTHS[v.month-1]} ${v.year}`;
}

function initFilters() {
  const subjects = [...new Set(DATA.map(v => v.maddah))].sort((a,b)=>a.localeCompare(b,"id"));
  const months = [...new Set(DATA.map(v => Number(v.month)))].sort((a,b)=>a-b);

  $("subject").innerHTML =
    '<option value="">Semua maddah</option>' +
    subjects.map(s => `<option value="${esc(s)}">${esc(s)}</option>`).join("");

  $("month").innerHTML =
    '<option value="">Semua bulan</option>' +
    months.map(m => `<option value="${m}">${MONTHS[m-1]}</option>`).join("");

  $("videoTotal").textContent = DATA.length;
}

function filteredData() {
  const q = $("search").value.trim().toLowerCase();
  const subj = $("subject").value;
  const mon = $("month").value;

  return DATA.filter(v => {
    if (subj && v.maddah !== subj) return false;
    if (mon && String(v.month) !== mon) return false;
    if (q && !`${v.title} ${v.maddah}`.toLowerCase().includes(q)) return false;
    return true;
  });
}

function setMode(next) {
  mode = next;
  document.querySelectorAll(".mode-btn").forEach(btn =>
    btn.classList.toggle("active", btn.dataset.mode === next)
  );
  render();
}

function render() {
  const data = filteredData();
  if (mode === "subject") {
    $("subjectMode").classList.remove("hidden");
    $("dateMode").classList.add("hidden");
    renderBySubject(data);
  } else {
    $("subjectMode").classList.add("hidden");
    $("dateMode").classList.remove("hidden");
    renderByDate(data);
  }
}

function renderBySubject(data) {
  if (!data.length) {
    $("subjectMode").innerHTML = '<div class="empty">Tidak ada materi yang cocok.</div>';
    return;
  }

  const groups = new Map();
  data.forEach(v => {
    if (!groups.has(v.maddah)) groups.set(v.maddah, []);
    groups.get(v.maddah).push(v);
  });

  let html = "";
  for (const [maddah, items] of groups) {
    items.sort((a,b) => dateKey(a).localeCompare(dateKey(b)) || a.title.localeCompare(b.title,"id"));
    html += `
      <article class="subject-row">
        <div class="subject-label">
          <div>
            <div class="subject-name">${esc(maddah)}</div>
            <span class="subject-count">${items.length} link</span>
          </div>
        </div>
        <div class="subject-track">
          ${items.map((v,i) => `
            <a class="link-card" href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">
              <span class="play-dot">▶</span>
              <div class="link-no">${String(i+1).padStart(2,"0")}</div>
              <div class="link-title">${esc(v.title)}</div>
              <div class="link-date">${esc(v.day)} ${esc(MONTHS[v.month-1])} ${esc(v.year)}</div>
            </a>
          `).join("")}
        </div>
      </article>`;
  }
  $("subjectMode").innerHTML = html;
}

function renderByDate(data) {
  if (!data.length) {
    $("dateMode").innerHTML = '<div class="empty">Tidak ada materi yang cocok.</div>';
    return;
  }

  const groups = new Map();
  data.forEach(v => {
    const key = dateKey(v);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(v);
  });

  let html = "";
  for (const [key, items] of [...groups].sort((a,b)=>a[0].localeCompare(b[0]))) {
    items.sort((a,b) => a.maddah.localeCompare(b.maddah,"id") || a.title.localeCompare(b.title,"id"));
    const date = items[0];
    const visible = items.slice(0,4);

    html += `
      <section class="date-section">
        <div class="date-head">
          <div class="date-main">
            <span class="date-day">${esc(prettyDate(date).split(",")[0])}</span>
            <span class="date-text">${esc(date.day)} ${esc(MONTHS[date.month-1])} ${esc(date.year)}</span>
          </div>
          <span class="date-text">${items.length} link</span>
        </div>
        <div class="slot-grid">
          ${[0,1,2,3].map(i => visible[i] ? slotHtml(visible[i], i+1) : `
            <div class="slot slot-empty">
              <strong>—</strong>
              <span>slot kosong</span>
            </div>
          `).join("")}
        </div>
        ${items.length > 4 ? `<div class="warn">Ada ${items.length - 4} link tambahan pada tanggal ini. Mode tanggal menampilkan maksimal 4 link.</div>` : ""}
      </section>`;
  }

  $("dateMode").innerHTML = html;
}

function slotHtml(v, n) {
  return `
    <div class="slot">
      <a href="${esc(v.url)}" target="_blank" rel="noopener noreferrer">
        <div class="slot-number">LINK ${String(n).padStart(2,"0")}</div>
        <div class="slot-title" title="${esc(v.title)}">${esc(v.title)}</div>
        <span class="slot-subject">${esc(v.maddah)}</span>
      </a>
    </div>`;
}

$("search").addEventListener("input", render);
$("subject").addEventListener("change", render);
$("month").addEventListener("change", render);

$("reset").addEventListener("click", () => {
  $("search").value = "";
  $("subject").value = "";
  $("month").value = "";
  render();
});

document.querySelectorAll(".mode-btn").forEach(btn => {
  btn.addEventListener("click", () => setMode(btn.dataset.mode));
});

$("themeBtn").addEventListener("click", () => {
  const light = document.body.classList.toggle("light");
  localStorage.setItem("archive-theme", light ? "light" : "dark");
});
if (localStorage.getItem("archive-theme") === "light") {
  document.body.classList.add("light");
}

initFilters();
render();
