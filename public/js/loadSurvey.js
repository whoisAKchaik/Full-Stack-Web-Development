document.addEventListener("DOMContentLoaded", function () {
    // Retrieve the token from local storage
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    const loadSurvey = document.getElementById("loadSurvey");

    loadSurvey.addEventListener("click", function (event) {
        event.preventDefault();

        //For route checking
        localStorage.setItem("loadSurvey", "YES");

        if (userInfo) {
            //redirect to survey.html
            window.location.href = "survey.html";
            localStorage.removeItem("loadSurvey");
        } else {
            //redirect to login.html
            window.location.href = "login.html";
        }
    });

});