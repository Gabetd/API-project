const router = require('express').Router();
// const Layer = require('express/lib/router/layer');
// const { where } = require('sequelize');
const {Spot, User, Review, SpotImage, ReviewImage, Booking, sequelize} = require('../../db/models');
const { Op } = require('sequelize');
const { requireAuth } = require('../../utils/auth');





//get spot by current user
router.get('/current', requireAuth, async (req,res) => {
  const { user } = req;
  const spot = await Spot.findAll({
    where: {
      ownerId: user.id
    },
    include: [
      {model: Review, attributes: []},
      {model: SpotImage, attributes: []}],

      attributes: [
        'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat',
         'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt',
         [sequelize.fn('ROUND',sequelize.fn('AVG', sequelize.col('Reviews.stars')),2),'avgStarRating'],
        [sequelize.col('SpotImages.url'), 'previewImage']
      ],
      group: ["Spot.id", "SpotImages.id"],
    });
    const result = {}
    for(let i = 0; i < spot.length; i++){
      const Spots = spot[i]
      let stars = Spots.dataValues.avgStarRating;
      if(stars === null){stars = "0.00"}
        result.id = Spots.id,
        result.ownerId = Spots.ownerId,
        result.address = Spots.address,
        result.city = Spots.city,
        result.state = Spots.state,
        result.country = Spots.country,
        result.lat = Spots.lat,
        result.lng = Spots.lng,
        result.name = Spots.name,
        result.description = Spots.description,
        result.price = Spots.price,
        result.createdAt = Spots.createdAt,
        result.updatedAt = Spots.updatedAt,
        result.avgStarRating = stars,
        result.previewImage = Spots.previewImage
    }
  res.status(200);
  res.json({Spots: result})

});








//Get all Reviews by a Spot's id
router.get('/:spotId/reviews', async (req, res) => {
  const spotId = req.params.spotId;
  const spot = await Spot.findOne({
    where: {
      id: spotId
    },
    attibutes:[],
    include: [
      {model: Review,
        include: [
          {model: User, attributes: ["id", "firstName", "lastName"]},
          {model: ReviewImage, attributes: ["id", "url"]}]
      },
    ],
    // group: ["Spot.id", "Review.id"],
  })
  if(!spot){
    res.status(404)
    res.json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }
  const Reviews = spot.Reviews
  res.status(200)
  res.json({Reviews})
})









// Create a Booking
router.post('/:spotId/bookings', requireAuth, async (req, res) => {
  const { startDate, endDate } = req.body;
  const spotId = req.params.spotId;
  const spot = await Spot.findByPk(spotId)
  let a = startDate;
  let b = endDate;
  if(!spot){
    res.status(404);
    res.json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  };

const spotBooking = await Booking.findOne({
  where: {
    spotId: req.params.spotId,
      [Op.or]: [{startDate: {[Op.between]: [a, b]},
        endDate: {[Op.between]: [a, b]}}]
  }
})

if(endDate < startDate){
  res.status(400);
  res.json({
    "message": "Validation error",
    "statusCode": 400,
    "errors": {
      "endDate": "endDate cannot be on or before startDate"
    }
  })
}

if(spotBooking){
  res.status(403)
  return res.json({
    "message": "Sorry, this spot is already booked for the specified dates",
    "statusCode": 403,
    "errors": {
      "startDate": "Start date conflicts with an existing booking",
      "endDate": "End date conflicts with an existing booking"
    }
  })
} else {
  const booking = await Booking.create({
    startDate: startDate,
    endDate: endDate,
    userId: req.user.id,
    spotId: spot.id
  })
  res.status(200)
  res.json(booking)
}
})










//get all bookings by spot Id
router.get('/:spotId/bookings', requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const spot = await Spot.findByPk(spotId)

  if(!spot){
    res.status(404);
    res.json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })}


  if (req.user.id !== spot.ownerId) {
    const bookings = await Booking.findAll({
      where: {
        spotId: spot.id
      },
      attributes: {
        exclude: ['id', 'userId', 'createdAt', 'updatedAt']
    }
  })
  res.status(200);
  res.json({ Bookings: bookings })
  }else if (req.user.id === spot.ownerId){
    const bookings = await Booking.findAll({
      where: {
        spotId: spot.id
      },
      include: [
        {model: User, attributes: ['id', 'firstName', 'lastName']}
      ],
    })

    res.status(200);
    res.json({ Bookings: bookings })
  }
})







