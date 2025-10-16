// Navigation switching
const navBtns = document.querySelectorAll(".nav-btn");
const views = document.querySelectorAll(".view");
navBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    navBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    views.forEach(v => v.classList.remove("active"));
    document.getElementById(btn.dataset.view).classList.add("active");
  });
});

// Hero buttons navigate
document.querySelectorAll(".hero-actions .btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelector(`[data-view="${btn.dataset.view}"]`).click();
  });
});

// Car data
let cars = JSON.parse(localStorage.getItem("cars")) || [];

// Form logic
const form = document.getElementById("sellForm");
const imgPreview = document.getElementById("imgPreview");
const carList = document.getElementById("carList");
const searchInput = document.getElementById("searchInput");

document.getElementById("imageUpload").addEventListener("change", e => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      imgPreview.innerHTML = `<img src="${reader.result}" alt="preview">`;
    };
    reader.readAsDataURL(file);
  }
});

form.addEventListener("submit", e => {
  e.preventDefault();
  const newCar = {
    id: Date.now(),
    make: make.value,
    model: model.value,
    year: year.value,
    price: price.value,
    description: description.value,
    image: imgPreview.querySelector("img")?.src || "",
  };
  cars.push(newCar);
  localStorage.setItem("cars", JSON.stringify(cars));
  form.reset();
  imgPreview.innerHTML = "";
  alert("✅ Car added successfully!");
  renderCars();
});

function renderCars(filter = "") {
  carList.innerHTML = cars
    .filter(c =>
      `${c.make} ${c.model}`.toLowerCase().includes(filter.toLowerCase())
    )
    .map(
      c => `
    <div class="car-card">
      <img src="${c.image || 'https://via.placeholder.com/300x180'}" />
      <div class="car-info">
        <h3>${c.make} ${c.model}</h3>
        <p>${c.year}</p>
        <p><strong>${Number(c.price).toLocaleString()} UGX</strong></p>
        <button class="btn primary" onclick="viewDetails(${c.id})">View Details</button>
      </div>
    </div>`
    )
    .join("");
}

// Modal
const modal = document.getElementById("modal");
const modalBody = document.getElementById("modalBody");
const closeModal = document.getElementById("closeModal");
closeModal.onclick = () => (modal.style.display = "none");

function viewDetails(id) {
  const c = cars.find(car => car.id === id);
  modalBody.innerHTML = `
    <img src="${c.image}" style="width:100%;border-radius:8px;">
    <h2>${c.make} ${c.model}</h2>
    <p><strong>Year:</strong> ${c.year}</p>
    <p><strong>Price:</strong> ${Number(c.price).toLocaleString()} UGX</p>
    <p>${c.description}</p>
  `;
  modal.style.display = "flex";
}

searchInput.addEventListener("input", e => {
  renderCars(e.target.value);
});

renderCars();
