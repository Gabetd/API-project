import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useParams } from 'react-router-dom'
import { getAllSpots } from "../../store/spots"

const SpotById = () => {
  const { spotId } = useParams()
  const spot = useSelector(state => state.spot.allSpots[spotId])

  const dispatch = useDispatch()

  useEffect(() => { 
    dispatch(getAllSpots())
  }, [dispatch])
  console.log(spot)
  return (
    <div>
    <div>
      {spot.id}
    </div>
    <img src={spot.previewImage}/>
    </div>
  )

}

export default SpotById;
