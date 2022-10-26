const router = require('express').Router();
const {Spot, User, Review, SpotImage, ReviewImage, Booking, sequelize} = require('../../db/models');
const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth');







//Get all bookings by user
router.get('/current', requireAuth, async (req, res) => {
  const bookings = await Booking.findAll({
    where: {
      userId: req.user.id
    },
    include: [
      {model: Spot,
        attributes: ['id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'price'],
        include: [
          {model: SpotImage, attributes: [["url", "previewImage"]]}
        ],
          attributes: {
            exclude:["createdAt", "updatedAt"]
          }
      },
      ]
})
  const Bookings = []
  for(let i = 0; i < bookings.length; i++){
    const b = bookings[i]
    const image = await SpotImage.findOne({
      where: {
        spotId: b.Spot.id
      }
    })
    let spotImage = "no image available"
    if(image){
      spotImage = image.url
    }
    const Spot = {
      id: b.Spot.id,
      ownerId: b.Spot.ownerId,
      address: b.Spot.address,
      city: b.Spot.city,
      state: b.Spot.state,
      country: b.Spot.country,
      lat: b.Spot.lat,
      lng: b.Spot.lng,
      name: b.Spot.name,
      price: b.Spot.price,
      previewImage: spotImage
    }

    const obj = {
      id: b.id,
      spotId: b.spotId,
      spot: Spot,
      userId: b.userId,
      startDate: b.startDate,
      endDate: b.endDate,
      createdAt: b.createdAt,
      updatedAt:b.updatedAt
    }
    Bookings.push(obj)
  }
  res.status(200);
  res.json({Bookings})
})







// Edit Booking
router.put('/:bookingId', requireAuth, async (req, res) => {
  const { startDate, endDate } = req.body;
  const bookingId = req.params.bookingId;
  const { user } = req
  const booking = await Booking.findByPk(bookingId)

  if (!booking) {
    res.status(404)
    res.json({
      message: "Booking couldn't be found",
      statusCode: 404
    })
  }

  if(booking.userId !== user.id){
    res.status(403);
    res.json({
      "message": "Forbidden",
      "statusCode": 403
    })
  }

  try {
    booking.startDate = startDate;
    booking.endDate = endDate;
    await booking.save()
    res.json(booking)
  } catch (error) {
    res.status(403)
    res.json({
      message: "Sorry, this spot is already booked for the specified dates",
      statusCode: 403,
      errors: {
        startDate: "Start date conflicts with an existing booking",
        endDate: "End date conflicts with an existing booking"
      }
    })
  }
})





//Delete a booking (working)
router.delete('/:bookingId', requireAuth, async (req, res) => {
  const { user } = req;
  const bookId = req.params.bookingId;
  const booking = await Booking.findByPk(bookId)
  if (!booking) {
    res.status(404)
    res.json({
      message: "Booking couldn't be found",
      statusCode: 404
    })}

    if(booking.userId !== user.id){
    res.status(403);
    res.json({
      "message": "Forbidden",
      "statusCode": 403
    })
  }
    booking.destroy()
    res.status(200)
    res.json({
      message: "Successfully deleted",
      statusCode: 200
    })

})



module.exports = router;
