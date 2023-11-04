// Elements object
const elements = {
  container: document.querySelector('.js-movie-list'),
  loadBtn: document.querySelector('.js-load-more'),
};

// Default markup values object
const defaults = {
  poster: 'https://www.reelviews.net/resources/img/default_poster.jpg',
  title: 'Title not found',
  date: 'XXXX-XX-XX',
  average: 'XX.XX',
};

// Variable for backend page number
let page = 1;

// Listener on a button
elements.loadBtn.addEventListener('click', handlerLoadMore);

// Callback function when clicking the LoadMore button, request to the backend, rendering markup
function handlerLoadMore() {
  page += 1;
  serviceFilms(page).then(data => {
    elements.container.insertAdjacentHTML(
      'beforeend',
      createMarkup(data.results)
    );
    if (data.page >= data.total_pages) {
      elements.loadBtn.classList.replace('load-more', 'load-more-hidden');
    }
  });
}

// Markup function
function createMarkup(arr) {
  return arr
    .map(
      ({
        poster_path,
        original_title,
        release_date,
        vote_average,
      }) => `<li class="movie-card">
         <img src="${
           poster_path
             ? 'https://image.tmdb.org/t/p/w300' + poster_path
             : 'default.poster'
         }" alt="${original_title || defaults.title}">
         <div class="movie-info">
            <h2>${original_title || defaults.title}</h2>
            <p>Release Date: ${release_date || defaults.date}</p>
            <p>Vote Average: ${vote_average || defaults.average}</p>
         </div>
      </li>`
    )
    .join('');
}

// Function for backend request
function serviceFilms(currentPage = '1') {
  const params = new URLSearchParams({
    page: currentPage,
    api_key: '345007f9ab440e5b86cef51be6397df1',
  });
  return fetch(`https://api.themoviedb.org/3/trending/movie/week?${params}`)
    .then(resp => {
      if (!resp.ok) {
        throw new Error('Error');
      }
      return resp.json();
    })
    .catch(err => {
      console.log(err);
      elements.loadBtn.classList.replace('load-more', 'load-more-hidden');
    });
}

// Calling the serviceFilms() function, first loading, rendering markup
serviceFilms()
  .then(data => {
    console.log(data);
    elements.container.insertAdjacentHTML(
      'beforeend',
      createMarkup(data.results)
    );
    // Show the button if the number of the displayed page is less than the number of backend pages
    if (data.page < data.total_pages) {
      elements.loadBtn.classList.replace('load-more-hidden', 'load-more');
    }
  })
  .catch(err => {
    console.log(err);
    elements.loadBtn.classList.replace('load-more', 'load-more-hidden');
  });
