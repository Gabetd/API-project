import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Modal } from "../../context/Modal";
import { createAReview } from "../../store/reviews";
import './review.css'


function CreateReview({ setCreateReview }) {
  const history = useHistory()
  const { spotId } = useParams()
  const dispatch = useDispatch()
  const [review, setReview] = useState('')
  const [stars, setStars] = useState(0)
  const [validationErrors, setValidationErrors] = useState([]);
  const [frontErrors, setFrontErrors] = useState([])

  const id = parseInt(spotId)
  useEffect(() => {
    const errors = []
    if (review.length > 250) errors.push('Can not exceed 250 characters');
    if (review.length === 0) errors.push("Can not submit and empty Review")
    setFrontErrors(errors)
    if (stars > 5 || stars < 1) errors.push('Stars must be a number between 1 and 5')
  }, [review, stars])



  let newReview
  const onsubmit = async (e) => {
    e.preventDefault()
    console.log("payload", review, stars, id)
    const payload = {
      review,
      stars,
      id
    }
    newReview = await dispatch(createAReview(payload)).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setValidationErrors(frontErrors)
          setValidationErrors(data.errors)
        }
      }
    )
    setCreateReview(false)
    history.push(`/Spots/${id}`)
  }
  console.log("new Review = ", newReview)


  return (
    <>
      {<form className="review-modal" onSubmit={onsubmit}>
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
        <button
          type="submit"
        >submit Review</button>
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
          <ul>
            {validationErrors.length > 0 && (
              <>
                {validationErrors.map((error) => (
                  <li key={error}>{error}</li>
                ))}
              </>
            )}
          </ul>
        </div>
      </form>}
    </>
  )
}


export default CreateReview;
