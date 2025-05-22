import { fetchMethod } from './queryCmds.js';

document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the userInfo from local storage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    //console.log(typeof(userInfo));  // Log userInfo

    // Check if the token exists
    if (userInfo) {
        const userId = userInfo.user_id;
        //console.log("userId", userId);  // Log userId 
        const callbackForUserInfo = (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);
        
            //Get html element by id
            const userInfo = document.getElementById("userInfo");
            const userActivity = document.getElementById("userActivity");
        
            if (responseStatus == 404) {
                userInfo.innerHTML = `${responseData.message}`;
                userActivity.remove();
                return;
            }
        
            //Display userInfo
            userInfo.innerHTML = `
                User ID: ${responseData.user_id} <br>
                Username: ${responseData.username} <br>
                Email: ${responseData.email}
            `;

            //Display userActivity
            userActivity.innerHTML = `
                <div class="col-md-5 vstack gap-2">
                    <div class="shadow text-center pointsBg">
                        <p class="pt-2">Points</p>
                        <p style="font-weight: 1000; font-size: 20px;">${responseData.points}</p>
                    </div>
                    <div class="shadow text-center questionBg">
                        <p class="pt-2">Completed Questions</p>
                        <p style="font-weight: 1000; font-size: 20px;">${responseData.completed_questions}</p>
                    </div>
                </div>
            `;
        };

        fetchMethod(currentUrl + `/api/users/${userId}`, callbackForUserInfo);
    }  else {
        console.error("No token found in local storage.");
    }
});