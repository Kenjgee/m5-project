let homeQuery = "";
function onSearchChange(event) {
  homeQuery = event.target.value.trim();
}
function onSearchClick() {
  goToMoviesPage();
}
function onSearchSubmit(event) {
  event.preventDefault();
  homeQuery = event.target.querySelector("#homeInput").value.trim();
  goToMoviesPage();
}

function goToMoviesPage() {
  if (homeQuery === "") {
    window.location.href = "movies.html";
  } else {window.location.href = `movies.html?s=${encodeURIComponent(homeQuery)}`;
  }
}

function onContactSubmit(event) {
  event.preventDefault();
   const contactFeedback = document.getElementById("contactFeedback");
  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();

  if (!name || !email.includes("@")) {
    contactFeedback.textContent = "Please enter a valid name and email.";
    contactFeedback.className = "search-feedback none";
    return;
  }

   contactFeedback.textContent = `Thanks, ${name}! We'll get back to you at ${email}.`;
  contactFeedback.className = "search-feedback found";

   event.target.reset();
}