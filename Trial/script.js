let currentSection = 1;
var Lat;
var Lon;
var Imgstr;
window.jsPDF = window.jspdf.jsPDF;

function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  } else {
    // x.innerHTML = "Geolocation is not supported by this browser.";
  }
}

////////////////////////////////////////////////////////////////////////////////////////
// Success Notificaiton
////////////////////////////////////////////////////////////////////////////////////////

const notificationContainer = document.getElementById("notificationContainer");
const successNotification = document.getElementById("successNotification");

function showSuccessNotification() {
  successNotification.style.display = "block";

  // Hide the notification after 3 seconds (adjust the time as needed)
  setTimeout(function () {
    successNotification.style.display = "none";
  }, 3000);
}

////////////////////////////////////////////////////////////////////////////////////////
// Lat & Long
////////////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////////////
// Step Indicators
////////////////////////////////////////////////////////////////////////////////////////

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

  // if (validateCurrentSection(section)) {
  const nextSectionDiv = document.querySelector(
    `.form-section[data-section="${section + 1}"]`
  );
  if (nextSectionDiv) {
    currentSectionDiv.style.display = "none";
    nextSectionDiv.style.display = "block";
    currentSection = section + 1;
    updateStepIndicator();
  }
  // }
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

////////////////////////////////////////////////////////////////////////////////////////
// Photo Upload
////////////////////////////////////////////////////////////////////////////////////////

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

////////////////////////////////////////////////////////////////////////////////////////
// Submit Form
////////////////////////////////////////////////////////////////////////////////////////

