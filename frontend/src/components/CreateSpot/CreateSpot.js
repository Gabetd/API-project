import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from 'react-router-dom'
import { addASpot } from "../../store/spots";
import logo from '../logo/logo.png'



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
  const [errors, setErrors] = useState([]);



  useEffect(() => {
    const err = []
    if (!address) err.push('Address is required')
    if (!city) err.push('City is required')
    if (!state) err.push('State is required')
    if (!country) err.push('Country is required')
    if (!name) err.push('Name is required')
    if (!description) err.push('Description is required')
    if (!price) err.push('Price per night is required')
    setErrors(err)
  }, [address, city, state, country, name, description, price])


// let newSpot
//   const onsubmit = async (e) => {
//     e.preventDefault()
//     const payload = {
//       address, city,
//       state, country,
//       lat: 1,
//       lng: 1,
//       name, description,
//       price
//     }

//     newSpot = await dispatch(addASpot(payload))
//     .then(() => setCreateModal(false))
//     .catch(

//       async (res) => {
//         console.log('catch is running')
//         const data = await res.json();
//         if (data && data.errors) {
//           setErrors(errors, data.errors);
//         }
//       })
//     history.push(`/Spots/${newSpot.id}`)
//   }




const onsubmit = async (e) => {
  e.preventDefault();
if (!errors.length) {
  const payload = {
    address,
    city,
    state,
    country,
    name,
    description,
    price,
    url,
  }
  console.log(payload)
  const newSpot = await dispatch(addASpot(payload))
  setCreateModal(false)
  console.log(newSpot)
  history.push(`/spots/${newSpot.id}`)
}
}


  return (
    <div>
      <form onSubmit={onsubmit}  className='base-form'>
      <img  className='modal-logo'src={logo} />
        <div>
          <ul>
            {errors.map((error, idx) => (
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
        <label>
          Image Url
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
          />
        </label>
        <button type="submit" hidden={errors.length !== 0}>Create Spot</button>
      </form>
    </div>
  )

}


export default CreateSpot
