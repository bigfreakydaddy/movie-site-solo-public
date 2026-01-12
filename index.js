const movieSearchBar = document.getElementById("movie-search");
const searchButton = document.getElementById("search-button");
let searchFeedHTML = document.getElementById("movie-list");
let watchlistFeedHTML = document.getElementById("watchlist-feed");
let apiKey = null;

let falseResponseMessage = `
                    <div id="film-search-error"> 
                        <div id="film-icon">
                            <h1 id="error-message">
                                <i class="fa-solid fa-triangle-exclamation"></i>
                                not working
                                <i class="fa-solid fa-triangle-exclamation"></i>
                             </h1>
                             <p>Possible Errors</p>
                             
                                <p class="errors">search not specific enough</p>
                                <p class="errors">no internet connection</p>
                                <p class="errors">search to long</p>
                            </ul>
                        </div> 
                    </div>`;
// <p>Too many search results</p>

function parseJSON() {
  return JSON.parse(localStorage.getItem("watchlist")) || [];
}

let watchlistData = parseJSON();

searchFeedHTML.innerHTML = `
    <div id="no-film-search"> 
        <div id="no-film-search-child">
            <i class="fa-solid fa-film"></i>
            <p id="start-message">Start exploring</p> 
        </div>
    </div>
`;

searchButton.addEventListener("click", async () => {
  let movieSearch = movieSearchBar.value.trim();
  searchFeedHTML.innerHTML = ``;

  if (!movieSearch) {
    searchFeedHTML.innerHTML = `<p id="film-search-error"><i class="fa-solid fa-triangle-exclamation"></i> Please enter something to search <i class="fa-solid fa-triangle-exclamation"></i></p>`;
    document.getElementById("movie-search").focus();
    return;
  }

  const searchResponse = await fetch(
    `https://www.omdbapi.com/?s=${movieSearch}&type=movie&apikey=${apiKey}`
  );

  const searchData = await searchResponse.json();

  if (searchData.Response === "False") {
    searchFeedHTML.innerHTML = ``;
    searchFeedHTML.innerHTML = falseResponseMessage;
    return;
  }

  const movies = searchData.Search;

  for (const movie of movies) {
    const idResponse = await fetch(
      `https://www.omdbapi.com/?i=${movie.imdbID}&type=movie&apikey=${apiKey}`
    );
    const idData = await idResponse.json();

    const storedWatchlist = parseJSON();
    const isMovieSaved = storedWatchlist?.some(
      (saved) => saved.imdbID === movie.imdbID
    );
    const watchlistButton = isMovieSaved
      ? `<i class="fa-solid fa-circle-minus"></i> Remove`
      : `<i class="fa-solid fa-circle-plus"></i> Watchlist`;

    searchFeedHTML.innerHTML += `   <div class="movie">
                    <div class="movie-image"> 
                        <img class="image "src="${movie.Poster}">
                    </div>
                    
                    <div class="movie-bio">
                        <div class="title-rating">
                            <p class="movie-title">${movie.Title}</p>
                            <i class="fa-solid fa-star"></i> 
                            <p class="movie-rating">${
                              idData.Ratings?.[0]?.Value || "N/A"
                            }</p>
                        </div>
                        
                        <div class="movie-details">
                            <div class="length-genres-watchlist">
                                <div class="runtime">${
                                  idData.Runtime || "N/A"
                                }</div>
                                <div class="genre">${
                                  idData.Genre || "N/A"
                                }</div>
                                <button class="watchlist-btn" data-imdb-id="${
                                  movie.imdbID
                                }" >
                                ${watchlistButton}   
                                </button> 
                            </div>
                        </div>
                        
                        <div class="film-description">
                            <p>${idData.Plot || "No description available"}</p>
                        </div>
                        
                    </div> 
                </div>
                <hr class="bottom-line">
                `;
  }
});

searchFeedHTML.addEventListener("click", function (e) {
  const button = e.target.closest(".watchlist-btn");
  if (!button || button.disabled) {
    return;
  }
  button.disabled = true;
  // logs id
  const imdbID = button.dataset.imdbId;

  watchlistData = parseJSON();

  if (watchlistData.some((movie) => movie.imdbID === imdbID)) {
    watchlistData = watchlistData.filter((movie) => movie.imdbID !== imdbID);
    localStorage.setItem("watchlist", JSON.stringify(watchlistData));
    button.innerHTML = `<i class="fa-solid fa-circle-plus"></i> Watchlist`;
    button.disabled = false;
  } else {
    const saveMovie = button.closest(".movie");

    const movieData = {
      poster: saveMovie.querySelector(".image").getAttribute("src"),
      imdbID: button.dataset.imdbId,
      title: saveMovie.querySelector(".movie-title").textContent,
      rating: saveMovie.querySelector(".movie-rating").textContent,
      runtime: saveMovie.querySelector(".runtime").textContent,
      genre: saveMovie.querySelector(".genre").textContent,
      filmDesc: saveMovie.querySelector(".film-description p").textContent,
    };

    watchlistData.push(movieData);
    localStorage.setItem("watchlist", JSON.stringify(watchlistData));
    button.innerHTML = `<i class="fa-solid fa-circle-minus"></i> Remove`;
    button.disabled = false;
  }

  watchlistData = parseJSON();
  console.log(watchlistData);
});
