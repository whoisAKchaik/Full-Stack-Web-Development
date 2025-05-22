import { fetchMethod } from './queryCmds.js';

document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the token from local storage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    //console.log(typeof(userInfo));  // Log userInfo

    // Check if the token exists
    if (userInfo) {
        const userId = userInfo.user_id;
        //console.log("userId", userId);  // Log userId 

        const callbackForCreateCadetForm = (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);
        
            const cadetExistanceAlert = document.getElementById("cadetExistanceAlert");
            if (responseStatus === 409) {
                cadetExistanceAlert.innerHTML = `
                    Cadetname already exits!
                `;
                createCadetForm.reset();
                
            } else if (responseStatus === 403) {
                const cadetExistanceAlert = document.getElementById("cadetExistanceAlert");
                cadetExistanceAlert.innerHTML = `
                    Uh oh! No enough points! Take survey to earn points!
                `;
                createCadetForm.reset();
            }

            if (responseStatus === 200) {
                // Remove the edit form modal
                const createCadetModal = document.getElementById("createCadetModal");
                createCadetForm.reset();
                createCadetModal.remove();

                //fetch eco-cadet info
                const callbackForCadetInfo = (responseStatus, responseData) => {
                    console.log("responseStatus (Ecocadet Info):", responseStatus);
                    console.log("responseData (Ecocadet Info):", responseData);

                    if (responseStatus === 200) {
                        // store user info in local storage
                        localStorage.setItem("ecoCadetInfo", JSON.stringify(responseData));
                        //reload current url
                        window.location.href = "profile.html";
                    } else {
                        localStorage.removeItem("ecoCadetInfo");
                        console.error("Failed to fetch ecocadet info:", responseData.message);
                    }
                };
                fetchMethod(currentUrl + `/api/users/${userId}/ecoCadet`, callbackForCadetInfo, "GET");
            }
        };

        const createCadetForm = document.getElementById("createCadetForm");

        createCadetForm.addEventListener("submit", function (event) {
            console.log("createCadetForm.addEventListener");
            event.preventDefault();
        
            const cadetname = document.getElementById("cadetname").value;
        
            const data = {
                cadet_name: cadetname
            };
            // Perform createCadet request
            fetchMethod(currentUrl + `/api/users/${userId}/ecoCadet`, callbackForCreateCadetForm, "POST", data);
        
            // // Reset the form fields
            // editForm.reset();
            // editForm.remove();
        });

        // Reset feedback message when the modal is shown
        document.getElementById('createCadetModal').addEventListener('shown.bs.modal', function() {
            const cadetExistanceAlert = document.getElementById("cadetExistanceAlert");
            cadetExistanceAlert.innerHTML = `Please enter a cadet-name.`;
            createCadetForm.reset();
        });
    }  else {
        console.error("No userInfo found in local storage.");
    }
});