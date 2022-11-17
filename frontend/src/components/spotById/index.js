import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams, useHistory } from 'react-router-dom'
import { singleSpot } from "../../store/spots"
import { Modal } from '../../context/Modal'
import { removeASpot } from "../../store/spots"
import EditSpot from "../EditSpot/EditSpotForm"
import './spotDetails.css'

const SpotById = () => {
  const user = useSelector(state => state.session.user)
  const [createModal, setCreateModal] = useState(false)
  const [errors, setErrors] = useState([])
  const { spotId } = useParams()
  const spot = useSelector(state => state.spot.oneSpot)
  const dispatch = useDispatch()
  let spotOwner;
  if(user) spotOwner= (spot.ownerId===user.id)
  const history = useHistory()


  const DeleteSpot = async (e) => {
    e.preventDefault()
    const attempt = dispatch(removeASpot(parseInt(spotId))).catch(
      async (res) => {
        const data = await res.json();
        if (data && data.errors) setErrors(data.errors)
      }
      )
      if (attempt) history.push('/')
      else console.log("failed to delete spot")
  }



  useEffect(() => {
    dispatch(singleSpot(+spotId))
  }, [dispatch, spotId])

  if(!spot || !spot.SpotImages){
    return null
  }
  console.log(spot)
  return (
      <div className="outer">

    <div className="holder">
    <div>
      {spot.id}
    </div>
    <img className="spot-details" src={spot.SpotImages[0].url}/>
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
      </div>
  )

}

export default SpotById;
