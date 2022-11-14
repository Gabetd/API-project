import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { NavLink } from 'react-router-dom'
import { spotGet } from "../../store/spots"
import './Home.css'

const Home = () => {
  const spots = useSelector(state => state.spot.allSpots)


  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(spotGet())
  }, [dispatch])


  if (!spots) {
    return null
  } else {
    return (
      <div className="housing">
        <div className="outer-level">
          {Object.values(spots).map(spot => (
            <div key={spot.id} className='card-holder'>
            <NavLink to={`/spots/${spot.id}`} >
              <div>
                <div>
                  <img className="card" src={spot.previewImage}/>
                  <div>
                    {spot.city}, {spot.state}, {spot.country}
                  </div>
                  <div>
                  ★{spot.avgStarRating}
                  </div>
                </div>
                <div>
                  {spot.name}
                </div>
                <div>
                  {spot.address}
                </div>
                <div>
                  <div>
                    $ {spot.price} per night
                  </div>
                </div>
              </div>
            </NavLink>
          </div>
          ))}
        </div>
      </div>
    )
  }
}

export default Home;
