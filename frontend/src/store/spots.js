import { csrfFetch } from './csrf';

const GET_SPOTS = 'spots/getSpots'
const ONE_SPOT = 'spot/oneSpot'
const CREATE_SPOT = 'spots/createSpot'
const REMOVE_SPOT = 'spots/removeSpot'
const RESET_SPOT = 'spots/resetSpot'
const EDIT_SPOT = 'spots/editSpot'

//---Action---//
const editSpot = (spot) => {
  return{
    type: EDIT_SPOT,
    spot
  }
}

const getSpots = (spots) => {
  return {
    type: GET_SPOTS,
    spots
  }
}

const oneSpot = (spot) => {
  return {
    type: ONE_SPOT,
    spot
  }
}

const addSpot = (spot) => {
  return {
    type: CREATE_SPOT,
    spot
  }
}


const removeSpot = (spotId) => {
  return {
    type: REMOVE_SPOT,
    spotId
  }
}

export const resetSpot = () => {
  return {
    type: RESET_SPOT
  }
}

//---Thunk---//
export const getAllSpots = () => async dispatch => {
  const response = await fetch(`/api/spots`);
  if (response.ok) {
    const spots = await response.json();
    await dispatch(getSpots(spots))
    return spots
  }
  return null
}

export const singleSpot = (spotId) => async dispatch => {
  const response = await fetch(`/api/spots/${spotId}`);
  if (response.ok) {
    const spot = await response.json()
    await dispatch(oneSpot(spot))
    return spot
  }
  return null
}

export const currOwnerSpots = () => async dispatch => {
  const response = await csrfFetch(`/api/spots/current`);
  if (response.ok) {
    const spots = await response.json();
    await dispatch(getSpots(spots))
    return spots
  }
  return null
}

export const addASpot = (spot) => async dispatch => {
  console.log("hit the thunk")
  const { address, city, state, country, name, description, price} = spot;
  const response = await csrfFetch(`/api/spots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      address,
      city,
      state,
      country,
      lat: 1,
      lng: 1,
      name,
      description,
      price
    })
  })
  if (response.ok) {
    const spot = await response.json()
        await dispatch(addSpot(spot.id))
        return spot
  }
  return null
}

export const editASpot = (spot) => async dispatch => {
  console.log("edit spot thunk")
  const response = await csrfFetch(`/api/spots/${spot.id}`, {
    method: 'PUT',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify(spot)
  })
  if(response.ok) {
    const spot = await response.json()
    await dispatch(editSpot(spot))
    return spot

  }
  return null
}

export const removeASpot = (spotId) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE'
  })
  if (response.ok) {
    dispatch(removeSpot(spotId))
  }
  return null
}


export const addSpotImage = ({ url, id }) => async (dispatch) => {
  const response = await csrfFetch(`/api/spots/${id}/images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          url,
          preview: true
      })
  })
  if (response.ok) {
      dispatch(singleSpot(id))
  }
    return null
}

const initialState = {
  allSpots: {},
  oneSpot: {}
}


//---Reducer---//
const spotReducer = (state = initialState, action) => {
  let newState;

  switch (action.type) {
    case GET_SPOTS:
      let newSpots = {}
      newState = { ...state, allSpots: {...state.allSpots} }
      action.spots.Spots.forEach(spot => {
        newSpots[spot.id] = spot
      })
      newState.allSpots = newSpots
      return newState
    case CREATE_SPOT:
      newState = { ...state }
      newState.allSpots = {...state.allSpots}
      newState.allSpots[action.spot.id] = action.spot
      newState.oneSpot = action.spot
      console.log("create state = ",newState.oneSpot)
      return newState
      case EDIT_SPOT:
        newState = {...state}
        newState[action.spot.id] = {...newState[action.spot], ...action.spot};
        return newState
    case ONE_SPOT:
      newState = { ...state, oneSpot: {...state.oneSpot}}
      newState.oneSpot = { ...action.spot }
      return newState
    case RESET_SPOT:
      return initialState
    case REMOVE_SPOT:
      newState = { ...state, allSpots: {...state.allSpots}}
      delete newState.allSpots[action.spotId]
      return newState;
    default:
      return state
  }
}

export default spotReducer
