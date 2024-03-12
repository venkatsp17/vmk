let currentSection = 1;
var Lat;
var Lon;
var Imgstr;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    // x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

const notificationContainer = document.getElementById("notificationContainer");
const successNotification = document.getElementById("successNotification");

// Show the success notification
function showSuccessNotification() {
  successNotification.style.display = "block";

  // Hide the notification after 3 seconds (adjust the time as needed)
  setTimeout(function () {
    successNotification.style.display = "none";
  }, 3000);
}

function showPosition(position) {
  //   x.innerHTML =
  //     "Latitude: " +
  //     position.coords.latitude +
  //     "<br>Longitude: " +
  //       position.coords.longitude;
  //   console.log("Latitude:");
  //   console.log(position.coords.latitude);
  Lat = position.coords.latitude;
  //   console.log("Longitude:");
  Lon = position.coords.longitude;
  //   console.log(position.coords.longitude);
}
getLocation();

function updateStepIndicator() {
  const stepNumbers = document.querySelectorAll(".step-number");

  stepNumbers.forEach((step, index) => {
    if (index + 1 === currentSection) {
      step.classList.add("active");
    } else {
      step.classList.remove("active");
    }
  });
}

function nextSection(section) {
  const currentSectionDiv = document.querySelector(
    `.form-section[data-section="${section}"]`
  );

  if (validateCurrentSection(section)) {
    const nextSectionDiv = document.querySelector(
      `.form-section[data-section="${section + 1}"]`
    );
    if (nextSectionDiv) {
      currentSectionDiv.style.display = "none";
      nextSectionDiv.style.display = "block";
      currentSection = section + 1;
      updateStepIndicator();
    }
  }
}

function prevSection(section) {
  const currentSectionDiv = document.querySelector(
    `.form-section[data-section="${section}"]`
  );
  const prevSectionDiv = document.querySelector(
    `.form-section[data-section="${section - 1}"]`
  );

  if (prevSectionDiv) {
    currentSectionDiv.style.display = "none";
    prevSectionDiv.style.display = "block";
    currentSection = section - 1;
    updateStepIndicator();
  }
}
function uploadAndConvert() {
  const imageInput = document.getElementById("imageInput");
  const resultContainer = document.getElementById("resultContainer");
  const profilePic = document.getElementById("profilePic");
  //   const imageString = document.getElementById("imageString");

  // Check if a file is selected
  if (imageInput.files.length > 0) {
    const file = imageInput.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      // Convert the image to a base64 string
      const base64String = e.target.result;
      // Display the base64 string
      //   imageString.value = base64String;
      Imgstr = base64String;
      // Display the selected image as a profile picture
      profilePic.src = base64String;
      // You can perform additional actions with the base64 string if needed
    };

    // Read the file as a data URL
    reader.readAsDataURL(file);

    // Display the result container
    // resultContainer.style.display = "block";
  } else {
    alert("Please choose an image file before uploading.");
  }
}

document
  .getElementById("memberForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();
    const formData = new FormData(document.getElementById("memberForm"));

    // Convert FormData to JSON
    const jsonData = {};
    formData.forEach((value, key) => {
      jsonData[key] = value;
    });
    jsonData["Latitude"] = Lat;
    jsonData["Longitude"] = Lon;
    jsonData["ImagePath"] = Imgstr;
    console.log(jsonData);
    showSuccessNotification();
    setTimeout(() => {
      document.getElementsByClassName("container")[0].style.display = "none";
      document.getElementsByClassName("container1")[0].style.display = "block";
      var textnode = document.createTextNode("Link1");
      var anchornode = document.createElement("a");
      anchornode.appendChild(textnode);
      anchornode.style.display = "flex";
      anchornode.style.height = "inherit";
      anchornode.style.justifyContent = "center";
      anchornode.style.alignItems = "center";
      anchornode.href = "Link1";
      anchornode.title = "Link1";
      document.getElementsByClassName("container1")[0].appendChild(anchornode);
    }, 3000);

    // Make a POST request using Fetch API
    // fetch("http://localhost:3000/submitForm", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify(jsonData),
    // })
    //   .then((response) => {
    //     if (!response.ok) {
    //       throw new Error("Network response was not ok");
    //     }
    //     return response.json();
    //   })
    //   .then((data) => {
    //     console.log("Success:", data);
    //     showSuccessNotification();
    //     setTimeout(() => {}, 3000);
    //     document.getElementsByClassName("container").style.display = "none";
    //     document.getElementsByClassName("container1").style.display = "block";
    //     // Optionally, you can redirect or display a success message here
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //     // Handle error, display an error message, etc.
    //   });
  });

updateStepIndicator();

function validateCurrentSection(section) {
  const inputs = document.querySelectorAll(
    `.form-section[data-section="${section}"] input`
  );
  const textarea = document.querySelector(
    `.form-section[data-section="${section}"] textarea`
  );
  const imageInput = document.getElementById("imageInput");

  for (const input of inputs) {
    if (input.type !== "file" && input.value.trim() === "") {
      alert("Please fill in all the required fields before proceeding.");
      return false;
    }

    // Add specific validation for each input type as needed
    switch (input.id) {
      case "name":
        if (input.value.length > 255) {
          alert("Name should not exceed 255 characters.");
          return false;
        }
        break;
      case "fatherName":
        if (input.value.length > 255) {
          alert("Father's Name should not exceed 255 characters.");
          return false;
        }
        break;
      case "whNumber":
        if (!/^\d{1,10}$/.test(input.value)) {
          alert(
            "WhatsApp Number should be a numeric value with a maximum of 10 digits."
          );
          return false;
        }
        break;
      case "district":
        if (input.value.length > 50) {
          alert("District should not exceed 50 characters.");
          return false;
        }
        break;
      case "division":
        if (input.value.length > 50) {
          alert("Division should not exceed 50 characters.");
          return false;
        }
        break;
      case "ward":
        if (input.value.length > 50) {
          alert("Ward should not exceed 50 characters.");
          return false;
        }
        break;
      case "postOffice":
        if (input.value.length > 100) {
          alert("Post Office should not exceed 100 characters.");
          return false;
        }
        break;
      case "voterId":
        if (input.value.length > 12) {
          alert("Voter ID should not exceed 12 characters.");
          return false;
        }
        break;
      case "bloodGroup":
        if (input.value.length > 5) {
          alert("Blood Group should not exceed 5 characters.");
          return false;
        }
        break;
      case "occupation":
        if (input.value.length > 30) {
          alert("Occupation should not exceed 30 characters.");
          return false;
        }
        break;
      // Add additional cases for other inputs as needed
    }
  }

  // Validate textarea
  if (textarea && textarea.value.trim() === "") {
    alert("Please fill in all the required fields before proceeding.");
    return false;
  }

  // Validate ImagePath (file size)
  if (imageInput.files.length > 0) {
    const fileSize = imageInput.files[0].size;
    const maxSize = 1024 * 1024; // 1MB

    if (fileSize > maxSize) {
      alert("Image size should be less than 1MB.");
      return false;
    }
  }

  // All validations passed
  return true;
}

// Districts

document.addEventListener("DOMContentLoaded", function () {
  document.getElementsByClassName("container")[0].style.display = "block";
  document.getElementsByClassName("container1")[0].style.display = "none";
  var districtData;
  fetch("./districts.json")
    .then((response) => response.json())
    .then((json) => {
      districtData = json["data"];
      const districtSelect = document.getElementById("district");
      districtData.forEach(function (district) {
        const option = document.createElement("option");
        option.value = district.english;
        option.text = district.tamil;
        districtSelect.appendChild(option);
      });
    });
});
