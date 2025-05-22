import { fetchMethod } from './queryCmds.js';

document.addEventListener("DOMContentLoaded", function () {
    // Retrieve loadSurvey from local storage
    const loadSurvey = localStorage.getItem("loadSurvey");
  
    const signupForm = document.getElementById("signupForm");
    const warningCard = document.getElementById("warningCard");
    const warningText = document.getElementById("warningText");
  
    signupForm.addEventListener("submit", function (event) {
      event.preventDefault();
  
      const username = document.getElementById("username").value;
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
      const confirmPassword = document.getElementById("confirmPassword").value;
  
      // Perform signup logic
      if (password === confirmPassword) {
        // Passwords match, proceed with signup
        console.log("Signup successful");
        console.log("Username:", username);
        console.log("Email:", email);
        console.log("Password:", password);
        warningCard.classList.add("d-none");
  
        const data = {
          username: username,
          email: email,
          password: password,
        };

        const callbackForTokenVerification = (responseStatus, responseData) => {
          console.log("responseStatus (Token Verification):", responseStatus);
          console.log("responseData (Token Verification):", responseData);
    
          if (responseStatus === 200) {
              const userId = responseData.userId;
    
              const callbackForUserInfo = (responseStatus, responseData) => {
                  console.log("responseStatus (User Info):", responseStatus);
                  console.log("responseData (User Info):", responseData);
    
                  if (responseStatus === 200) {
                      // store user info in local storage
                      localStorage.setItem("userInfo", JSON.stringify(responseData));
                      console.log("qwfqef")
  
                      const callbackForEcoCadetInfo = (responseStatus, responseData) => {
                          console.log("responseStatus (Ecocadet Info):", responseStatus);
                          console.log("responseData (Ecocadet Info):", responseData);
  
                          if (responseStatus === 200) {
                              // store user info in local storage
                              localStorage.setItem("ecoCadetInfo", JSON.stringify(responseData));
                          } else {
                              console.log("asdf")
                              localStorage.removeItem("ecoCadetInfo");
                              console.error("Failed to fetch ecocadet info:", responseData.message);
                          }
                      };
                      // Fetch ecoCadet info using the userId
                      fetchMethod(currentUrl + `/api/users/${userId}/ecoCadet`, callbackForEcoCadetInfo, "GET", null);
                      
                      //To check whether the user wanted to attempt to login for the survey.
                      if (!loadSurvey){
                        // Redirect to profile page
                        window.location.href = "profile.html";
                      } else {
                        // Redirect to survey page
                        window.location.href = "survey.html";
                        localStorage.removeItem("loadSurvey");
                      }
                  } else {
                      console.error("Failed to fetch user info:", responseData.message);
                  }
              };
    
              // Fetch user info using the userId
              fetchMethod(currentUrl + `/api/users/${userId}`, callbackForUserInfo, "GET", null);
          } else {
              console.error("Token verification failed:", responseData.message);
          }
        };
  
        const callback = (responseStatus, responseData) => {
          console.log("responseStatus:", responseStatus);
          console.log("responseData:", responseData);
          if (responseStatus == 200) {
            // Check if signup was successful
            if (responseData.token) {
              // Store the token in local storage
              localStorage.setItem("token", responseData.token);

              // Verify the token and fetch user info
              fetchMethod(currentUrl + `/api/verify`, callbackForTokenVerification, "GET", null, responseData.token);
            }
          } else {
            warningCard.classList.remove("d-none");
            warningText.innerText = responseData.message;
          }
        };
  
        // Perform signup request
        fetchMethod(currentUrl + "/api/register", callback, "POST", data);
  
        // Reset the form fields
        signupForm.reset();
      } else {
        // Passwords do not match, handle error
        warningCard.classList.remove("d-none");
        warningText.innerText = "Passwords do not match";
      }
    });
});