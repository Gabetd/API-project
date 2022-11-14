import { useEffect, useState } from 'react';
import { useSelector, useDispatch  } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { getAllSpotsThunk } from '../../store/spots';




function Home(){
  const dispatch = useDispatch();

  const spots = useSelector(state => {
    return state.spots.list
  })

  useEffect(() => {
    dispatch(getAllSpotsThunk())
  }, [dispatch])


  return (
    <div className="centered-form-standard">
        {spots.map(spot => {
            <div className='spot-prev'>
              <nav>
              <NavLink className="navEdit" to={`/Spots/${spot.id}`}>
                <div >
                 <img className="imgDiv" src={`${spot.previewImage}`} alt={spot.name}></img>
                 </div>
                   <div className="namePrice">
                      <h4>{spot.name}</h4>
                      <h4>
                          <i className="fa fa-star" aria-hidden="true"></i>
                          {spot.avgRating}
                      </h4>
                   </div>
                      <p>{spot.city}, {spot.state}</p>
                        <h4>${spot.price} night</h4>

              </NavLink>
              </nav>

            </div>
        })}
    </div>
  )

}

export default Home;
