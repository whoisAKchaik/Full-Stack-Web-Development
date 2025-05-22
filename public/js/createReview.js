import { fetchMethod } from './queryCmds.js';
import { fetchAndDisplayReviews } from './getAllReviews.js';

export function setupCreateHandlers(userInfo) {
    const createReviewBtn = document.getElementById('createReviewBtn');

    createReviewBtn.addEventListener('click', function () {
        if (!userInfo) {
            window.location.href = "login.html";
            return;
        }

        const reviewText = document.getElementById('comment').value;
        const reviewAmt = parseInt(document.getElementById('selectRating').value,10);
        const userId = JSON.parse(localStorage.getItem("userInfo")).user_id;

        createReview(userId, reviewText, reviewAmt);
    });
}

export function createReview(userId, reviewText, reviewAmt) {
    const callbackForCreateReview = (responseStatus, responseData) => {
        if (responseStatus === 201) {
            // Close the modal
            // const modal = document.getElementById(`creatReviewModal`);
            // const bootstrapModal = bootstrap.Modal.getInstance(modal);
            // bootstrapModal.hide();

            // // Refresh the questions list
            fetchAndDisplayReviews(userInfo);
        } else {
            console.error("Failed to create the review.");
        }
    };

    const data = {
        review_text: reviewText,
        review_amt: reviewAmt,
        user_id: userId
    };
    fetchMethod(currentUrl + `/api/reviews`, callbackForCreateReview, "POST", data);
}
