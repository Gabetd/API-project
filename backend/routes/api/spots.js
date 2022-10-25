const router = require('express').Router();
const Layer = require('express/lib/router/layer');
const { where } = require('sequelize');
const {Spot, User, Review, SpotImage, ReviewImage, sequelize} = require('../../db/models');
// const spot = require('../../db/models/spot');
const { requireAuth } = require('../../utils/auth');





//get spot by current user
router.get('/current', requireAuth, async (req,res) => {
  const { user } = req;
  const spots = await Spot.findAll({
    where: {
      ownerId: user.id
    },
    include: [
      {model: Review, attributes: []},
      {model: SpotImage, attributes: []}],

      attributes: [
        'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat',
         'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt',
        [sequelize.fn('AVG', sequelize.col('Reviews.stars')),'avgRating'],
        [sequelize.col('SpotImages.url'), 'previewImage']
      ],
      group: ["spot.id"]
    });


  res.status(200);
  res.json({spots})

});




//get spot by id
router.get('/:spotId', async (req,res) => {
  const id = req.params.spotId
  // let spot1 = await Spot.findOne({
  //   where:
  //       {id: id},
  // });

  let spots = await Spot.findOne({
    where: {
      id: id
    },
    attributes:
    [["id", "id"],["ownerId","ownerId"],["address","address"],["city","city"],["state","state"],
    ["country","country"],["lat","lat"],["lng","lng"],["name","name"],["description","description"],
    ["price","price"],["createdAt","createdAt"],["updatedAt","updatedAt"],
    [sequelize.fn("COUNT", sequelize.col("Reviews.id")),"numReviews"],
    [sequelize.fn('AVG', sequelize.col('Reviews.stars')),'avgStarRating']],

    include: [
      {model: Review, attributes: []},
      {model: SpotImage, attributes: ["id", "url", "preview"]},
      {model: User, as: "Owner",
      attibutes: ["id", "firstName", "lastName"]
    },
  ],
})
if(spots.id === null || !spots){
  res.status(404);
  res.json({
    "message": "Spot couldn't be found",
    "statusCode": 404
  })
}
// spot = spot1.toJSON()
// Object.assign(spot, spot2),
res.status(200);
res.json(spots)
});


// Delete a Spot
router.delete('/:spotId', requireAuth, async (req, res) => {
  const spotId = req.params;
  const spot = await Spot.findByPk(spotId)

  if (!spot) {
      res.status(404)
      res.json({
        message: "Spot couldn't be found",
        statusCode: 404
      })
  }

  spot.destroy()
  res.status(200);
  res.json({
      message: "Successfully deleted",
      statusCode: 200
  })
})




//create spot
router.post('/', requireAuth, async (req, res) => {
  const { address, city, state, country, lat, lng, name, description, price } = req.body;
  try{
      const spot = await Spot.create({ ownerId: req.user.id,
        address,
        city,
        state,
        country,
        lat: 1,
        lng: 1,
        name,
        description,
        price })
      return res.json(spot);
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

    // city: ,
    // state: ,
    // country: ,
    // lat: ,
    // lng: ,
    // name: ,
    // description: ,
    // price:

//get all routes
router.get('/', async (req,res) => {
  let { page, size, minLat, maxLat, minLng, maxLng, minPrice, maxPrice} = req.query;
    const where = {}
    if(maxLat){where.lat > maxLat}

  if (!page) page = 1;
  if (!size) size = 20;
  if (page > 10) page = 10;
  if (size > 20) size = 20;


  if (Number.isInteger(page) && Number.isInteger(size) &&
    page > 0 && size > 0 && page < 11 && size < 21
    ) {page = parseInt(page);size = parseInt(size);}
    // else if (){
    //   res.status(400);
    //   res.json({
    //     "message": "Validation Error",
    //     "statusCode": 400,
    //     "errors": {
    //       "page": "Page must be greater than or equal to 1",
    //       "size": "Size must be greater than or equal to 1"
    //     }
    //   })
    // }
  //   "message": `${arr1.length} , ${arr1}`,
  //  "message2": `${arr2.length}, ${arr2}`,
  //  "message3": `${arr3.length}, ${arr3}`,
  //  "message4": `${arr4.length}, ${arr4}`,
      const spot = await Spot.findAll({
        where,
        include: [
          {model: Review, attributes: []},
          {model: SpotImage, attributes: []}],

      attributes: [
        'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt',
        [sequelize.fn('AVG', sequelize.col('Reviews.stars')),'avgRating'],
        [sequelize.col('SpotImages.url'), 'previewImage']],
        group: ["spot.id"],
      })
      const base = (page * size) - size
      const base2 = (page * size)
      const paginated = spot.slice(base, base2)
      // console.log(base, base2)
      let result = {Spots: paginated, page, size}
  res.status(200);
  res.json(result)
})

module.exports = router;
