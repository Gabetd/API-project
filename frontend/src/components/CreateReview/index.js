import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Modal } from "../../context/Modal";
import { clearReviews, createAReview } from "../../store/reviews";
import './review.css'
import Rerender from "../Rerender";


function CreateReview({ setCreateReview, user }) {
  console.log("create review component running")
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
  const onSubmit = async (e) => {
    e.preventDefault()

    console.log("on submit payload", review, stars, id)
    const payload = {
      review,
      stars,
      id
    }
    newReview = await dispatch(createAReview(payload, user)).catch(
      async (res) => {
        console.log('catch is running')
        const data = await res.json();
        if (data && data.errors) {
          setValidationErrors(frontErrors)
          setValidationErrors(data.errors);

        }
      }
    )
    console.log("before clear review")
    // await dispatch(clearReviews())
    console.log("new Review = ", newReview)
    // history.push(`/Spots/${spotId}`)
    setCreateReview(false)
  }


  return (
    <>
      {<form className='base-form' >
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
            <button
            onClick={onSubmit}
              type="submit"
              >submit Review</button>
      </form>}
    </>
  )
}


export default CreateReview;
