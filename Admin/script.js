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
    const MapOpenbtn = document.getElementById("openMapBtn");

    if (mapContainer.style.display === "none") {
      // Map is closed, so open it
      map.invalidateSize();
      map.setView([11.1271, 78.6569], 8);
      mapContainer.style.display = "block";
      tableContainer.style.display = "none";
      backButton.style.display = "block";
      MapOpenbtn.style.display = "none";
    } else {
      // Map is open, so close it
      mapContainer.style.display = "none";
      tableContainer.style.display = "block";
      backButton.style.display = "none";
      MapOpenbtn.style.display = "block";
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
    const MapOpenbtn = document.getElementById("openMapBtn");

    mapContainer.style.display = "none";
    tableContainer.style.display = "block";
    backButton.style.display = "none";
    MapOpenbtn.style.display = "block";

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

function viewDetails(encodedItem, func) {
  const decodedItem = JSON.parse(decodeURIComponent(encodedItem));
  console.log(decodedItem);
  openModal(decodedItem, func);
  // Implement your logic to view details here
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
  console.log(data);
  const tableBody = document.querySelector("#dataTable tbody");
  const paginationInfo = document.getElementById("pagination");
  const currentPageSpan = document.getElementById("currentPage");
  const totalItems = data.pagination.totalItems; // Corrected
  const totalPages = data.pagination.totalPages; // Corrected
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = Math.min(startIdx + itemsPerPage, totalItems);

  tableBody.innerHTML = ""; // Clear existing table content

  for (let i = startIdx; i < endIdx; i++) {
    const item = data.data[i - startIdx]; // Corrected
    const row = document.createElement("tr");
    row.innerHTML = `
            <td>${item.Id}</td>
            <td>${item.Name}</td>
            <td>${item.FatherName}</td>
            <td>${item.DOB}</td>
            <td>${item.WhNumber}</td>
            <td>${item.District}</td>
            <td><i class="fa-solid fa-eye" onclick="viewDetails('${encodeURIComponent(
              JSON.stringify(item)
            )}', '${"view"}')"></i></td>
            <td><i class="fa-solid fa-pen-to-square" onclick="viewDetails('${encodeURIComponent(
              JSON.stringify(item)
            )}', '${"edit"}')"></i></td>
            <td><i class="fa-solid fa-trash" onclick="deleteItem('${
              item.Id
            }')"></i></td>
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
  const totalItems = data.pagination.totalItems; // Corrected
  const totalPages = data.pagination.totalPages; // Corrected

  if (currentPage < totalPages) {
    currentPage++;
    // Fetch data for the next page
    fetchData(currentPage);
  }
}

/////////////////////////////////////////////////////////////////////////////////////
///// FUNCTION TO GET COUNT VALUES
/////////////////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", function (event) {
  getCountValues();
});

function getCountValues() {
  const url = "http://localhost:3000/count-all-values"; // Assuming this is your server endpoint

  // Configure the fetch request
  const requestOptions = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  };

  // Send the GET request
  fetch(url, requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Network response was not ok.");
      }
    })
    .then((data) => {
      // console.log("Count of values:", data.count);
      document.getElementById("tot-mem").innerHTML =
        "மொத்த உறுப்பினர்கள்: " + data.count;
    })
    .catch((error) => {
      console.error("Error occurred:", error);
    });
}

/////////////////////////////////////////////////////////////////////////////////////
///// Analytics page Redirect
/////////////////////////////////////////////////////////////////////////////////////

document
  .getElementById("analyticsbtn")
  .addEventListener("click", function (event) {
    window.location.href = "./main.html";
  });

/////////////////////////////////////////////////////////////////////////////////////
///// Edit Delete Search
/////////////////////////////////////////////////////////////////////////////////////

function deleteItem(id) {
  // Implement logic to delete item here
  if (confirm("Are you sure you want to delete this?") == true) {
    fetch(`http://localhost:3000/del-mem/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Refresh the table or handle UI accordingly
          fetchData(currentPage);
        } else {
          throw new Error("Failed to delete item");
        }
      })
      .catch((error) => {
        console.error("Error deleting item:", error);
      });
  } else {
    // text = "You canceled!";
  }
}

