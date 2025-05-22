import { fetchMethod } from './queryCmds.js';

document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the token from local storage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const questionsList = document.getElementById("questionsList");

    if (userInfo) {
        const userId = userInfo.user_id;

        const fetchAndDisplayQuestions = () => {

            const callbackForDisplayQuestions = (responseStatus, responseData) => {
                console.log("responseStatus:", responseStatus);
                console.log("responseData:", responseData);

                questionsList.innerHTML = ''; // Clear previous questions

                if (responseStatus == 404) {
                    questionsList.innerHTML = `${responseData.message}`;
                    return;
                }

                // if (responseStatus === 200) {
                //     // store user info in local storage
                //     localStorage.setItem("userInfo", JSON.stringify(responseData));

                // Display survey questions
                responseData.forEach((question) => {
                    const displayItem = document.createElement("div");
                    displayItem.id = "displayItemParent"; 
                    displayItem.className = "col-md-12 p-1";
                    displayItem.innerHTML = `
                        <div class="card custom-borderRadius">
                            <div class="card-body">
                                <div class="row d flex justify-content-between">
                                    <div class="col-10 question-container">
                                        <h5 class="card-title">Q ${question.question_id}: ${question.question}</h5>
                                    </div>
                                    <div class="col-2 d-flex flex-row-reverse">
                                        <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#editModal_${question.question_id}" data-question-id="${question.question_id}" data-question-text="${question.question}">
                                            <i class="bi bi-pencil-square editIcon"></i>
                                        </button>        
                                        <button type="button" class="btn" data-bs-toggle="modal" data-bs-target="#deleteModal_${question.question_id}" data-question-id="${question.question_id}">
                                            <i class="bi bi-trash editIcon"></i>
                                        </button>                                
                                    </div>
                                </div>                            
                                
                                <form class="question-form">
                                    <input type="hidden" name="question_id" value="${question.question_id}">
                                    <p class="card-text">
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="answer_${question.question_id}" value="yes" id="yes_${question.question_id}">
                                            <label class="form-check-label" for="yes_${question.question_id}">
                                                Yes
                                            </label>
                                        </div>
                                        <div class="form-check">
                                            <input class="form-check-input" type="radio" name="answer_${question.question_id}" value="no" id="no_${question.question_id}" checked>
                                            <label class="form-check-label" for="no_${question.question_id}">
                                                No
                                            </label>
                                        </div>
                                        <div class="form-floating pb-2">
                                            <textarea class="form-control" placeholder="Leave a comment here" name="comment_${question.question_id}" id="comment_${question.question_id}" style="height: 100px"></textarea>
                                            <label for="comment_${question.question_id}">Comments</label>
                                        </div>
                                        <div class="d-flex justify-content-between">
                                            <div class="submit-btn-container">
                                                <button type="submit" class="btn btn-primary submit-btn">Submit</button>
                                            </div>
                                            <div id="pointer" class="d-flex flex-row-reverse">
                                                <p class="show-responses" data-question-id="${question.question_id}">Show other responses <i class="bi bi-chevron-down"></i></p>
                                            </div>
                                        </div>
                                    </p>
                                </form>
                                <div class="responses-container" id="responses_${question.question_id}" style="display: none;"></div>

                                <!-- The edit Modal -->
                                <div class="modal fade" id="editModal_${question.question_id}" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true">
                                    <div class="modal-dialog modal-dialog-centered d-flex justify-content-center">
                                        <div class="modal-content w-75">
                                            <!-- Modal body -->
                                            <div class="modal-body p-4">
                                                <form id="editForm_${question.question_id}" class="was-validated">
                                                    <div>
                                                        <h5 class="my-3">Edit Survey Questions</h5>
                                            
                                                        <!-- Questions input -->
                                                        <div class="mb-3 mt-3">
                                                            <input type="text" class="form-control" id="question_${question.question_id}" value="${question.question}" required>
                                                            <div id="validAlert_${question.question_id}" class="valid-feedback ms-1 warningStyle" style="color: #118087; font-size: small;">Questions should only be binary questions(yes/no)!</div>
                                                            <div id="existanceAlert_${question.question_id}" class="invalid-feedback ms-1 warningStyle">Please enter a question.</div>
                                                        </div>
                                            
                                                        <!-- Submit button -->
                                                        <div class="d-flex justify-content-end">
                                                            <button id="editBtn_${question.question_id}" type="submit" data-mdb-button-init data-mdb-ripple-init class="btn btn-success pe-4"><i class="bi bi-check-lg p-1"></i>Confirm</button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                </div>   

                                <!-- The delete Modal -->
                                <div class="modal fade" id="deleteModal_${question.question_id}" tabindex="-1" aria-labelledby="myModalLabel" aria-hidden="true">
                                    <div class="modal-dialog modal-dialog-centered d-flex justify-content-center">
                                        <div class="modal-content w-75">
                                            <!-- Modal body -->
                                            <div class="modal-body p-4">
                                                <form id="deleteForm_${question.question_id}" class="was-validated">
                                                    <div>
                                                        <h5 class="my-3">Delete Survey Questions</h5>
                                                        <p id="deletingText_${question.question_id}" class="warningStyle">Are you sure you want to delete Q.${question.question_id}?</p>                                        
                                                        <!-- Submit button -->
                                                        <div class="d-flex justify-content-end">
                                                            <button id="deleteBtn_${question.question_id}" type="submit" data-mdb-button-init data-mdb-ripple-init class="btn btn-success pe-4"><i class="bi bi-check-lg p-1"></i>Confirm</button>
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
                    questionsList.appendChild(displayItem);

                    // Add event listener for showing responses
                    const showResponses = displayItem.querySelector(".show-responses");
                    showResponses.addEventListener("click", function () {
                        const questionId = this.getAttribute("data-question-id");
                        const responsesContainer = document.getElementById(`responses_${questionId}`);
                        
                        if (!responsesContainer.classList.contains("expanded")) {
                            const callbackForDisplayAnswers = (responseStatus, responseData) => {
                                console.log("responseStatus:", responseStatus);
                                console.log("responseData:", responseData);

                                if (responseStatus == 404) {
                                    console.log("sth wrong");
                                    return;
                                }

                                responsesContainer.innerHTML = ""; // Clear previous responses
                                responseData.forEach(response => {
                                    const responseItem = document.createElement("div");
                                    responseItem.className = "response-item";
                                    responseItem.innerHTML = `
                                        <div class="row align-items-start">
                                            <div class="col-auto">
                                                <img src="images/user-profile-icon.jpg" class="profileSize" alt="profile">
                                            </div>
                                            <div class="col">
                                                <div class="card custom-borderRadius">
                                                    <div class="card-body">
                                                    <h6 class="card-title">${response.username}</h6>
                                                    <p class="card-text">${response.answer ? "Yes" : "No"}. ${response.additional_notes}</p>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <p class="d-flex flex-row-reverse size">${new Date(response.creation_date).toLocaleString()}</p>
                                    `;
                                    responsesContainer.appendChild(responseItem);
                                });

                                responsesContainer.style.display = "block";
                                setTimeout(() => {
                                    responsesContainer.classList.add("expanded");
                                }, 100); // Slight delay to allow for transition
                                showResponses.innerHTML = "Hide responses <i class='bi bi-chevron-up'></i>";
                            };
                            fetchMethod(currentUrl + `/api/questions/${questionId}/answers`, callbackForDisplayAnswers, "GET", null);
                        } else {
                            responsesContainer.classList.remove("expanded");
                            setTimeout(() => {
                                responsesContainer.style.display = "none";
                            }, 500); 
                            showResponses.innerHTML = "Show other responses <i class='bi bi-chevron-down'></i>";
                        }
                    });

                    // Attach event listeners to each form for submitting answers
                    const form = displayItem.querySelector(".question-form");
                    form.addEventListener("submit", function (event) {
                        event.preventDefault();

                        const formData = new FormData(form);
                        const questionId = formData.get("question_id");
                        const answer = formData.get(`answer_${questionId}`) === "yes"; // Converts "Yes" to true, otherwise false                    
                        const comment = formData.get(`comment_${questionId}`);

                        // Handle form submission (e.g., send data to the server)
                        console.log("Question ID:", questionId);
                        console.log("Answer:", answer);
                        console.log("Comment:", comment);

                        //Send data to the server using fetch
                        const data = {
                            user_id: userId,
                            answered_question_id: questionId,
                            answer: answer,
                            additional_notes: comment
                        };
                        
                        const callbackForAnsweringQuestions = (responseStatus, responseData) => {
                            console.log("responseStatus:", responseStatus);
                            console.log("responseData:", responseData);

                            if (responseStatus == 404) {
                                console.log("sth wrong");
                                return;
                            }

                            if (responseStatus == 201) {
                                // Replace the submit button with the thanks message
                                const submitBtnContainer = form.querySelector(".submit-btn-container");
                                submitBtnContainer.innerHTML = "<p>Thank you for your response!</p>";
                                return;
                            }
                        };

                        fetchMethod(currentUrl + `/api/questions/${questionId}/answers`, callbackForAnsweringQuestions, "POST", data);
                    });


                    // Event listener for the edit button
                    const editForms = document.querySelectorAll('[id^="editForm_"]');
                    editForms.forEach((form) => {
                        form.addEventListener("submit", function (event) {
                            event.preventDefault();

                            const questionId = form.id.replace('editForm_', '');
                            const questionText = document.getElementById(`question_${questionId}`).value;

                            const data = {
                                question_id: questionId,
                                question: questionText,
                                user_id: userId

                            };

                            const callbackForEditingQuestions = (responseStatus, responseData) => {
                                console.log("responseStatus:", responseStatus);
                                console.log("responseData:", responseData);
                                const existanceAlert = document.getElementById(`existanceAlert_${questionId}`);
                                const validAlert = document.getElementById(`validAlert_${questionId}`);
                                if (responseStatus === 403) {
                                    validAlert.style.display = 'none'; // Hide the alert if the status is not 403
                                    existanceAlert.innerHTML = `
                                        Uh oh! Question does not belong to you!
                                    `;
                                    existanceAlert.style.display = 'block'; // Ensure the alert is visible
                                    const reset = document.getElementById(`question_${question.question_id}`).value = "";
                                    
                                    // Reset feedback message when the modal is shown 
                                    document.getElementById(`editModal_${question.question_id}`).addEventListener('hidden.bs.modal', function() {
                                        const existanceAlert = document.getElementById(`existanceAlert_${question.question_id}`);
                                        existanceAlert.innerHTML = `Please enter a question.`;
                                    });
                                }

                                if (responseStatus == 200) {
                                    // Close the modal
                                    const modal = document.getElementById(`editModal_${questionId}`);
                                    const bootstrapModal = bootstrap.Modal.getInstance(modal);
                                    bootstrapModal.hide();

                                    // Refresh the questions list
                                    fetchAndDisplayQuestions();
                                }
                            };

                            fetchMethod(currentUrl + `/api/questions/${questionId}`, callbackForEditingQuestions, "PUT", data);
                        });
                    });

                });
                
                // Attach event listeners to all delete buttons
                const deleteBtns = document.querySelectorAll('[id^="deleteBtn_"]');
                deleteBtns.forEach(button => {
                    button.addEventListener('click', function (event) {
                        event.preventDefault();

                        const questionId = button.id.replace('deleteBtn_', '');

                        // Call delete function
                        deleteQuestion(userId, questionId);
                    });    
                    // Add an event listener to reset the message when the modal is shown
                    const questionId = button.id.replace('deleteBtn_', '');
                    const deleteModal = document.getElementById(`deleteModal_${questionId}`);
                    deleteModal.addEventListener('hidden.bs.modal', function () {
                        const deletingText = document.getElementById(`deletingText_${questionId}`);
                        deletingText.innerHTML = `Are you sure you want to delete Q.${questionId}?`;
                        const deletingBtn = document.getElementById(`deleteBtn_${questionId}`);
                        deletingBtn.style.display = 'block'; // Display the button                                        
                    });                 
                });

                //Delete function
                function deleteQuestion(userId, questionId) {
                    const callbackForDeleteQuestion = (responseStatus, responseData) => {
                        console.log("responseStatus:", responseStatus);
                        console.log("responseData:", responseData);
                        const deletingText = document.getElementById(`deletingText_${questionId}`);

                        if (responseStatus === 403) {                            
                            deletingText.innerHTML = `
                            Uh oh! You do not have permission to delete this question!
                            `;
                            const deletingBtn = document.getElementById(`deleteBtn_${questionId}`);
                            deletingBtn.style.display = 'none'; // Hide the button if the status is 403                            console.error("You do not have permission to delete this question.");                          
                            return;
                        }

                        if (responseStatus === 204) {
                            // Remove the question from the DOM
                            // Close the modal
                            const modal = document.getElementById(`deleteModal_${questionId}`);
                            const bootstrapModal = bootstrap.Modal.getInstance(modal);
                            bootstrapModal.hide();

                            // Refresh the questions list
                            fetchAndDisplayQuestions();
                            console.log("Question deleted successfully.");
                        } else {
                            console.error("Failed to delete the question.");
                        }
                    };

                    const data = {
                        question_id: questionId,
                        user_id: userId
                    };
                    fetchMethod(currentUrl + `/api/questions/${questionId}`, callbackForDeleteQuestion, "DELETE", data);
                }
            };

            fetchMethod(currentUrl + `/api/questions`, callbackForDisplayQuestions, "GET", null);
        };
        fetchAndDisplayQuestions();

    } else {
        console.error("No userinfo found in local storage.");
    }
});
