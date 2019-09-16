// offline data is enabled
database.enablePersistence()
  .catch(function(err) {
    if (err.code == 'failed-precondition') {
      // probably multible tabs open at once
    } else if (err.code == 'unimplemented') {
      // lack of browser support for the feature
    }
  });


database.collection('movies').onSnapshot(snapshot => {
	snapshot.docChanges().forEach(change => {
		if(change.type === 'added'){
			// add the document data to the web page
			getMovie(change.doc.data(), change.doc.id);
		}
		if(change.type === 'removed'){
			// remove the document data from the web page
			delMovie(change.doc.id);
		}
	});
});

// adding new movies into database
const form = document.querySelector('form');
form.addEventListener('submit', event => {
	event.preventDefault();
  
  const movie = {
    naziv: form.title.value,
    opis: form.description.value
	};

  form.title.value = '';
  form.description.value = '';

  database.collection('movies').add(movie);

});

// delete movie
const allMovies = document.querySelector('.movies');
allMovies.addEventListener('click', event => {
	if(event.target.tagName === 'I'){
		var movieId = event.target.getAttribute("movie-id");
		database.collection('movies').doc(movieId).delete();
	}
})