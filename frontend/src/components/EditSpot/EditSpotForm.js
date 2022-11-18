
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom'
import { editASpot } from "../../store/spots";
import logo from '../logo/logo.png'





function EditSpot({ setCreateModal }) {
  const user = useSelector(state => state.session)
  const spot = useSelector(state => state.spot.oneSpot)
  const dispatch = useDispatch()
  const history = useHistory()
  const [address, setAddress] = useState(spot.address)
  const [city, setCity] = useState(spot.city)
  const [state, setState] = useState(spot.state)
  const [country, setCountry] = useState(spot.country)
  const [name, setName] = useState(spot.name)
  const [description, setDescription] = useState(spot.description)
  const [price, setPrice] = useState(spot.price)
  const [validationErrors, setValidationErrors] = useState([]);

  useEffect(() => {
    const err = []
    if (!address) err.push('Address is required')
    if (!city) err.push('City is required')
    if (!state) err.push('State is required')
    if (!country) err.push('Country is required')
    if (!name) err.push('Name is required')
    if (!description) err.push('Description is required')
    if (!price) err.push('Price per night is required')
    setValidationErrors(err)
  }, [address, city, state, country, name, description, price])

  const onsubmit = async (e) => {
    e.preventDefault()
    const payload = {
      id: spot.id,
      address, city,
      state, country,
      lat: 1,
      lng: 1,
      name, description,
      price
    }
    // console.log(payload)
    const editSpot = await dispatch(editASpot(payload)).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setValidationErrors(data.errors)
        }
      });
    history.push(`/Spots/${spot.id}`)
  }


  return (
    <div>
      <form className='base-form' onSubmit={onsubmit}>
        <img  className='modal-logo'src={logo} />
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
        <button type="submit">Edit Spot</button>
      </form>
    </div>
  )

}


export default EditSpot