document.getElementById("sub-btn").addEventListener("click", function (event) {
  event.preventDefault();
  if (validateCurrentSection(3)) {
    const formData = new FormData(document.getElementById("memberForm"));

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
    jsonData["Latitude"] = Lat;
    jsonData["Longitude"] = Lon;
    jsonData["ImagePath"] = Imgstr;
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Months are zero-based
    const day = String(currentDate.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`;
    jsonData["DOJ"] = formattedDate;
    console.log(jsonData);
    // showSuccessNotification();
    setTimeout(() => {
      document.getElementsByClassName("container")[0].style.display = "none";
      document.getElementsByClassName("container2")[0].style.display = "none";
      document.getElementsByClassName("container1")[0].style.display = "flex";
      document.getElementsByClassName("container1")[0].style.justifyContent =
        "center";
      document.getElementsByClassName("container1")[0].style.alignItems =
        "center";
      var textnode = document.createTextNode(
        "https://chat.whatsapp.com/CsbrHpVK8jqEBBSsujWyLa"
      );
      var cardContent = ` <div class="identity-card" id="identity-card">
        <h2>Identity Card</h2>
        <img id="photo" src="profile.jpg" alt="Photo" />
        <p><strong>பெயர்:</strong> <span id="name">${jsonData["Name"]}</span></p>
        <p><strong>பிறந்த தேதி:</strong> <span id="age">${jsonData["DOB"]}</span></p>
        <p>
          <strong>முகவரி:</strong>
          <span id="address">${jsonData["Address"]}</span>
        </p>
        <p><strong>குருதி விவரம்:</strong> <span id="phone">${jsonData["BloodGroup"]}</span></p>
      </div><br>`;
      var anchornode = document.createElement("a");
      anchornode.appendChild(textnode);
      anchornode.style.display = "flex";
      anchornode.style.height = "inherit";
      anchornode.style.justifyContent = "center";
      anchornode.style.alignItems = "center";
      anchornode.href = "https://chat.whatsapp.com/CsbrHpVK8jqEBBSsujWyLa";
      anchornode.title = "https://chat.whatsapp.com/CsbrHpVK8jqEBBSsujWyLa";
      document.getElementsByClassName("container1")[0].innerHTML = cardContent;
      document.getElementsByClassName("container1")[0].appendChild(anchornode);
      const identityCard = document.getElementById("identity-card");

      // Use html2canvas to convert the identity card div to a canvas
      html2canvas(identityCard, {
        scale: 2, // Adjust scale if needed
      }).then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("landscape");

        // Add image to the PDF
        pdf.addImage(imgData, "PNG", 10, 10, 280, 180); // Adjust dimensions as needed

        // Download the PDF
        pdf.save("identity_card.pdf");
      });
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
    //     document.getElementsByClassName("container1").style.display =
    //       "block";
    //     document.getElementById("recaptcha-container").style.display =
    //       "none";
    //     // Optionally, you can redirect or display a success message here
    //   })
    //   .catch((error) => {
    //     console.error("Error:", error);
    //     // Handle error, display an error message, etc.
    //   });
  }
});

updateStepIndicator();

////////////////////////////////////////////////////////////////////////////////////////
// Validation
////////////////////////////////////////////////////////////////////////////////////////
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
      case "booth":
        if (input.value.length > 10) {
          alert("Booth Number should not exceed 10 characters.");
          return false;
        }
        break;
      case "boothaddress":
        if (input.value.length > 10) {
          alert("Booth Address should not exceed 500 characters.");
          return false;
        }
        break;
      case "refid":
        if (input.value.length > 12) {
          alert("Reference Voter ID should not exceed 12 characters.");
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
////////////////////////////////////////////////////////////////////////////////////////
// Dom Content Loaded
////////////////////////////////////////////////////////////////////////////////////////

document.getElementById("sub-btn").disabled = true;
document.getElementsByClassName("submitbtn")[0].style.backgroundColor = "grey";
document.addEventListener("DOMContentLoaded", function () {
  var container2 = document.getElementsByClassName("container2")[0];
  document.getElementsByClassName("container")[0].style.display = "block";
  document.getElementsByClassName("container2")[0].style.display = "block";
  document.getElementsByClassName("container1")[0].style.display = "none";
  container2.innerHTML = `<form action='#'>
     <h3>Mobile Number</h3>
     <h4>மொபைல் எண்</h4>
     <p>You'll receive an OTP to confirm this number.</p>
     <input
       type='tel'
       id='phone'
       name='phone'
       class='phone-input'
       placeholder='Enter your phone number'
       required
     />
     <br />
     <br />
     <button type='submit' class='submit-btn' id='next-btn-ph'>
       Next
     </button>
   </form>`;
  document
    .getElementById("next-btn-ph")
    .addEventListener("click", function (event) {
      event.preventDefault();
      signInWithPhoneNumber();
    });
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

// const phoneNumber = document.getElementById("whNumber").value;
////////////////////////////////////////////////////////////////////////////////////////
// Firebase Code
////////////////////////////////////////////////////////////////////////////////////////

const firebaseConfig = {
  apiKey: "AIzaSyAncEcCrnUyQurlkB8yFf0450vlw7-vE0g",
  authDomain: "vmk-tvl.firebaseapp.com",
  projectId: "vmk-tvl",
  storageBucket: "vmk-tvl.appspot.com",
  messagingSenderId: "235904375981",
  appId: "1:235904375981:web:9267a36a3e19e1a4ec3a24",
};
const app = firebase.initializeApp(firebaseConfig);
function signInWithPhoneNumber() {
  return new Promise((resolve, reject) => {
    var phoneNumber = "+91" + document.getElementById("phone").value;
    var container2 = document.getElementsByClassName("container2")[0];
    container2.innerHTML = `<h3>OTP Number</h3>
      <h4>OTP எண்</h4>
      <p>You'll receive an OTP to confirm this number.</p>
      <input
        type="number"
        id="otp"
        name="OTP"
        class="phone-input"
        placeholder="Enter your OTP code"
        required /><br /><br />;
      <button type="submit" class="submit-btn" id="otp-btn-ph">Submit</button>`;
    // document.getElementsByClassName("container2")[0].style.display = "none";
    // document.getElementsByClassName("container3")[0].style.display = "block";
    var recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "invisible",
      }
    );
    firebase
      .auth()
      .signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
      .then((confirmationResult) => {
        // SMS sent successfully
        document
          .getElementById("otp-btn-ph")
          .addEventListener("click", function (event) {
            event.preventDefault();
            var code = document.getElementById("otp").value;
            confirmationResult
              .confirm(code)
              .then((result) => {
                // User signed in successfully
                console.log("OTP verified", result.user);
                document.getElementsByClassName("container2")[0].style.display =
                  "none";
                document.getElementsByClassName("container")[0].style.display =
                  "block";
                resolve();
              })
              .catch((error) => {
                // Error occurred
                console.error("Error signing in:", error);
                reject(error);
              });
          });
      })
      .catch((error) => {
        // Error occurred during signInWithPhoneNumber
        console.error("Error signing in with phone number:", error);
        reject(error); // Reject the promise
      });
  });
}

////////////////////////////////////////////////////////////////////////////////////////
// RefId Check
////////////////////////////////////////////////////////////////////////////////////////

document.getElementById("ver-btn").addEventListener("click", function (event) {
  event.preventDefault();
  checkRefid();
});

function checkRefid() {
  const url = "http://localhost:3000/check-refid"; // Assuming this is your server endpoint
  refid = document.getElementById("refid").value;
  // Create a data object with the refid
  const data = { refid: refid };

  // Configure the fetch request
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  // Send the POST request
  fetch(url, requestOptions)
    .then((response) => {
      if (response.ok) {
        return response.text();
      } else {
        throw new Error("Network response was not ok.");
      }
    })
    .then((data) => {
      console.log(data); // Handle the response data
      if (data == "Verified!") {
        document.getElementsByClassName("responsetext")[0].style.color =
          "green";
        document.getElementsByClassName("responsetext")[0].innerHTML = data;
        document.getElementById("sub-btn").disabled = false;
        document.getElementsByClassName("submitbtn")[0].style.backgroundColor =
          "green"; 
      } else {
        document.getElementsByClassName("responsetext")[0].style.color = "red";
        document.getElementsByClassName("responsetext")[0].innerHTML = data;
        document.getElementsByClassName("submitbtn")[0].style.backgroundColor =
          "grey";
        document.getElementById("sub-btn").disabled = true;
      }
    })
    .catch((error) => {
      document.getElementsByClassName("submitbtn")[0].style.backgroundColor =
        "grey";
      document.getElementsByClassName("responsetext")[0].style.color = "red";
      document.getElementsByClassName("responsetext")[0].innerHTML = "Error!";
      console.error("Error occurred:", error);
      document.getElementById("ver-btn").disabled = true;
    });
}
