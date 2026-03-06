const userNameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const signIn = () => {
  if (userNameInput.value === "admin" && passwordInput.value === "admin123") {
    alert("Login success!");
    window.location.assign("../dashboard.html");
  } else {
    alert("invalid login credential");
    return;
  }
};
