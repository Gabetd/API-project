import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useHistory, NavLink } from 'react-router-dom'
import { singleSpot } from "../../store/spots"
import { Modal } from '../../context/Modal'
import { removeASpot } from "../../store/spots"
import { getAllSpots } from "../../store/spots"
import { deleteAReview, createAReview, getAllSpotReviews } from "../../store/reviews"
import EditSpot from "../EditSpot/EditSpotForm"
import './spotDetails.css'
import CreateReview from "../CreateReview"




const SpotById = () => {
  const user = useSelector(state => state.session.user)
  const [createReview, setCreateReview] = useState(false)
  const [editModal, setEditModal] = useState(false)
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
  }, [dispatch, spotId, reviews.length])

  const DeleteSpot = async (e) => {
    e.preventDefault()
    const attempt = dispatch(removeASpot(parseInt(spotId))).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors)

      }
      )
      if (attempt) {
        const action = await dispatch(getAllSpots())
        .then(() => history.push('/'))
    }

  }

const DeleteReview = async (e) => {
  e.preventDefault()
  const attempt = dispatch(deleteAReview(parseInt(userReview.id)))
  if(attempt){history.push(`/spots/${spotId}`)
  dispatch(getAllSpotReviews(spotId))}
}

  useEffect(() => {
    dispatch(singleSpot(+spotId))
  }, [dispatch, spotId, reviews.length])

  if(!spot || !spot.SpotImages){
    return null
  }
  // console.log(spot)
  return (
    <div className="details-page">

    <div className="outer-most">
      <div className="spot-details info">
        <p className="details-name info">{spot.name}</p>
        <p className="details-stars info">★{spot.avgStarRating} • {spot.numReviews} Reviews • {spot.city}, {spot.state}, {spot.country}</p>
      </div>
      <div className="outer">

    <div className="holder">
    <div className="images">
    <img className="spot-image" src={spot.SpotImages[0]? spot.SpotImages[0].url : 'https://media.istockphoto.com/id/1354776450/vector/no-photo-available-vector-icon-default-image-symbol-picture-coming-soon-for-web-site-or.jpg?b=1&s=170667a&w=0&k=20&c=nJh9cII84Q57vTIKkyRC1e1xEG-_AxA2Zp8Wkwy8OEE='}/>
    <div>
      <div>
    <img className="side-pic" src={spot.SpotImages[1]? spot.SpotImages[1].url : 'https://media.istockphoto.com/id/1354776450/vector/no-photo-available-vector-icon-default-image-symbol-picture-coming-soon-for-web-site-or.jpg?b=1&s=170667a&w=0&k=20&c=nJh9cII84Q57vTIKkyRC1e1xEG-_AxA2Zp8Wkwy8OEE='}/>
    <img className="side-pic" src={spot.SpotImages[2]? spot.SpotImages[2].url : 'https://media.istockphoto.com/id/1354776450/vector/no-photo-available-vector-icon-default-image-symbol-picture-coming-soon-for-web-site-or.jpg?b=1&s=170667a&w=0&k=20&c=nJh9cII84Q57vTIKkyRC1e1xEG-_AxA2Zp8Wkwy8OEE='}/>
    </div>
    <div>
    <img className="side-pic" src={spot.SpotImages[3]? spot.SpotImages[3].url : 'https://media.istockphoto.com/id/1354776450/vector/no-photo-available-vector-icon-default-image-symbol-picture-coming-soon-for-web-site-or.jpg?b=1&s=170667a&w=0&k=20&c=nJh9cII84Q57vTIKkyRC1e1xEG-_AxA2Zp8Wkwy8OEE='}/>
    <img className="side-pic" src={spot.SpotImages[4]? spot.SpotImages[4].url : 'https://media.istockphoto.com/id/1354776450/vector/no-photo-available-vector-icon-default-image-symbol-picture-coming-soon-for-web-site-or.jpg?b=1&s=170667a&w=0&k=20&c=nJh9cII84Q57vTIKkyRC1e1xEG-_AxA2Zp8Wkwy8OEE='}/>
    </div>
      </div>
    </div>
    </div>
      </div>
    <div id="button holder">
    <button onClick={()=> {setEditModal(true)}}
      hidden={spotOwner ? false : true}
      >Edit Spot</button>
             {spotOwner && (editModal && (
               <Modal onClose={() => setEditModal(false)}>
            <EditSpot setEditModal={setEditModal} />
          </Modal>
          ))}

    <button onClick={DeleteSpot}
      hidden={spotOwner ? false : true}
      >Delete Spot</button>
        </div>
          <p className="info">Hosted by {spot.Owner.firstName} {spot.Owner.lastName}</p>
          <p className="info-description">{spot.description}</p>
          <p className="info">${spot.price} / night</p>
           <button hidden={!spotReviewed} onClick={DeleteReview}>Delete Review</button>
           <button hidden={spotReviewed || spotOwner || !user}
           onClick={()=> {setCreateReview(true)}}
           >Write a Review</button>
             {createReview && (
               <Modal onClose={() => setCreateReview(false)}>
            <CreateReview setCreateReview={setCreateReview} user={user} />
          </Modal>
          )}
      </div>
      <div className='reviews-holder'>
        <p className="details-name">★{spot.avgStarRating} • {spot.numReviews} Reviews</p>
          { reviews.map(review =>
          <div className='reviews' key={review.id}>
            <div className="info">★{review.stars}, {review.User.firstName}
             {/* {(review.id === userReview.id) && <button onClick={DeleteReview}>Delete Review</button>} */}
            </div>
            <div className="info">{review.review}</div>
          </div>
            )}
            </div>
            </div>
  )

}

export default SpotById;
