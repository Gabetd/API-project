import { csrfFetch } from './csrf';

//ACTION
const GET_ALL_SPOTS = 'spots/GET_ALL_SPOTS'
const CREATE_SPOT = 'spots/CREATE_SPOT'
const UPDATE_SPOT = 'spots/UPDATE_SPOT'
const DELETE_SPOT = 'spots/DELETE_SPOT'

const getAllSpots = (spots) => {
return {
  type: GET_ALL_SPOTS,
  spots
}}

const createSpot = (spot) => {
 return{
  type: CREATE_SPOT,
  spot
 }
}

const updateSpot = (spot) => {
return{
  type: UPDATE_SPOT,
  spot
}
}

const deleteSpot = (spotId) => {
return {
  type: DELETE_SPOT,
  spotId
}
}

//THUNK
export const getAllSpotsThunk = () => async (dispatch) => {
  const response = await csrfFetch('/api/spots/');
  const data = await response.json();
  dispatch(getAllSpots(data));
  return response
}

export const createSpotThunk = (spot) => async (dispatch) => {

  const response  = await csrfFetch ('/api/spots',{
    method: 'POST',
    body: JSON.stringify(spot)
  })
  const data = await response.json();
  dispatch(createSpot(data));
  return response;
}

export const updateSpotThunk = (spot) => async (dispatch) => {
  const response  = await csrfFetch (`/api/spots/${spot.id}`,{
    method: 'PUT',
    body: JSON.stringify(spot)
  })
  const data = await response.json();
  dispatch(updateSpot(data));
  return response;
}

export const deleteSpotThunk = (spotId) => async (dispatch) => {
  const response  = await csrfFetch ('/api/spots/id',{
    method: 'DELETE',
    body: JSON.stringify(spotId)
  })
  const data = await response.json();
  dispatch(deleteSpot(data));
  return response;
}


//REDUCER
const spotsReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case GET_ALL_SPOTS:

      return
    case CREATE_SPOT:

      return
    case UPDATE_SPOT:

      return
    case DELETE_SPOT:

      return
    default:
      return state
  }
}

export default spotsReducer
