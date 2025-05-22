import { fetchMethod } from './queryCmds.js';

document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the ecoCadetInfo, userInfo from local storage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const ecoCadetInfo = JSON.parse(localStorage.getItem("ecoCadetInfo"));
    console.log("cadetInfo:", ecoCadetInfo);  // Log ecoCadetInfo


    const cadetImage = document.getElementById("cadetImage");
    const ecoCadetId = document.getElementById("ecoCadetId");
    const allAssetsHeader = document.getElementById("allAssetsHeader");
    const allAssetsContainer = document.getElementById("allAssetsContainer");
    const inventoryCount = document.getElementById("inventoryCount");
    const inventoryList = document.getElementById("inventoryList");

    // Check if the ecoCadetInfo exists
    if (ecoCadetInfo) {
        const ecoCadetId = ecoCadetInfo.cadet_id;
        const userId = userInfo.user_id;
        console.log("ecoCadetInf", ecoCadetInfo);  // Log ecoCadetId 

        const callbackForEcoCadetInfo = (responseStatus, responseData) => {
            console.log("responseStatus:", responseStatus);
            console.log("responseData:", responseData);
            //console.log(typeof(responseData));  // Log responseData

            const ecoCadetId = document.getElementById("ecoCadetId");

        
            if (responseStatus == 404) {
                ecoCadetId.innerHTML = `${responseData.message}`;
                return;
            }
            
            if (responseData[0].cadet_name && responseData[0].cadet_id) {
                // Display cadet-name and its id
                cadetImage.innerHTML = `
                    <img src="images/profile.png" class="img-fluid mx-auto d-block" alt="profile">
                `;

                // Display cadet-name and its id
                ecoCadetId.innerHTML = `
                    ${responseData[0].cadet_name} #${responseData[0].cadet_id}
                `;
                // Display inventoryCount
                inventoryCount.innerHTML = `
                ( ${responseData.length} )
                `;
            } else {
                console.error("cadet_name or cadet_id not found in responseData");

            }

            //Display cadet's inventory
            responseData.forEach((inventory) => {
                const displayItem = document.createElement("div");
                displayItem.className =
                  "col-md-4 p-1";
                displayItem.innerHTML = `
                    <div class="card custom-borderRadius">
                        <img src="images/sunflower.jpg" class="img-fluid mx-auto d-block" alt="seed">
                        <div class="card-body">
                            <h5 class="card-title">ID: ${inventory.inventory_id}</h5>
                            <p class="card-text">
                                seed_name: ${inventory.seed_name} <br>
                                seed_type: ${inventory.seed_type}
                            </p>
                        </div>
                    </div>
                `;
                inventoryList.appendChild(displayItem);
            });
        };

        if(ecoCadetInfo.asset === 1) {
            fetchMethod(currentUrl + `/api/users/${userId}/ecoCadet/${ecoCadetId}`, callbackForEcoCadetInfo, "GET", null);
        } else {
            // Display cadet-name and its id
            cadetImage.innerHTML = `
            <img src="images/profile.png" class="img-fluid mx-auto d-block" alt="profile">
            `;

            // Display cadet-name and its id
            const ecoCadetId = document.getElementById("ecoCadetId");
            ecoCadetId.innerHTML = `
                ${ecoCadetInfo.cadet_name} #${ecoCadetInfo.cadet_id}
            `;
            // Display inventoryCount
            const inventoryCount = document.getElementById("inventoryCount");
            inventoryCount.innerHTML = `
            ( 0 )
            `;

            //allAssetsContainer.remove();
            const allAssetsContainer = document.getElementById("allAssetsContainer");
            allAssetsContainer.classList.add("d-flex", "align-items-center", "justify-content-center");
            allAssetsContainer.innerHTML = `
                <h5 class="my-main-header">
                    You do not own any seed.
                </h5>
            `;

        }

    }  else {
       //Create new eco-cadet

        cadetImage.innerHTML = `
            <img src="images/createNew.png" class="img-fluid mx-auto d-block" alt="create">
        `;
        ecoCadetId.innerHTML = `
            Be The Game-Changer Today! <button type="button" class="button" data-bs-toggle="modal" data-bs-target="#createCadetModal"><span>GO </span></button>
            <!-- Create new eco-cadet -->
            <!-- The Modal -->
            <div class="modal" id="createCadetModal">
                <div class="modal-dialog modal-dialog-centered d-flex justify-content-center">
                <div class="modal-content w-75">
                    <!-- Modal body -->
                    <div class="modal-body p-4">
                        <form id="createCadetForm" class="was-validated">
                            <div>
                                <h5 class="my-3">Create an Eco-cadet</h5>
                    
                                <!-- Cadet-name input -->
                                <div class="mb-3 mt-3">
                                    <input type="text" class="form-control" id="cadetname" placeholder="Enter cadet-name" required>
                                    <div class="valid-feedback ms-1" style="color: #118087; font-size: small;">Your cadet-name represents you!</div>
                                    <div id="cadetExistanceAlert" class="invalid-feedback ms-1" style="color: red; font-size: small;">Please enter a cadet-name.</div>
                                </div>
                    
                                <!-- Submit button -->
                                <div class="d-flex justify-content-end">
                                    <button type="submit" data-mdb-button-init data-mdb-ripple-init class="btn btn-success pe-4"><i class="bi bi-check-lg p-1"></i>Confirm</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
                </div>
            </div>
        `;
        allAssetsHeader.remove();
        allAssetsContainer.remove();
        //console.error("No ecoCadetInfo found in local storage.");
    }
});


