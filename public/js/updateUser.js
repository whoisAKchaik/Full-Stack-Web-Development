import { fetchMethod } from './queryCmds.js';

document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the token from local storage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    //console.log(typeof(userInfo));  // Log userInfo

    // Check if the token exists
    if (userInfo) {
        const userId = userInfo.user_id;
        //console.log("userId", userId);  // Log userId 
        const callbackForEditForm = (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);
        
            const existanceAlert = document.getElementById("existanceAlert");
            if (responseStatus === 409) {
                existanceAlert.innerHTML = `
                    Username already exits!
                `;
                editForm.reset();
            }

            if (responseStatus === 200) {
                // Remove the edit form modal
                const myModal = document.getElementById("myModal");
                editForm.reset();
                myModal.remove();

                //reload current url
                window.location.href = "profile.html";
            }
        };

        const editForm = document.getElementById("editForm");
        
        editForm.addEventListener("submit", function (event) {
            console.log("editForm.addEventListener");
            event.preventDefault();
        
            const username = document.getElementById("username").value;
        
            const data = {
                username: username
            };
            // Perform login request
            fetchMethod(currentUrl + `/api/users/${userId}`, callbackForEditForm, "PUT", data);
        
            // // Reset the form fields
            // editForm.reset();
            // editForm.remove();
        });

        // Reset feedback message when the modal is shown
        document.getElementById('myModal').addEventListener('shown.bs.modal', function() {
            const existanceAlert = document.getElementById("existanceAlert");
            existanceAlert.innerHTML = `Please enter a username.`;
            editForm.reset();
        });
    }  else {
        console.error("No userInfo found in local storage.");
    }
});