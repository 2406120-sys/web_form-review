// File: main.js

const projects = [
  {
    id: 1,
    title: "Sistem Inventaris Keuangan",
    category: "Web App",
    budget: 2500000,
    completed: true
  },
  {
    id: 2,
    title: "Sistem Kasir Digital POS",
    category: "Desktop App",
    budget: 5000000,
    completed: true
  },
  {
    id: 3,
    title: "Landing Page Perusahaan",
    category: "Web App",
    budget: 1500000,
    completed: false
  },
  {
    id: 4,
    title: "Aplikasi Presensi GPS Mobile",
    category: "Mobile App",
    budget: 4500000,
    completed: true
  },
  {
    id: 5,
    title: "Aplikasi Presensi Face recognition",
    category: "Mobile App",
    budget: 7500000,
    completed: false
  }
];

// Helper Format Angka ke Rupiah
const formatRupiah = (angka) => {
  return "Rp " + angka.toLocaleString("id-ID");
};

// 1. PROYEK KATEGORI Mobile App
console.log("===3. PROYEK KATEGORI Mobile App===");
const mobileProjects = projects.filter(p => p.category === "Mobile App");
console.log(mobileProjects);

// 2. RINGKASAN NAMA & ANGGARAN (Tabel)
console.log("\n===4. RINGKASAN NAMA & ANGGARAN===");
const ringkasanData = projects.map(p => ({
  nama: `'${p.title}'`,
  status: p.completed ? "'selesai'" : "'belum'",
  biaya: `'${formatRupiah(p.budget)}'`
}));
console.table(ringkasanData);

// 3. TOTAL ANGGARAN
console.log("\n===5. TOTAL ANGGARAN===");
const totalEstimasi = projects.reduce((acc, curr) => acc + curr.budget, 0);
const totalSelesai = projects
  .filter(p => p.completed)
  .reduce((acc, curr) => acc + curr.budget, 0);

console.log(`Total estimasi anggaran portofolio: ${formatRupiah(totalEstimasi)}`);
console.log(`Total Anggaran Proyek selesai: ${formatRupiah(totalSelesai)}`);


// --- LOGIKA UNTUK TAMPILAN DOM (HTML) ---
const updateStats = (dataList) => {
  const totalProjects = dataList.length;
  const totalBudget = dataList.reduce((acc, curr) => acc + curr.budget, 0);
  const completedCount = dataList.filter(item => item.completed).length;

  const elTotal = document.getElementById("stat-total-projects");
  const elBudget = document.getElementById("stat-total-budget");
  const elCompleted = document.getElementById("stat-completed-projects");

  if (elTotal) elTotal.textContent = totalProjects;
  if (elBudget) elBudget.textContent = formatRupiah(totalBudget);
  if (elCompleted) elCompleted.textContent = completedCount;
};

const renderProjects = (filteredList) => {
  const container = document.getElementById("project-list");
  if (!container) return;

  if (filteredList.length === 0) {
    container.innerHTML = "<p style='text-align: center; color: #64748b; padding: 20px;'>Tidak ada proyek pada kategori ini.</p>";
    return;
  }

  const htmlString = filteredList.map(proj => {
    const badgeClass = proj.completed ? "badge-success" : "badge-pending";
    const statusText = proj.completed ? "Selesai" : "Dalam Pengerjaan";

    return `
      <div class="project-card">
        <div class="project-info">
          <span class="project-category">${proj.category}</span>
          <h4>${proj.title}</h4>
          <p class="project-budget">${formatRupiah(proj.budget)}</p>
        </div>
        <div>
          <span class="badge ${badgeClass}">${statusText}</span>
        </div>
      </div>
    `;
  }).join("");

  container.innerHTML = htmlString;
};

document.addEventListener("DOMContentLoaded", () => {
  renderProjects(projects);
  updateStats(projects);

  const filterButtons = document.querySelectorAll(".btn-filter");
  filterButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      filterButtons.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");

      const selectedCategory = e.target.getAttribute("data-category");
      if (selectedCategory === "Semua") {
        renderProjects(projects);
      } else {
        const filtered = projects.filter(p => p.category === selectedCategory);
        renderProjects(filtered);
      }
    });
  });
});