function editItem() {
  // Implement logic to edit item here
  // if (validateCurrentSection(3)) {
  const formData = new FormData(document.getElementById("editform"));
  // Convert FormData to JSON
  const jsonData = {};
  const radioButtons = document.getElementsByName("DirectSupport");
  let selectedValue;
  radioButtons.forEach((button) => {
    if (button.checked) {
      selectedValue = button.value;
    }
  });
  const radioButtons1 = document.getElementsByName("IndirectSupport");
  let selectedValue1;
  radioButtons1.forEach((button) => {
    if (button.checked) {
      selectedValue1 = button.value;
    }
  });
  jsonData["IndirectSupport"] = selectedValue1;
  formData.forEach((value, key) => {
    if (key !== "DirectSupport" || key !== "IndirectSupport") {
      jsonData[key] = value;
    }
  });
  console.log(jsonData);
  fetch(`http://localhost:3000/update-mem/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(jsonData),
  })
    .then((response) => {
      if (response.ok) {
        // Refresh the table or handle UI accordingly
        fetchData(currentPage);
      } else {
        throw new Error("Failed to edit item");
      }
    })
    .catch((error) => {
      console.error("Error editing item:", error);
    });
}

function searchData() {
  const searchInput = document.getElementById("searchInput").value;
  const term = document.getElementById("search-term").value;
  // Fetch data based on search input
  fetch(`http://localhost:3000/search?term=${searchInput}&current_pge=${currentPage}&col=${term}`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error("Failed to fetch search results");
      }
    })
    .then((result) => {
      // Update table with search results
      data = result;
      updateTable();
    })
    .catch((error) => {
      console.error("Error searching data:", error);
    });
}

function clearSearch() {
  // Clear search input
  document.getElementById("searchInput").value = "";
  // Fetch all data again
  fetchData(currentPage);
}

/////////////////////////////////////////////////////////////////////////////////////
///// Open Close Modal
/////////////////////////////////////////////////////////////////////////////////////
var id;
function openModal(item, func) {
  const inputlist = [
    "nameInput",
    "fatherNameInput",
    "dobInput",
    "WhnoInput",
    "DistrictInput",
    "DivisionInput",
    "WardInput",
    "PostInput",
    "AddressInput",
    "AreaTypeInput",
    "VoterIdInput",
    "BloodGroupInput",
    "RefIdInput",
    "boothInput",
    "boothaddressInput",
  ];
  if (func == "edit") {
    inputlist.forEach((ele) => {
      document.getElementById(ele).disabled = false;
    });
    id = item.Id;
    document.getElementsByClassName("pagination")[0].style.display = "flex";
  } else {
    document.getElementsByClassName("pagination")[0].style.display = "none";
    inputlist.forEach((ele) => {
      document.getElementById(ele).disabled = true;
    });
  }
  var modal = document.getElementById("myModal");
  modal.style.display = "block";
  // You can populate these fields with actual data from your database
  document.getElementById("nameInput").value = item.Name;
  document.getElementById("fatherNameInput").value = item.FatherName;
  document.getElementById("dobInput").value = item.DOB.split("T")[0];
  document.getElementById("WhnoInput").value = item.WhNumber;
  document.getElementById("DistrictInput").value = item.District;
  document.getElementById("DivisionInput").value = item.Division;
  document.getElementById("WardInput").value = item.Ward;
  document.getElementById("PostInput").value = item.PostOffice;
  document.getElementById("AddressInput").value = item.Address;
  document.getElementById("AreaTypeInput").value = item.AreaType;
  document.getElementById("VoterIdInput").value = item.VoterId;
  document.getElementById("BloodGroupInput").value = item.BloodGroup;
  document.getElementById("RefIdInput").value = item.RefId;
  document.getElementById("boothInput").value = item.BoothNumber;
  document.getElementById("boothaddressInput").value = item.BoothAddress;

  const radioButtons = document.querySelectorAll("input[type=radio]");

  // Loop through radio buttons
  radioButtons.forEach((radioButton) => {
    // Check if the value matches the selectedValue
    if (
      radioButton.value === item.DirectSupport ||
      radioButton.value === item.IndirectSupport
    ) {
      radioButton.checked = true; // Set checked attribute
    }
  });
  // document.getElementById("AddressInput").value = item.Address;
}

function closeModal() {
  showPage(1);
  document.getElementById("myModal").style.display = "none";
}

/////////////////////////////////////////////////////////////////////////////////////
///// Change Pages
/////////////////////////////////////////////////////////////////////////////////////

function showPage(pageNumber) {
  const pages = document.querySelectorAll(".page");
  pages.forEach((page) => page.classList.remove("active"));
  const pageToShow = document.getElementById(`page${pageNumber}`);
  if (pageToShow) {
    pageToShow.classList.add("active");
  }
}

/////////////////////////////////////////////////////////////////////////////////////
///// District List
/////////////////////////////////////////////////////////////////////////////////////

var districtData;
fetch("./districts.json")
  .then((response) => response.json())
  .then((json) => {
    districtData = json["data"];
    const districtSelect = document.getElementById("DistrictInput");
    districtData.forEach(function (district) {
      const option = document.createElement("option");
      option.value = district.english;
      option.text = district.tamil;
      districtSelect.appendChild(option);
    });
  });
