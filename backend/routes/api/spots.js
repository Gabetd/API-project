const router = require('express').Router();
const {Spot, User, Review, SpotImage, ReviewImage, sequelize} = require('../../db/models');
const spot = require('../../db/models/spot');
const { requireAuth } = require('../../utils/auth');



// async function countReviews(obj, id) {
//   let avgStarRating = await Spot.findOne({
//     where: {
//         id: id
//     },
//     include: [
//         {
//             model: Review,
//             attributes: []
//         }
//     ],
//     attributes: [
//       [
//           sequelize.fn("COUNT", sequelize.col("Reviews.id")),
//           "numReviews"
//       ],
//         [
//             sequelize.fn('AVG', sequelize.col('Reviews.stars')),
//             'avgStarRating'
//         ]
//     ]
// });
// obj = avgStarRating;
//   // aggregates.avgStarRating = Review.toJSON().avgStarRating;
//   return obj
// }



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
        'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt',
        [sequelize.fn('AVG', sequelize.col('Reviews.stars')),'avgRating'],
        [sequelize.col('SpotImages.url'), 'previewImage']
      ],
      group: ["spot.id"]
    });
    let result = {
      spots: spot
    }
    console.log(result.spots.length)
  res.status(200);
  res.json(result)

});

router.get('/:spotId', async (req,res) => {
  const id = req.params.spotId
  // let spot1 = await Spot.findOne({
  //   where:
  //       {id: id},
  // });

  let spot = await Spot.findOne({
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
if(spot.id === null || !spot){
  res.status(404);
  res.json({
    "message": "Spot couldn't be found",
    "statusCode": 404
  })
}
// spot = spot1.toJSON()
// Object.assign(spot, spot2),
res.status(200);
res.json(spot)

});


router.get('/', async (req,res) => {
  const Spots = await Spot.findAll({
    include: [
      {model: Review, attributes: []},
      {model: SpotImage, attributes: []}],

    attributes: [
       'id', 'ownerId', 'address', 'city', 'state', 'country', 'lat', 'lng', 'name', 'description', 'price', 'createdAt', 'updatedAt',
      [sequelize.fn('AVG', sequelize.col('Reviews.stars')),'avgRating'],
      [sequelize.col('SpotImages.url'), 'previewImage']],
  group: ["spot.id"]
  })
  res.status(200);
  res.json(Spots)
})

module.exports = router;
