/*document.querySelector(".login").onclick = () => {
    const username = document.getElementById("username");
    const password = document.getElementById("password");

    if (username.value === "admin" && password.value === "admin1") {
        window.location.href = "homepage.html";
    } else {
        username.style.border = "2px solid red";
        password.style.border = "2px solid red";

    }
};*/

document.addEventListener("DOMContentLoaded", () => {
    document.querySelector(".login").onclick = (event) => {
        event.preventDefault(); // Stop the form from submitting

        const username = document.getElementById("username");
        const password = document.getElementById("password");

        if (username.value === "admin" && password.value === "admin1") {
            window.location.href = "homepage.html";
        } else {
            username.style.border = "2px solid red";
            password.style.border = "2px solid red";
        }
    };
});






document.querySelector(".signup-btn").onclick = () => {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmpassword = document.getElementById("confirmpassword").value;
    

    if(username ==="admin" && email ==="admin@gmail.com")
        {
            window.location.href="homepage.html"
        }
};
