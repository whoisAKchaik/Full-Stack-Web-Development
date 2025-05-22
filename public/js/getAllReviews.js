import { fetchMethod } from './queryCmds.js';
import { setupEditHandlers, editReview } from './updateReview.js';
import { setupCreateHandlers, createReview } from './createReview.js';
import { setupDeleteHandlers, deleteReview } from './deleteReview.js';

document.addEventListener("DOMContentLoaded", function () {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const reviewList = document.getElementById("reviewList");

    if (userInfo) {
        fetchAndDisplayReviews(userInfo);
        setupCreateHandlers(userInfo);  

    } else {
        console.error("No user info found in local storage.");
        fetchAndDisplayReviews(null); // Fetch reviews for unauthenticated users
    }
});

export function fetchAndDisplayReviews(userInfo) {
    const reviewList = document.getElementById("reviewList");
    const callbackForDisplayReviews = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        reviewList.innerHTML = ''; // Clear previous reviews

        if (responseStatus == 404) {
            reviewList.innerHTML = `${responseData.message}`;
            return;
        }

        responseData.forEach((review) => {
            const displayItem = document.createElement("div");
            displayItem.className = "review-item";
            displayItem.innerHTML = `
                <div class="row">
                    <div class="col-auto">
                        <img src="images/user-profile-icon.jpg" class="profileSize" alt="profile">
                    </div>
                    <div class="col-11">
                        <div class="card custom-borderRadius">
                            <div class="card-body">
                                <div class="row d-flex justify-content-between">
                                    <div class="col-3">
                                        <h6 class="card-title">${review.username}</h6>
                                    </div>
                                    <div class="col-auto">
                                        <h6 class="card-title">${review.review_amt} out of 5</h6>
                                    </div>
                                </div>
                                <p class="card-text">${review.review_text}</p>
                            </div>
                        </div>
                        <div class="row d-flex justify-content-between">
                            <div class="col d-flex">
                                <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#editModal_${review.id}" data-review-id="${review.id}" data-review-text="${review.review_text}" data-review-amt="${review.review_amt}">
                                    <i class="bi bi-pencil-square editIcon"></i>
                                </button>        
                                <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#deleteModal_${review.id}" data-review-id="${review.id}">
                                    <i class="bi bi-trash editIcon"></i>
                                </button>  
                            </div>
                            <div class="col-auto pt-2">
                                <p class="d-flex flex-row-reverse dateStyle">${new Date(review.created_at).toLocaleString()}</p>
                            </div>
                        </div>

                        <!-- The edit Modal -->
                        <div class="modal fade" id="editModal_${review.id}" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered d-flex justify-content-center">
                                <div class="modal-content w-75">
                                    <!-- Modal body -->
                                    <div class="modal-body p-4">
                                        <form id="editForm_${review.id}" class="was-validated">
                                            <h5 class="my-3">Edit review</h5>
                                            <div class="input-fields">                                    
                                                <!-- Review input -->
                                                <div class="mb-3 mt-3">
                                                    <select id="selectRating_${review.id}" class="form-select" name="rating" required>
                                                        <option value="">Select a rating</option>
                                                        <option value="5">Excellent</option>
                                                        <option value="4">Very Good</option>
                                                        <option value="3">Average</option>
                                                        <option value="2">Poor</option>
                                                        <option value="1">Terrible</option>
                                                    </select>
                                                </div>

                                                <div class="form-floating pb-2">
                                                    <textarea class="form-control" placeholder="Leave a comment here" name="comment" id="comment_${review.id}" style="height: 100px"></textarea>
                                                    <label for="comment_${review.id}">Comments</label>
                                                </div>
                                                <!-- Submit button -->
                                                <div class="d-flex justify-content-end">
                                                    <button id="editBtn_${review.id}" type="button" data-review-id="${review.id}" data-mdb-button-init data-mdb-ripple-init class="btn btn-success pe-4"><i class="bi bi-check-lg p-1"></i>Confirm</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- The delete Modal -->
                        <div class="modal fade" id="deleteModal_${review.id}" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true">
                            <div class="modal-dialog modal-dialog-centered d-flex justify-content-center">
                                <div class="modal-content w-75">
                                    <!-- Modal body -->
                                    <div class="modal-body p-4">
                                        <form id="deleteForm_${review.id}" class="was-validated">
                                            <h5 class="my-3">Delete Survey Questions</h5>
                                            <div class="input-fields">
                                                <p id="deletingText_${review.id}" class="warningStyle">Are you sure you want to delete it?</p>                                        
                                                <!-- Submit button -->
                                                <div class="d-flex justify-content-end">
                                                    <button id="deleteBtn_${review.id}" type="submit" data-mdb-button-init data-mdb-ripple-init class="btn btn-success pe-4"><i class="bi bi-check-lg p-1"></i>Confirm</button>
                                                </div>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>                           
                    </div>
                </div>
            `;
            reviewList.appendChild(displayItem);
        });

        setupEditHandlers(userInfo);
        setupDeleteHandlers(userInfo);
        setupCreateHandlers(userInfo);

    };

    fetchMethod(currentUrl + `/api/reviews`, callbackForDisplayReviews, "GET", null);
}
