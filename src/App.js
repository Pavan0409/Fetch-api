import React, { useCallback, useEffect, useState } from "react";
import MoviesList from "./components/MoviesList";
import MovieForm from "./components/MovieForm";
import "./App.css";

function App(props) {
  const [isloading, setIsLoading] = useState(false);
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [retrytimer, setReTryTimer] = useState();
  const [check, setCheck] = useState(false);

  const fetchMoviesHandler = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://react-http-62b90-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json"
      );
      if (!response.ok) {
        throw new Error("Something went wrong. Retrying...!");
      }

      const data = await response.json();
      const loadedMovies = [];

      for (const key in data) {
        loadedMovies.push({
          id: key,
          title: data[key].title,
          openingText: data[key].openingText,
          releaseDate: data[key].releasedate,
        });
      }
      setMovies(loadedMovies);
    } catch (error) {
      setError(error.message);
      setCheck(true);
      const retimer = setTimeout(() => {
        fetchMoviesHandler();
      }, 5000);
      setReTryTimer(retimer);
      console.log(retimer);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchMoviesHandler();
    console.log("useeffect updated");
  }, [fetchMoviesHandler]);

  async function addMovieHandler(movie) {
    const response = await fetch(
      "https://react-http-62b90-default-rtdb.asia-southeast1.firebasedatabase.app/movies.json",
      {
        method: "POST",
        body: JSON.stringify(movie),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const data = await response.json();
    console.log(data);
  }
  const deleteMovieHandler = async (id) => {
    console.log({id});
    await fetch(
      "https://react-http-62b90-default-rtdb.asia-southeast1.firebasedatabase.app/movies/${id}",
      {
        method: "DELETE",
        body: JSON.stringify(movies),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    fetchMoviesHandler();
  };

  let content = <p>Found no movies.</p>;
  if (movies.length > 0) {
    content = <MoviesList movies={movies} />;
  }
  if (error) {
    content = <p>{error}</p>;
  }
  if (isloading) {
    content = <p>Loading...</p>;
  }

  const cancelretryHandler = () => {
    clearTimeout(retrytimer);
    setCheck(false);
  };

  return (
    <React.Fragment>
      <MovieForm onAddMovie={addMovieHandler} />
      <section>
        <button onClick={fetchMoviesHandler}>Fetch Movies</button>
      </section>
      <section>
        {content}
        <MoviesList movies={movies} deleteRequest={deleteMovieHandler} />
        {check && !isloading && error && (
          <p>
            {error}
            {""}
            <button onClick={cancelretryHandler}>Cancel retrying</button>
          </p>
        )}
      </section>
    </React.Fragment>
  );
}

export default App;
