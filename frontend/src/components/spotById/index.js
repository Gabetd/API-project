import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useHistory, NavLink } from 'react-router-dom'
import { singleSpot } from "../../store/spots"
import { Modal } from '../../context/Modal'
import { removeASpot } from "../../store/spots"
import { deleteAReview, createAReview, getAllSpotReviews } from "../../store/reviews"
import EditSpot from "../EditSpot/EditSpotForm"
import './spotDetails.css'
import CreateReview from "../CreateReview"
import Rerender from "../Rerender"



const SpotById = () => {
  const user = useSelector(state => state.session.user)
  const [createModal, setCreateModal] = useState(false)
  const [createReview, setCreateReview] = useState(false)
  const [errors, setErrors] = useState([])
  const { spotId } = useParams()
  const spot = useSelector(state => state.spot.oneSpot)
  const reviews = Object.values(useSelector(state => state.review.allReviews))
  const dispatch = useDispatch()
  let spotReviewed;
  let userReview;
  if(user) userReview = reviews.find(review => review.User.id === user.id)
  if(user)reviews.find(review => review.User.id === user.id) ? spotReviewed = true : spotReviewed = false;
  let spotOwner;
  if(user) spotOwner= (spot.ownerId===user.id)
  const history = useHistory()

  useEffect(() => {
    dispatch(getAllSpotReviews(spotId))
  }, [dispatch, spotId])

  const DeleteSpot = async (e) => {
    e.preventDefault()
    const attempt = dispatch(removeASpot(parseInt(spotId))).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors)

      }
      )
      if (attempt) {history.push('/')
      dispatch(getAllSpotReviews(spotId))
    }

  }
let review = "review"
if (spot.numReviews > 1){
review = "review"
}

const DeleteReview = async (e) => {
  e.preventDefault()
  const attempt = dispatch(deleteAReview(parseInt(userReview.id)))
  if(attempt){history.push(`/Spots/${spotId}`)
  dispatch(getAllSpotReviews(spotId))}
}

  useEffect(() => {
    dispatch(singleSpot(+spotId))
  }, [spotId])

  if(!spot || !spot.SpotImages){
    return null
  }
  // console.log(spot)
  return (
    <div>
      <div className="spotDetails">
        <p className="details-name">{spot.name}</p>
        <p className="details-star-rating">★{spot.avgStarRating} • {spot.numReviews} {review} • {spot.city}, {spot.state}, {spot.country}</p>
      </div>
      <div className="outer">

    <div className="holder">
    <div>
      {spot.id}
    </div>
    <img className="spot-details" src={spot.SpotImages[0]? spot.SpotImages[0].url : 'https://media.istockphoto.com/id/1354776450/vector/no-photo-available-vector-icon-default-image-symbol-picture-coming-soon-for-web-site-or.jpg?b=1&s=170667a&w=0&k=20&c=nJh9cII84Q57vTIKkyRC1e1xEG-_AxA2Zp8Wkwy8OEE='}/>
    <div>
    <img className="side-pic" src={spot.SpotImages[1]? spot.SpotImages[1].url : 'https://media.istockphoto.com/id/1354776450/vector/no-photo-available-vector-icon-default-image-symbol-picture-coming-soon-for-web-site-or.jpg?b=1&s=170667a&w=0&k=20&c=nJh9cII84Q57vTIKkyRC1e1xEG-_AxA2Zp8Wkwy8OEE='}/>
    <img className="side-pic" src={spot.SpotImages[2]? spot.SpotImages[2].url : 'https://media.istockphoto.com/id/1354776450/vector/no-photo-available-vector-icon-default-image-symbol-picture-coming-soon-for-web-site-or.jpg?b=1&s=170667a&w=0&k=20&c=nJh9cII84Q57vTIKkyRC1e1xEG-_AxA2Zp8Wkwy8OEE='}/>
    <div>
    <img className="side-pic" src={spot.SpotImages[3]? spot.SpotImages[3].url : 'https://media.istockphoto.com/id/1354776450/vector/no-photo-available-vector-icon-default-image-symbol-picture-coming-soon-for-web-site-or.jpg?b=1&s=170667a&w=0&k=20&c=nJh9cII84Q57vTIKkyRC1e1xEG-_AxA2Zp8Wkwy8OEE='}/>
    <img className="side-pic" src={spot.SpotImages[4]? spot.SpotImages[4].url : 'https://media.istockphoto.com/id/1354776450/vector/no-photo-available-vector-icon-default-image-symbol-picture-coming-soon-for-web-site-or.jpg?b=1&s=170667a&w=0&k=20&c=nJh9cII84Q57vTIKkyRC1e1xEG-_AxA2Zp8Wkwy8OEE='}/>
    </div>
    </div>
    </div>
      </div>
    <div id="button holder">
    <button onClick={()=> {setCreateModal(true)}}
      hidden={spotOwner ? false : true}
      >Edit Spot</button>
             {spotOwner && (createModal && (
               <Modal onClose={() => setCreateModal(false)}>
            <EditSpot setCreateModal={setCreateModal} />
          </Modal>
          ))}

    <button onClick={DeleteSpot}
      hidden={spotOwner ? false : true}
      >Delete Spot</button>
        </div>
          <p>{spot.description}</p>
           <button hidden={!spotReviewed} onClick={DeleteReview}>Delete Review</button>
           <button hidden={spotReviewed || spotOwner || !user}
           onClick={()=> {setCreateReview(true)}}
           >Write a Review</button>
             {createReview && (
               <Modal onClose={() => setCreateReview(false)}>
            <CreateReview setCreateReview={setCreateReview} user={user} />
          </Modal>
          )}
          { reviews.map(review =>
          <div key={review.id}>
            <div>★{review.stars}, {review.User.firstName}</div>
            <div>{review.review}</div>
          </div>
            )}
      </div>
  )

}

export default SpotById;
