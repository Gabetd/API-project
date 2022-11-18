import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Modal } from "../../context/Modal";
import { clearReviews, createAReview } from "../../store/reviews";
import './review.css'
import logo from '../logo/logo.png'


function CreateReview({ setCreateReview, user }) {
  console.log("create review component running")
  const history = useHistory()
  const { spotId } = useParams()
  const dispatch = useDispatch()
  const [review, setReview] = useState('')
  const [stars, setStars] = useState(0)
  const [errors, setErrors] = useState([]);


  const id = parseInt(spotId)
  useEffect(() => {
    const errs = []
    if (review.length > 250) errs.push('Can not exceed 250 characters');
    if (review.length === 0) errs.push("Can not submit and empty Review")
    setErrors(errs)
    if (stars > 5 || stars < 1) errs.push('Stars must be a number between 1 and 5')
  }, [review, stars])



  let newReview
  const onSubmit = async (e) => {
    e.preventDefault()

    console.log("on submit payload", review, stars, id)
    const payload = {
      review,
      stars,
      id
    }
    newReview = await dispatch(createAReview(payload, user))
    .then(() => setCreateReview(false))
    .catch(
      async (res) => {
        console.log('catch is running')
        const data = await res.json();
        if (data && data.errors) {
          setErrors(errors, data.errors);
        }
      }
    )
    console.log("before clear review")
    console.log("new Review = ", newReview)
    setCreateReview(false)
  }


  return (
    <>
      {<form className='base-form' >
      <img  className='modal-logo'src={logo} />
        <ul>
          {errors.map((error, idx) => (
            <li key={idx}>{error}</li>
          ))}
        </ul>
        <label>
          <textarea
            className="text-area"
            placeholder="Review"
            type='text'
            value={review}
            onChange={e => setReview(e.target.value)}
            required
          >
          </textarea>
        </label>
        <label>

          <select
            value={stars}
            onChange={(e) => setStars(e.target.value)}
            required
          >
            <option></option>
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </select>
          Stars
        </label>
        <div className="errors">
        </div>
        <button
          onClick={onSubmit}
          hidden={errors.length !== 0}
          type="submit"
        >submit Review</button>
      </form>}
    </>
  )
}


export default CreateReview;
