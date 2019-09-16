if('serviceWorker' in navigator){
  navigator.serviceWorker.register('/serviceworker.js')
  .then(registration => {
    console.log("Service worker je registriran s dosegom: ", registration.scope);
  }).catch(error => {
    console.log("Registracija service workera nije uspjela:", error)
  })
}


document.addEventListener('DOMContentLoaded', function() {
  // nav menu
  const menus = document.querySelectorAll('.side-menu');
  M.Sidenav.init(menus, {edge: 'right'});
  // add movie form
  const forms = document.querySelectorAll('.side-form');
  M.Sidenav.init(forms, {edge: 'left'});
});
    


function getMovie(data, id){
  const movies = document.querySelector('.movies');

  var newMovie = `
  <div class="card-panel movie white row" movie-id="${id}">
    <img src="/img/movie.png" alt="movie thumb">
    <div class="movie-details">
      <div class="movie-title">${data.naziv}</div>
      <div class="movie-description">${data.opis}</div>
    </div>
    <div class="movie-delete">
      <i class="material-icons" movie-id="${id}">delete_outline</i>
    </div>
  </div>
  `;

  movies.innerHTML += newMovie;
}
  
function delMovie(movieId){
  movie = document.querySelector(`.movie[movie-id=${movieId}]`);
  movie.remove();
}