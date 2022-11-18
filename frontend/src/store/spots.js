import { csrfFetch } from './csrf';

const GET_SPOTS = 'spots/getSpots'
const ONE_SPOT = 'spot/oneSpot'
const CREATE_SPOT = 'spots/createSpot'
const REMOVE_SPOT = 'spots/removeSpot'
const RESET_SPOT = 'spots/resetSpot'
const EDIT_SPOT = 'spots/editSpot'

//---Action---//
const editSpot = (spot, id) => {
  return{
    type: EDIT_SPOT,
    spot,
    id
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
  const { address, city, state, country, name, description, price, url} = spot;
  const res = await csrfFetch(`/api/spots`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(
      {address,
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
  if (res.ok) {
  console.log("response", res)
    const data = await res.json()
    console.log(data.id)
    await dispatch(addSpotImage(data, url))
    console.log(data)
    return data
  }
  console.log("response", res)
  return null
}

export const editASpot = (payload) => async (dispatch) => {
  const { id, address, city, state, country, lat, lng, name, description,
    price } = payload
const res = await csrfFetch('/api/spots', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        address, city,
        state, country,
        lat, lng,
        name, description,
        price
    })
})
if (res.ok) {
    const data = await res.json()
    console.log("data = ",data)
    await dispatch(addSpot(data))
    return res
}
  return null
}

export const removeASpot = (spotId) => async dispatch => {
  const response = await csrfFetch(`/api/spots/${spotId}`, {
    method: 'DELETE'
  })
  if (response.ok) {
   await dispatch(removeSpot(spotId))
  }
  return null
}


export const addSpotImage = (spot, url) => async (dispatch) => {
  console.log("spot image spot = ", spot)
  const res = await csrfFetch(`/api/spots/${spot.id}/images`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
          url,
          preview: true
      })
  })
  if (res.ok) {
      const data = res.json()
      console.log("add image response = ", data)
     await dispatch(addSpot(spot))
    //  return s
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
      const newSpots = {}
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
        newState = {...state, oneSpot: {...state.spot}, allSpots: {...state.allSpots}}
        newState.allSpots[action.id] = action.spot;
        newState.oneSpot = action.spot
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
