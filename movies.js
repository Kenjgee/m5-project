const API_KEY = "f6cd60c2";
const API_URL = "https://www.omdbapi.com/";

const MAX_MOVIES = 16;

const movieGrid = document.getElementById("movieGrid");
const spinner = document.getElementById("spinner");
const noResults = document.getElementById("noResults");
const apiError = document.getElementById("apiError");
const resultsCount = document.getElementById("resultsCount");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const sortSelect = document.getElementById("sortSelect");

const urlParams = new URLSearchParams(window.location.search);
let currentQuery = urlParams.get("s") || "";
let currentMovies = [];

function setLoading(isLoading) {
  searchBtn.classList.toggle("loading", isLoading);
  searchBtn.disabled = isLoading;
}

async function fetchMovies(query) {
  spinner.hidden = false;
  setLoading(true);
  noResults.hidden = true;
  apiError.hidden = true;
  movieGrid.innerHTML = "";
  resultsCount.textContent = "Search results:";
  try {
    const request1 = `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=1`;
    const request2 = `${API_URL}?apikey=${API_KEY}&s=${encodeURIComponent(query)}&page=2`;
    const response1 = await fetch(request1);
    const data1 = await response1.json();

    if (data1.Response === "False") {
      spinner.hidden = true;
      setLoading(false);
      noResults.hidden = false;
      currentMovies = [];
      return;
    }

    let all = data1.Search.slice();

    const response2 = await fetch(request2);
    const data2 = await response2.json();
    if (data2.Response === "True") {
      all = all.concat(data2.Search);
    }

     currentMovies = all.slice(0, MAX_MOVIES);
  } catch (err) {
    spinner.hidden = true;
    setLoading(false);
    apiError.hidden = false;
    currentMovies = [];
    return;
  }

  spinner.hidden = true;
  setLoading(false);
  sortAndRender(sortSelect.value);
}

function onSearchChange(event) {
  currentQuery = event.target.value.trim();
}
function onSearchClick() {
  doSearch();
}
function onSearchSubmit(event) {
  event.preventDefault();
  currentQuery = event.target.querySelector("#searchInput").value.trim();
  doSearch();
}

function doSearch() {
  if (searchBtn.disabled) return; // already searching
  if (currentQuery !== "") {
    fetchMovies(currentQuery);
  }
}

function onSortChange(event) {
  sortAndRender(event.target.value);
}

function getYear(movie) {
  const match = String(movie.Year).match(/\d{4}/);
  return match ? Number(match[0]) : 0;
}

function sortAndRender(mode) {
  const list = currentMovies.slice();

  if (mode === "desc") {
    list.sort(function (a, b) { return getYear(b) - getYear(a); });
    } else if (mode === "asc") {
    list.sort(function (a, b) { return getYear(a) - getYear(b); });
    }
    renderMovies(list);
}

function makeMovieCard(movie) {
  const card = document.createElement("article");
  card.className = "movie-card";
  const posterHtml =
    movie.Poster && movie.Poster !== "N/A"
      ? `<img class="movie-poster" src="${movie.Poster}" alt="${movie.Title} poster" loading="lazy" onerror="onPosterError(this)" />`
      : `<div class="no-poster"><i class="fa-regular fa-image"></i><span>No poster</span></div>`;
      card.innerHTML = `
    ${posterHtml}
    <h3 class="movie-title">${movie.Title}</h3>
    <p class="movie-year">${movie.Year}</p>
  `;

  return card;
}

function onPosterError(img) {
  const holder = document.createElement("div");
  holder.className = "no-poster";
  holder.innerHTML = `<i class="fa-regular fa-image"></i><span>No poster</span>`;
  img.replaceWith(holder);
}

function renderMovies(list) {
  movieGrid.innerHTML = "";

  resultsCount.textContent = `Search results: ${list.length} ${list.length === 1 ? "movie" : "movies"} found`;
if (list.length === 0) {
    noResults.hidden = false;
    return;
  }
for (let i = 0; i < list.length; i++) {
    movieGrid.appendChild(makeMovieCard(list[i]));
  }
}

searchInput.value = currentQuery;
fetchMovies(currentQuery);