import { fetchMethod } from './queryCmds.js';
import { fetchAndDisplayReviews } from './getAllReviews.js';

export function setupEditHandlers(userInfo) {
    const editBtns = document.querySelectorAll('[id^="editBtn_"]');
    editBtns.forEach((edit) => {
        edit.addEventListener("click", function (event) {
            event.preventDefault();
            if (!userInfo) {
                window.location.href = "login.html";
                return;
            }
            const userId = JSON.parse(localStorage.getItem("userInfo")).user_id;
            const reviewId = edit.id.replace('editBtn_', '');
            const reviewText = document.getElementById(`comment_${reviewId}`).value;
            const reviewAmt = parseInt(document.getElementById(`selectRating_${reviewId}`).value,10);
            console.log(userId);
            editReview(userId, reviewId, reviewText, reviewAmt);

        });
        // Add an event listener to reset the message when the modal is shown
        const reviewId = edit.id.replace('editBtn_', '');
        const editModal = document.getElementById(`editModal_${reviewId}`);
        editModal.addEventListener('hidden.bs.modal', function () {
            fetchAndDisplayReviews(userInfo);                                     
        }); 
    });

}

export function editReview(userId, reviewId, reviewText, reviewAmt, userInfo) {
    const callbackForEditingReview = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        if (responseStatus === 403) {
            const modalBody = document.querySelector(`#editModal_${reviewId} .input-fields`);
            modalBody.innerHTML = `
                <p class="warningStyle">You do not have permission to edit it.</p>
            `;
            return;
        }

        if (responseStatus == 204) {
            // Close the modal
            const modal = document.getElementById(`editModal_${reviewId}`);
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
            bootstrapModal.hide();

            // Refresh the questions list
            fetchAndDisplayReviews(userInfo);
        }
    };

    const data = {
        id: reviewId,
        review_text: reviewText,
        review_amt: reviewAmt,
        user_id: userId
    };
    fetchMethod(currentUrl + `/api/reviews/${reviewId}`, callbackForEditingReview, "PUT", data);
}