// create a review for a spot
router.post('/:spotId/reviews', requireAuth, async (req, res) => {
  const { review, stars } = req.body;
  const spot = await Spot.findByPk(req.params.spotId);
  const userReview = await Review.findOne({
    where: {
      userId: req.user.id,
      spotId: req.params.spotId
    }});

    if (stars > 5 || stars < 1) {
      res.status(400);
      res.json({
          "message": "Validation error",
          "statusCode": 400,
          "errors": {
              "stars": "Stars must be an integer from 1 to 5"
          }
      })
  };

if (!spot) {
  res.status(404);
  res.json({
    message: "Spot couldn't be found",
    statusCode: 404
  })};

if (userReview) {
  res.status(403);
  res.json({
    message: "User already has a review for this spot",
    statusCode: 403
  })
}else{
  try {
  const newReview = await Review.create({
    userId: req.user.id,
    spotId: spot.id,
    review,
    stars
  })
  res.status(201);
  res.json(newReview)
}catch (error) {
  res.status(400)
  res.json({
    message: "Validation error",
    statusCode: 400,
    errors: {
      review: "Review text is required",
      stars: "Stars must be an integer from 1 to 5",
    }})
  }};
});






// create an image for a spot
router.post('/:spotId/images', requireAuth, async (req, res) => {
  const { url, preview }= req.body;
  const spot = await Spot.findByPk(req.params.spotId);
  if (!spot) {
    res.status(404)
    res.json({
      message: "Spot couldn't be found",
      statusCode: 404
    })
  }

  const image = await SpotImage.create({
      spotId: req.params.spotId,
      url: url,
      preview: preview
  })
  return res.json({
      id: image.id,
      url: image.url,
      preview: image.preview
  })
})









// Edit Spot by Id
router.put('/:spotId', requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  const spotId = req.params.spotId;
  const { user } = req
  const spot = await Spot.findByPk(spotId)

  if(!spot){
    res.status(404);
    res.json({
      "message": "Spot couldn't be found",
      "statusCode": 404
    })
  }

  if(spot.ownerId !== user.id){
    res.status(403);
    res.json({
      "message": "Forbidden",
      "statusCode": 403
    })
  }

  try{
    spot.address = address;
    spot.city = city;
    spot.state = state;
    spot.country = country;
    spot.lat = lat;
    spot.lng = lng;
    spot.name = name;
    spot.description = description;
    spot.price = price;


    res.status(200);
    res.json(spot)
  }catch(e){
    res.status(400);
    const errors = {}
      if(!address){errors.address = "Street address is required"}
      if(!city){errors.city = "City is required"}
      if(!state){errors.state = "State is required"}
      if(!country){errors.country = "Country is required"}
      if(!lat){errors.lat = "Latitude is not valid"}
      if(!lng){errors.lng = "Longitude is not valid"}
      if(!name){errors.name = "Name must be less than 50 characters"}
      if(!description){errors.description = "Description is required"}
      if(!price){errors.price = "Price per day is required"}
    res.json({
      message: "Validation Error",
      statusCode: 400,
      errors: errors
      });
    };
});








//get spot by id
router.get('/:spotId', async (req,res) => {
  const id = req.params.spotId
//   let spot1 = await Spot.findOne({
//     where:
// {id: id}});

  let Spots = await Spot.findOne({
    where: {
      id: id
    },
    attributes:
    [["id", "id"],["ownerId","ownerId"],["address","address"],["city","city"],["state","state"],
    ["country","country"],["lat","lat"],["lng","lng"],["name","name"],["description","description"],
    ["price","price"],["createdAt","createdAt"],["updatedAt","updatedAt"],
    [sequelize.fn("COUNT", sequelize.col("Reviews.id")),"numReviews"],
    [sequelize.fn('ROUND',sequelize.fn('AVG', sequelize.col('Reviews.stars')),2),'avgStarRating']],

    include: [
      {model: Review, attributes: []},
      {model: SpotImage, attributes: ["id", "url", "preview"]},
      {model: User, as: "Owner",
      attibutes: ["id", "firstName", "lastName"]
    },
  ],
  group: ["Spot.id", "SpotImages.id", "Owner.id"],
  order: ["id"]
})
if(!Spots){
  res.status(404);
  res.json({
    "message": "Spot couldn't be found",
    "statusCode": 404
  })}
  let stars = Spots.dataValues.avgStarRating;
  if(stars === null){stars = "0.00"}
const result = {
  id: Spots.id,
  ownerId: Spots.ownerId,
  address: Spots.address,
  city: Spots.city,
  state: Spots.state,
  country: Spots.country,
  lat: Spots.lat,
  lng: Spots.lng,
  name: Spots.name,
  description: Spots.description,
  price: Spots.price,
  createdAt: Spots.createdAt,
  updatedAt: Spots.updatedAt,
  numReviews: Spots.numReviews,
  avgStarRating: stars,
  SpotImages: Spots.SpotImages,
  Owner: Spots.Owner
}
res.status(200);
res.json(result)
});







// Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res) => {
  const spotId = req.params.spotId;
  const { user } = req
  const spot = await Spot.findByPk(spotId)
  if (!spot) {
    res.status(404)
    res.json({
      message: "Spot couldn't be found",
      statusCode: 404
    })
  }

    // if(spot.ownerId !== user.id){
    //   res.status(403);
    //   res.json({
    //     "message": "Forbidden",
    //     "statusCode": 403
    //   })
    // }

  spot.destroy()
  res.status(200);
  res.json({
      message: "Successfully deleted",
      statusCode: 200
  })
})









//create a spot
router.post('/', requireAuth, async (req, res) => {
 const { address, city, state, country, lat, lng, name, description, price } = req.body;
  try{
   const spot = await Spot.create({
    ownerId: req.user.id,
    address,
    city,
    state,
    country,
    lat: lat,
    lng: lng,
    name,
    description,
    price})
    res.status(201);
  res.json(spot);
}catch(e){
  res.status(400);
  const errors = {}
    if(!address){errors.address = "Street address is required"}
    if(!city){errors.city = "City is required"}
    if(!state){errors.state = "State is required"}
    if(!country){errors.country = "Country is required"}
    if(!lat){errors.lat = "Latitude is not valid"}
    if(!lng){errors.lng = "Longitude is not valid"}
    if(!name){errors.name = "Name must be less than 50 characters"}
    if(!description){errors.description = "Description is required"}
    if(!price){errors.price = "Price per day is required"}
  res.json({
    message: "Validation Error",
    statusCode: 400,
    errors: errors
    });
  };
});









//get all spots
router.get('/', async (req,res) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;
    // const where = {}
    // if(maxLat){where.lat > maxLat}
  if (!page) page = 1;
  if (!size) size = 20;
  if (page > 10) page = 10;
  if (size > 20) size = 20;
  if (Number.isInteger(page) && Number.isInteger(size) &&
    page > 0 && size > 0 && page < 11 && size < 21
    ) {page = parseInt(page);size = parseInt(size);}
    else if (isNaN(page) || isNaN(size)){
      res.status(400);
      res.json({
        "message": "Validation Error",
        "statusCode": 400,
        "errors": {
          "page": "Page must be greater than or equal to 1",
          "size": "Size must be greater than or equal to 1"
        }
      })
    }
      const spot = await Spot.findAll({
        // where,
        include: [
          {model: Review, attributes: []},
          {model: SpotImage, attributes: []}],

      attributes: [
        'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt',
        [sequelize.fn('ROUND',sequelize.fn('AVG', sequelize.col('Reviews.stars')),2),'avgStarRating'],
        [sequelize.col('SpotImages.url'), 'previewImage']],
        group: ["Spot.id", "SpotImages.url"],
        order: ["id"]
      })
      console.log(spot)
      let Spots = []
      for(let i = 0; i < spot.length; i++){
        const result = {}
        const Spots1 = spot[i]
        console.log()
        let stars = Spots1.dataValues.avgStarRating;
        if(stars === null){stars = "0.00"}
          result.id = Spots1.id,
          result.ownerId = Spots1.ownerId,
          result.address = Spots1.address,
          result.city = Spots1.city,
          result.state = Spots1.state,
          result.country = Spots1.country,
          result.lat = Spots1.lat,
          result.lng = Spots1.lng,
          result.name = Spots1.name,
          result.description = Spots1.description,
          result.price = Spots1.price,
          result.createdAt = Spots1.createdAt,
          result.updatedAt = Spots1.updatedAt,
          result.avgStarRating = stars,
          result.previewImage = Spots1.previewImage
          Spots.push(result)
      }

      const base = (page * size) - size
      const base2 = (page * size)
      const paginated = Spots.slice(base, base2)
      let result1 = {Spots: paginated, page, size}
  res.status(200);
  res.json(result1)
})

module.exports = router;
