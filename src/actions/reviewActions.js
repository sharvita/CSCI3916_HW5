import runtimeEnv from "@mars/heroku-js-runtime-env";
import {fetchMovie} from "./movieActions";

export function submitReview(review, movieId) {
    const env = runtimeEnv();
    return dispatch => {
        return fetch(`${env.REACT_APP_API_URL}/reviews`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            },
            body: JSON.stringify(review),
            mode: 'cors'})
            .then( (response) => {
                if (!response.ok) {
                    throw Error(response.statusText);
                }
                return response.json();
            })
            .then( (res) => {
                dispatch(fetchMovie(movieId));
            })
            .catch( (e) => console.log(e) );
    }
}