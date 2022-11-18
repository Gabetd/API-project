import { csrfFetch } from "./csrf";

const GET_REVIEWS = 'review/getReviews'
const GET_SPOT_REVIEWS = 'review/getSpotReviews'
const CREATE_REVIEW = 'review/createReview'
const DELETE_REVIEW = 'review/delete'
const CLEAR_REVIEW = 'review/clearReview'


const getReviews = (reviews) => {
  return {
    type: GET_REVIEWS,
    reviews
  }
}

 export const clearReviews = () => {
  return {
    type: CLEAR_REVIEW
  }
}

const getSpotReviews = (spot) => {
  return {
    type: GET_SPOT_REVIEWS,
    spot
  }
}

const createReview = (spot) => {
  return {
    type: CREATE_REVIEW,
    spot
  }
}

const deleteReview = (reviewId) => {
  return {
    type: DELETE_REVIEW,
    reviewId
  }
}

export const getUserReviews = () => async dispatch => {
  const response = await csrfFetch('/api/reviews/current');
  if (response.ok) {
    const reviews = await response.json();
    await dispatch(getReviews(reviews))
    return reviews
  }
  return null
}

export const getAllSpotReviews = (spotId) => async dispatch => {
  const response = await fetch(`/api/spots/${spotId}/reviews`);
  if (response.ok) {
    const reviews = await response.json();
    await dispatch(getSpotReviews(reviews))
    return reviews
  }
  return null
}

export const createAReview = (payload, user) => async dispatch => {
  const { id, review, stars} = payload
  const response = await csrfFetch(`/api/spots/${id}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({review, stars})

  })

  if (response.ok) {
    const review = await response.json()
    review.User = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName
     }
    await dispatch(createReview(review))
    return review
  }
  return null
}

export const deleteAReview = (reviewId) => async dispatch => {
  const response = await csrfFetch(`/api/reviews/${reviewId}`, {
    method: 'DELETE'
  })
  if (response.ok) {
    dispatch(deleteReview(reviewId))
  }
}

const initialState = {
  allReviews: {},
  usersReviews: {}
}

const reviewReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_REVIEWS:
      let currReviews = {}
      newState = { ...state,  usersReviews:{ ...state.usersReviews}}
      action.reviews.Reviews.forEach(review => {
        currReviews[review.id] = review
      })
      newState.usersReviews = currReviews
      return newState
    case GET_SPOT_REVIEWS:
      newState = { ...state, allReviews:{ ...state.allReviews}}
      let newReviews = {}
      action.spot.Reviews.forEach(review => {
        newReviews[review.id] = review
      })
      newState.allReviews = newReviews
      return newState

    case CREATE_REVIEW:
      newState = { ...state }
      newState.allReviews[action.spot.id] = action.spot
      newState.usersReviews = action.spot
      return newState

    case DELETE_REVIEW:
      newState = { ...state, usersReviews:{ ...state.usersReviews}}

      delete newState.usersReviews[action.reviewId]
      return newState;

    case CLEAR_REVIEW:
      return initialState
    default:
      return state
  }
}

export default reviewReducer
