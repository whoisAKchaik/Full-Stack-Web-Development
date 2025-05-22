
// /////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////
// /////////////////////////////////////////////////////////////////////////////////
// document.addEventListener("DOMContentLoaded", function () {
//   const loginForm = document.getElementById("loginForm");
//   const warningCard = document.getElementById("warningCard");
//   const warningText = document.getElementById("warningText");

//   const callbackForTokenVerification = (responseStatus, responseData) => {
//       console.log("responseStatus (Token Verification):", responseStatus);
//       console.log("responseData (Token Verification):", responseData);

//       if (responseStatus === 200) {
//           const userId = responseData.userId;

//           const callbackForUserInfo = (responseStatus, responseData) => {
//               console.log("responseStatus (User Info):", responseStatus);
//               console.log("responseData (User Info):", responseData);

//               if (responseStatus === 200) {
//                   // store user info in local storage
//                   localStorage.setItem("userInfo", JSON.stringify(responseData));

//                   // Redirect to profile page
//                   window.location.href = "profile.html";
//               } else {
//                   console.error("Failed to fetch user info:", responseData.message);
//                 }
//           };

//           // Fetch user info using the userId
//           fetchMethod(currentUrl + `/api/users/${userId}`, callbackForUserInfo, "GET", null);
//       } else {
//           console.error("Token verification failed:", responseData.message);
//       }
//   };

//   const loginCallback = (responseStatus, responseData) => {
//       console.log("responseStatus (Login):", responseStatus);
//       console.log("responseData (Login):", responseData);

//       if (responseStatus === 200) {
//           if (responseData.token) {
//               // Store the token in local storage
//               localStorage.setItem("token", responseData.token);

//               // Verify the token and fetch user info
//               fetchMethod(currentUrl + `/api/verify`, callbackForTokenVerification, "GET", null, responseData.token);
//           }
//       } else {
//           warningCard.classList.remove("d-none");
//           warningText.innerText = responseData.message;
//       }
//   };

//   loginForm.addEventListener("submit", function (event) {
//       event.preventDefault();

//       const username = document.getElementById("username").value;
//       const password = document.getElementById("password").value;

//       const data = { username, password };

//       // Perform login request
//       fetchMethod(currentUrl + "/api/login", loginCallback, "POST", data);

//       // Reset the form fields
//       loginForm.reset();
//   });
// });



/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////
import { fetchMethod } from './queryCmds.js';

document.addEventListener("DOMContentLoaded", function () {
    const loginForm = document.getElementById("loginForm");
    const warningCard = document.getElementById("warningCard");
    const warningText = document.getElementById("warningText");
  
    // Retrieve loadSurvey from local storage
    const loadSurvey = localStorage.getItem("loadSurvey");

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

                    const callbackForEcoCadetInfo = (responseStatus, responseData) => {
                        console.log("responseStatus (Ecocadet Info):", responseStatus);
                        console.log("responseData (Ecocadet Info):", responseData);

                        if (responseStatus === 200) {
                            // store user info in local storage
                            localStorage.setItem("ecoCadetInfo", JSON.stringify(responseData));
                        } else {
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
  
    const loginCallback = (responseStatus, responseData) => {
        console.log("responseStatus (Login):", responseStatus);
        console.log("responseData (Login):", responseData);
  
        if (responseStatus === 200) {
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
  
    loginForm.addEventListener("submit", function (event) {
        event.preventDefault();
  
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
  
        const data = { username, password };
  
        // Perform login request
        fetchMethod(currentUrl + "/api/login", loginCallback, "POST", data);
  
        // Reset the form fields
        loginForm.reset();
    });
});
  