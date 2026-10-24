// File: main.js
// Mengimplementasikan Form Handling, Live Search, dan Aksi Interaktif pada Proyek

// Data Array Utama Proyek
let projects = [
  { id: 1, title: "Sistem Inventaris Keuangan", category: "Web App", budget: 2500000, completed: true },
  { id: 2, title: "Sistem Kasir Digital POS", category: "Desktop App", budget: 5000000, completed: true },
  { id: 3, title: "Landing Page Perusahaan", category: "Web App", budget: 1500000, completed: false },
  { id: 4, title: "Aplikasi Presensi GPS Mobile", category: "Mobile App", budget: 4500000, completed: true },
  { id: 5, title: "Aplikasi Presensi Face recognition", category: "Mobile App", budget: 7500000, completed: false }
];

// State Filter & Pencarian
let selectedCategory = "Semua";
let searchQuery = "";

// Helper Format Rupiah
const formatRupiah = (angka) => "Rp " + angka.toLocaleString("id-ID");

// Memperbarui Kartu Statistik
const updateStats = () => {
  const totalProjects = projects.length;
  const totalBudget = projects.reduce((acc, curr) => acc + curr.budget, 0);
  const completedCount = projects.filter(item => item.completed).length;

  document.getElementById("stat-total-projects").textContent = totalProjects;
  document.getElementById("stat-total-budget").textContent = formatRupiah(totalBudget);
  document.getElementById("stat-completed-projects").textContent = completedCount;
};

// FITUR 2: Render Daftar Proyek dengan Filter Terpadu & Real-Time Live Search
const renderProjects = () => {
  const container = document.getElementById("project-list");
  if (!container) return;

  // Filter berbasis Kategori dan Live Search (.filter() & .toLowerCase().includes())
  const filteredList = projects.filter(proj => {
    const matchCategory = selectedCategory === "Semua" || proj.category === selectedCategory;
    const matchSearch = proj.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  if (filteredList.length === 0) {
    container.innerHTML = "<p style='text-align: center; color: #64748b; padding: 20px;'>Tidak ada proyek yang sesuai.</p>";
    return;
  }

  // FITUR 3: Render Kartu Proyek beserta Tombol 'Ubah Status' & 'Hapus Proyek'
  const htmlString = filteredList.map(proj => {
    const badgeClass = proj.completed ? "badge-success" : "badge-pending";
    const statusText = proj.completed ? "Selesai" : "Dalam Pengerjaan";

    return `
      <div class="project-card">
        <div class="project-info">
          <span class="project-category">${proj.category}</span>
          <h4>${proj.title}</h4>
          <p class="project-budget">${formatRupiah(proj.budget)}</p>
          <div class="action-btns">
            <button class="btn-action btn-toggle" onclick="toggleStatus(${proj.id})">Ubah Status</button>
            <button class="btn-action btn-delete" onclick="deleteProject(${proj.id})">Hapus Proyek</button>
          </div>
        </div>
        <div>
          <span class="badge ${badgeClass}">${statusText}</span>
        </div>
      </div>
    `;
  }).join("");

  container.innerHTML = htmlString;
};

// FITUR 3 (a): Fungsi Ubah Status Proyek (Toggle)
window.toggleStatus = (id) => {
  projects = projects.map(p => {
    if (p.id === id) {
      return { ...p, completed: !p.completed };
    }
    return p;
  });
  renderProjects();
  updateStats();
};

// FITUR 3 (b): Fungsi Hapus Proyek Berdasarkan ID
window.deleteProject = (id) => {
  projects = projects.filter(p => p.id !== id);
  renderProjects();
  updateStats();
};

// Event Listener Utama saat DOM Siap
document.addEventListener("DOMContentLoaded", () => {
  renderProjects();
  updateStats();

  // FITUR 1: Form Handling & Validation
  const form = document.getElementById("project-form");
  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Mencegah reload halaman

    const titleInput = document.getElementById("input-title").value.trim();
    const categoryInput = document.getElementById("input-category").value;
    const budgetInput = Number(document.getElementById("input-budget").value);
    const completedInput = document.getElementById("input-completed").checked;

    // Validasi: Judul tidak boleh kosong & Anggaran > 0
    if (!titleInput || budgetInput <= 0) {
      alert("Judul proyek tidak boleh kosong dan Anggaran harus lebih besar dari 0!");
      return;
    }

    // Buat Objek Baru dengan ID Unik (Date.now())
    const newProject = {
      id: Date.now(),
      title: titleInput,
      category: categoryInput,
      budget: budgetInput,
      completed: completedInput
    };

    // Tambahkan ke array menggunakan Spread Operator
    projects = [...projects, newProject];

    // Reset Form
    form.reset();

    // Render ulang UI dan statistik
    renderProjects();
    updateStats();
  });

  // FITUR 2: Event Listener Live Search (Pencarian Real-Time)
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value;
    renderProjects();
  });

  // Event Listener Tombol Filter Kategori
  const filterButtons = document.querySelectorAll(".btn-filter");
  filterButtons.forEach(btn => {
    btn.addEventListener("click", (e) => {
      filterButtons.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");
      selectedCategory = e.target.getAttribute("data-category");
      renderProjects();
    });
  });
});