import React, { useState } from "react";
import MoviesList from "./components/MoviesList";
import "./App.css";

function App() {
  const [isloading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [retrytimer, setReTryTimer] = useState();
  const [check, setCheck] = useState(false);

  async function fetchMoviesHandler() {
    setIsLoading(true);
    setError(null);

    try{
      const response = await fetch("https://swapi.dev/api/films/");
       if(!response.ok){
        throw new Error ('Something went wrong. Retrying...!');
       }    

      const data = await response.json();
      const transformedMovies = data.results.map((movieData) => {
      return {
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDate: movieData.release_date,
      };
    });
    setMovies(transformedMovies);
    
    }catch(error){
      setError(error.message)
      setCheck(true);
      const retimer = setTimeout(() => {
        fetchMoviesHandler();
      }, 5000)
      setReTryTimer(retimer);
      console.log(retimer);
    }
    setIsLoading(false);  
  }

  let content = <p>Found no movies.</p>
  if(movies.length > 0){
    content = <MoviesList movies={movies} />
  }
  if(error) {
    content = <p>{error}</p>
  }
  if(isloading){
    content = <p>Loading...</p>
  }

  const cancelretryHandler = () => {
    clearTimeout(retrytimer);
    setCheck(false);
  };

  return (
    <React.Fragment>
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
      {content}
      {check && !isloading && error && (
        <p>
          {error}{''}
          <button onClick={cancelretryHandler}>Cancel retrying</button>
        </p>
      )}
      </section>
    </React.Fragment>
  );
}

export default App;
