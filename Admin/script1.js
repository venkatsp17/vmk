/////////////////////////////////////////////////////////////////////////////////////
///// District Pie Chart
/////////////////////////////////////////////////////////////////////////////////////

fetch("http://localhost:3000/district-count")
  .then((response) => response.json())
  .then((data) => {
    // Extract district names and counts from the data
    const districts = data.map((entry) => entry.District);
    const counts = data.map((entry) => entry.count);

    // Render pie chart
    renderPieChart(districts, counts);
  })
  .catch((error) => console.error("Error fetching data:", error));

function renderPieChart(labels, data) {
  const ctx = document.getElementById("districtChart").getContext("2d");
  new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          label: "District Count",
          data: data,
          backgroundColor: [
            "rgba(255, 99, 132, 0.5)",
            "rgba(54, 162, 235, 0.5)",
            "rgba(255, 206, 86, 0.5)",
            "rgba(75, 192, 192, 0.5)",
            "rgba(153, 102, 255, 0.5)",
            "rgba(255, 159, 64, 0.5)",
            "rgba(255, 99, 132, 0.5)",
            "rgba(233, 99, 132, 0.5)",
            "rgba(124, 99, 132, 0.5)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
            "rgba(255, 206, 86, 1)",
            "rgba(75, 192, 192, 1)",
            "rgba(153, 102, 255, 1)",
            "rgba(255, 159, 64, 1)",
            "rgba(255, 99, 132, 1)",
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      title: {
        display: true,
        text: "District Count",
      },
    },
  });
}

/////////////////////////////////////////////////////////////////////////////////////
///// Enable/Disable District Chart
/////////////////////////////////////////////////////////////////////////////////////

document
  .getElementById("chart-enable-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();
    var chart = document.getElementById("districtChart").style;
    var chart1 = document.getElementById("chartContainer").style;
    if (chart.display == "block") {
      chart.display = "none";
    } else {
      chart1.display = "none";
      chart.display = "block";
    }
  });

document
  .getElementById("chart-enable-btn1")
  .addEventListener("click", function (event) {
    event.preventDefault();
    var chart = document.getElementById("districtChart").style;
    var chart1 = document.getElementById("chartContainer").style;
    if (chart1.display == "block") {
      chart1.display = "none";
    } else {
      chart.display = "none";
      chart1.display = "block";
    }
  });

/////////////////////////////////////////////////////////////////////////////////////
///// District Dropdown
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

/////////////////////////////////////////////////////////////////////////////////////
///// Download PDF
/////////////////////////////////////////////////////////////////////////////////////

document
  .getElementById("downloadpdf")
  .addEventListener("click", function (event) {
    const val = document.getElementById("DistrictInput").value;
    window.location.href = `http://localhost:3000/export-pdf?district=${encodeURIComponent(
      val
    )}`;
  });

document.addEventListener("DOMContentLoaded", function (event) {
  var chart1 = document.getElementById("chartContainer").style;
  chart1.display = "none";
});

document
  .getElementById("chart-enable-btn1")
  .addEventListener("click", function () {
    var chart1 = document.getElementById("chartContainer").style;
    chart1.display = "block";
    fetch("http://localhost:3000/members")
      .then((response) => response.json())
      .then((data) => {
        const ageRanges = {
          "0-20": 0,
          "20-30": 0,
          "30-40": 0,
          "40-50": 0,
          "50-60": 0,
          "60 and above": 0,
        };

        data.forEach((member) => {
          const age = calculateAge(member.DOB);
          if (age <= 20) {
            ageRanges["0-20"]++;
          } else if (age <= 30) {
            ageRanges["20-30"]++;
          } else if (age <= 40) {
            ageRanges["30-40"]++;
          } else if (age <= 50) {
            ageRanges["40-50"]++;
          } else if (age <= 60) {
            ageRanges["50-60"]++;
          } else {
            ageRanges["60 and above"]++;
          }
        });

        const chartPoints = Object.keys(ageRanges).map((range) => ({
          label: range,
          y: ageRanges[range],
        }));

        const chart = new CanvasJS.Chart("chartContainer", {
          animationEnabled: true,
          title: {
            text: "Age Range of Members",
          },
          axisX: {
            title: "Age Range",
            labelFontSize: 12,
            labelFontColor: "black",
          },
          axisY: {
            title: "Number of Members",
            labelFontSize: 14,
            labelFontColor: "black",
            gridColor: "lightgray",
            tickColor: "lightgray",
          },
          data: [
            {
              type: "column",
              dataPoints: chartPoints,
              color: "#007bff", // Custom column color
            },
          ],
        });

        chart.render();
      })
      .catch((error) => {
        console.error("Error fetching member data:", error);
      });
  });

function calculateAge(birthday) {
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
}
