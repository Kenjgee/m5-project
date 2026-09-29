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

async function onContactSubmit(event) {
  event.preventDefault(); // stop the page from reloading

  const form = event.target; // event.target is the <form> that was submitted
  const feedback = document.getElementById("contactFeedback");
  const sendBtn = form.querySelector("button");

  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const message = document.getElementById("contactMessage").value.trim();

  if (!name || !email.includes("@") || !message) {
    feedback.textContent = "Please fill in every box (with a valid email).";
    feedback.className = "search-feedback none";
    return;
  }

  const templateParams = {
    user_name: name,
    user_email: email,
    message: message
  };

  sendBtn.disabled = true;
  feedback.textContent = "Sending...";
  feedback.className = "search-feedback";

  try {    
    await emailjs.send("service_ynh8isc", "template_pkb8gqj", templateParams);

    feedback.textContent = `Thanks, ${name}! Your message was sent.`;
    feedback.className = "search-feedback found";
    form.reset();
  } catch (err) {
    feedback.textContent = "Something went wrong sending your message. Please try again.";
    feedback.className = "search-feedback none";
  } finally {
    sendBtn.disabled = false;
  }
}