const itemsPerPage = 10;
let data;
// Set the number of items to display per page
let currentPage = 1;
document.addEventListener("DOMContentLoaded", function () {
  // Fetch data for the first page
  fetchData(currentPage);
  fetchMapData();
  // Leaflet map
  const map = L.map("map").setView([11.1271, 78.6569], 8);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(map);

  // Open Map button event
  document.getElementById("openMapBtn").addEventListener("click", function () {
    const mapContainer = document.getElementById("map");
    const tableContainer = document.getElementById("tableContainer");
    const backButton = document.getElementById("backButton");

    if (mapContainer.style.display === "none") {
      // Map is closed, so open it
      map.invalidateSize();
      map.setView([11.1271, 78.6569], 8);
      mapContainer.style.display = "block";
      tableContainer.style.display = "none";
      backButton.style.display = "block";
    } else {
      // Map is open, so close it
      mapContainer.style.display = "none";
      tableContainer.style.display = "block";
      backButton.style.display = "none";
    }
    setTimeout(function () {
      window.dispatchEvent(new Event("resize"));
    }, 500);
  });

  // Back button event
  document.getElementById("backButton").addEventListener("click", function () {
    const mapContainer = document.getElementById("map");
    const tableContainer = document.getElementById("tableContainer");
    const backButton = document.getElementById("backButton");

    mapContainer.style.display = "none";
    tableContainer.style.display = "block";
    backButton.style.display = "none";

    // Reset to the first page when returning to the table
    currentPage = 1;
    fetchData(currentPage);
  });

  function fetchMapData() {
    // Fetch data for the specified page
    let data1 = fetch(`http://localhost:3000/mapdata`)
      .then((response) => response.json())
      .then((fetchedData) => {
        return fetchedData;
      })
      .catch((error) => console.error("Error fetching data:", error));
    data1.then(function (data1) {
      for (let i = 0; i < data1["data"].length; i++) {
        const item = data1["data"][i];
        const marker = L.marker([item.Latitude, item.Longitude]).addTo(map);
        // marker.bindPopup(`ID: ${item.Id}<br>Name: ${item.Name}`);
      }
    });
  }
});

function viewDetails(id) {
  // Implement your logic to view details here
  alert(`View details for item with ID ${id}`);
}

function fetchData(page) {
  // Fetch data for the specified page
  fetch(`http://localhost:3000?_page=${page}&_limit=10`)
    .then((response) => response.json())
    .then((fetchedData) => {
      data = fetchedData;
      updateTable();
    })
    .catch((error) => console.error("Error fetching data:", error));
}

function updateTable() {
  const tableBody = document.querySelector("#dataTable tbody");
  const paginationInfo = document.getElementById("pagination");
  const currentPageSpan = document.getElementById("currentPage");
  const totalItems = data["data"].length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = Math.min(startIdx + itemsPerPage, totalItems);

  tableBody.innerHTML = ""; // Clear existing table content

  for (let i = startIdx; i < endIdx; i++) {
    const item = data["data"][i];
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${item.Id}</td>
            <td>${item.Name}</td>
            <td>${item.FatherName}</td>
            <td>${item.DOB}</td>
            <td>${item.WhNumber}</td>
            <td>${item.District}</td>
            <td><span class="eye-icon" onclick="viewDetails(${item.Id})">&#128065;</span></td>
        `;
    tableBody.appendChild(row);
  }

  currentPageSpan.textContent = `Page ${currentPage} of ${totalPages}`;

  // Update pagination buttons
  const prevPageBtn = document.getElementById("prevPageBtn");
  const nextPageBtn = document.getElementById("nextPageBtn");

  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled = currentPage === totalPages;
}

function prevPage() {
  if (currentPage > 1) {
    currentPage--;
    fetchData(currentPage);
  }
}

function nextPage() {
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (currentPage < totalPages) {
    currentPage++;
    // Fetch data for the next page
    fetchData(currentPage);
  }
}
