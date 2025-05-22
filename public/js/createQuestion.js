import { fetchMethod } from './queryCmds.js';

document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the token from local storage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    //console.log(typeof(userInfo));  // Log userInfo

    // Check if the userInfo exists
    if (userInfo) {
        const userId = userInfo.user_id;
        //console.log("userId", userId);  // Log userId 

        const callbackForCreateQuestionForm = (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);

            if (responseStatus === 201) {
                // Remove the edit form modal
                const creatQuestionModal = document.getElementById("creatQuestionModal");
                // creatQuestionForm.reset();
                creatQuestionModal.remove();
                //reload current url
                window.location.href = "survey.html";
            }
        };

        const creatQuestionForm = document.getElementById("creatQuestionForm");

        creatQuestionForm.addEventListener("submit", function (event) {
            //console.log("creatQuestionForm.addEventListener");
            event.preventDefault();
        
            const question = document.getElementById("question").value;
        
            const data = {
                question: question,
                user_id: userId
            };
            // Perform createCadet request
            fetchMethod(currentUrl + `/api/questions`, callbackForCreateQuestionForm, "POST", data);
        
        });

        // Reset feedback message when the modal is shown
        // document.getElementById('createCadetModal').addEventListener('shown.bs.modal', function() {
        //     const cadetExistanceAlert = document.getElementById("cadetExistanceAlert");
        //     cadetExistanceAlert.innerHTML = `Please enter a cadet-name.`;
        //     createCadetForm.reset();
        // });
    }  else {
        console.error("No userInfo found in local storage.");
    }
});