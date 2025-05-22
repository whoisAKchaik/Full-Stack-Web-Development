document.addEventListener("DOMContentLoaded", function () {
  const loginButton = document.getElementById("loginButton");
  const registerButton = document.getElementById("registerButton");
  const profileDropdown = document.getElementById("profileDropdown");
  const logoutButton = document.getElementById("logoutButton");

  // Check if token exists in local storage
  const token = localStorage.getItem("token");
  if (token) {
    // Token exists, show profile dropdown and logout button, hide login and register buttons
    profileDropdown.classList.remove("d-none");
    logoutButton.classList.remove("d-none");
    loginButton.classList.add("d-none");
    registerButton.classList.add("d-none");
  } else {
    // Token does not exist, show login and register buttons, hide profile dropdown and logout button
    profileDropdown.classList.add("d-none");
    logoutButton.classList.add("d-none");
    loginButton.classList.remove("d-none");
    registerButton.classList.remove("d-none");
  }

  logoutButton.addEventListener("click", function () {
    // Remove the token from local storage and redirect to index.html
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    localStorage.removeItem("ecoCadetInfo");
    localStorage.removeItem("loadSurvey");
    window.location.href = "index.html";
  });
});
