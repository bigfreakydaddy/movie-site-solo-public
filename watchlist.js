let watchlistFeedHTML = document.getElementById("watchlist-feed")

function parseJSON(){
    return JSON.parse(localStorage.getItem("watchlist")) || []}

function renderWatchlist(){
    let watchlist = parseJSON()
    watchlistFeedHTML.innerHTML = ``
    
    console.log(watchlist)
    if (watchlist.length === 0 )
    {
        watchlistFeedHTML.innerHTML = `<div id="no-movies"><i class="fa-solid fa-square-plus"></i><a href="index.html">click here to add some movies</a></div>`
    }
    else{ 
        watchlistFeedHTML.innerHTML = ``
        for (const movie of watchlist)
            {
                const storedWatchlist = parseJSON()
                const isMovieSaved = storedWatchlist?.some(saved =>saved.imdbID === movie.imdbID)
                const watchlistButton = isMovieSaved 
                    ? `<i class="fa-solid fa-circle-minus"></i> Remove` 
                    : `<i class="fa-solid fa-circle-plus"></i> Watchlist`
                
                watchlistFeedHTML.innerHTML+=  `<div class="movie">
                    <div class="movie-image"> 
                        <img src="${movie.poster}">
                    </div>
                    
                    <div class="movie-bio">
                        <div class="title-rating">
                            <p class="movie-title">${movie.title}</p>
                            <i class="fa-solid fa-star"></i> 
                            <p class="movie-rating">${movie.rating || "N/A"}</p>
                        </div>
                        
                        <div class="movie-details">
                            <div class="length-genres-watchlist">
                                <div class="runtime">${movie.runtime || "N/A"}</div>
                                <div class="genre">${movie.genre || "N/A"}</div>
                                <button class="watchlist-btn" data-imdb-id="${movie.imdbID}" >
                                ${watchlistButton}   
                                </button> 
                            </div>
                        </div>
                        
                        <div class="film-description">
                            <p>${movie.filmDesc || "No description available"}</p>
                        </div>
                        
                    </div> 
                </div>
                <hr class="bottom-line">
                `
            }
    }
    
}

watchlistFeedHTML.addEventListener("click", function (e) 
{
    const button = e.target.closest(".watchlist-btn")
    if (!button ||button.disabled) 
    {
    return
    }
    button.disabled = true
    // logs id 
    const imdbID = button.dataset.imdbId
    console.log(imdbID)
    
    
    let watchlist = parseJSON()
    for (const movie of watchlist)
        {
        if (watchlist.some(movie => movie.imdbID === imdbID)){
        let watchlistData = watchlist.filter(movie => movie.imdbID !== imdbID)
        localStorage.setItem("watchlist", JSON.stringify(watchlistData));
        renderWatchlist()
        }
         
    }
    
    }
)
renderWatchlist()