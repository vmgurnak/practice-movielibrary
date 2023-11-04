// Elements object
const elements = {
  container: document.querySelector('.js-movie-list'),
  guard: document.querySelector('.js-guard'),
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

// Intersection Observer
const options = {
  root: null,
  rootMargin: '50px',
  threshold: 0,
};
const observer = new IntersectionObserver(handlerLoadMore, options);

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
    // Call observer
    if (data.page < data.total_pages) {
      observer.observe(elements.guard);
    }
  })
  .catch(err => {
    console.log(err);
  });

// Callback function for Intersection Observer
function handlerLoadMore(entries, observer) {
  entries.forEach(entry => {
    console.log(entry);
    if (entry.isIntersecting) {
      page += 1;
      serviceFilms(page)
        .then(data => {
          elements.container.insertAdjacentHTML(
            'beforeend',
            createMarkup(data.results)
          );
          if (data.page >= data.total_pages) {
            observer.unobserve(elements.guard);
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  });
}
