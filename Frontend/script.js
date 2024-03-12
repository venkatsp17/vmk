function submitForm(event) {
  // Fetch form data

  const formData = new FormData(document.getElementById("memberForm"));

  // Convert FormData to JSON
  const jsonData = {};
  formData.forEach((value, key) => {
    jsonData[key] = value;
  });
  console.log(jsonData);

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
  //     // Optionally, you can redirect or display a success message here
  //   })
  //   .catch((error) => {
  //     console.error("Error:", error);
  //     // Handle error, display an error message, etc.
  //   });
}
