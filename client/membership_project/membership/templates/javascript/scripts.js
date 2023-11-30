
document.addEventListener("DOMContentLoaded", function() {
    const passwordInput = document.getElementById("password");
    const confirmPasswordInput = document.getElementById("confirm_password");
    const form = document.querySelector("form");

    form.addEventListener("submit", function(event) {
        if (passwordInput.value !== confirmPasswordInput.value) {
            alert("Password and confirm password do not match!");
            event.preventDefault();
        }
    });
});
