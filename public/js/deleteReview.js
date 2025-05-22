import { fetchMethod } from './queryCmds.js';
import { fetchAndDisplayReviews } from './getAllReviews.js';

export function setupDeleteHandlers(userInfo) {
    const deleteBtns = document.querySelectorAll('[id^="deleteBtn_"]');
    deleteBtns.forEach((del) => {
        del.addEventListener("click", function (event) {
            event.preventDefault();
            if (!userInfo) {
                window.location.href = "login.html";
                return;
            }
            const userId = JSON.parse(localStorage.getItem("userInfo")).user_id;
            const reviewId = del.id.replace('deleteBtn_', '');
            deleteReview(userId, reviewId);

        });
        // Add an event listener to reset the message when the modal is shown
        const reviewId = del.id.replace('deleteBtn_', '');
        const delModal = document.getElementById(`deleteModal_${reviewId}`);
        delModal.addEventListener('hidden.bs.modal', function () {
            fetchAndDisplayReviews(userInfo);                                     
        }); 
    });

}

export function deleteReview(userId, reviewId, userInfo) {
    const callbackForDeletingReview = (responseStatus, responseData) => {
        console.log("responseStatus:", responseStatus);
        console.log("responseData:", responseData);

        if (responseStatus === 403) {
            const modalBody = document.querySelector(`#deleteModal_${reviewId} .input-fields`);
            modalBody.innerHTML = `
                <p class="warningStyle">You do not have permission to delete it.</p>
            `;
            return;
        }

        if (responseStatus == 204) {
            // Close the modal
            const modal = document.getElementById(`deleteModal_${reviewId}`);
            const bootstrapModal = bootstrap.Modal.getInstance(modal);
            bootstrapModal.hide();

            // Refresh the questions list
            fetchAndDisplayReviews(userInfo);
        }
    };

    const data = {
        id: reviewId,
        user_id: userId
    };
    fetchMethod(currentUrl + `/api/reviews/${reviewId}`, callbackForDeletingReview, "DELETE", data);
}
