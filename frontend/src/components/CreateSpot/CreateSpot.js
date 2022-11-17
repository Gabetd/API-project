import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom'
import { addASpot, addSpotImage } from "../../store/spots";




function CreateSpot({ setCreateModal }) {
  const user = useSelector(state => state.session)
  const dispatch = useDispatch()
  const history = useHistory()
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [country, setCountry] = useState('')
  const [lat, setLat] = useState(1)
  const [lng, setLng] = useState(1)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState(0)
  const [url, setUrl] = useState('')
  const [validationErrors, setValidationErrors] = useState([]);




  const onsubmit = async (e) => {
    e.preventDefault()
    const payload = {
      address, city,
      state, country,
      lat: 1,
      lng: 1,
      name, description,
      price
    }
    const newSpot = await dispatch(addASpot(payload)).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setValidationErrors(data.errors)
        }
      });

    history.push(`/Spots/${newSpot.id}`)
  }


  return (
    <div>
      <form className='base-form' onSubmit={onsubmit}>
        <div>
          <ul>
            {validationErrors.map((error, idx) => (
              <li key={idx}>{error}</li>))}
          </ul>
        </div>
        <label>Address
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>
        <label>City
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </label>
        <label>State
          <input
            type="text"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </label>
        <label>
          Country
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </label>
        <label>
          Name
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label>
          Description
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            max={120}
          />
        </label>
        <label>
          Price
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min={1}
          />
        </label>
        {/* <label>
          Image Url
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            required
          />
        </label> */}
        <button type="submit">Create Spot</button>
      </form>
    </div>
  )

}


export default CreateSpot
