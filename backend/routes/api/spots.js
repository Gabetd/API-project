const router = require('express').Router();
const {Spot, User, Review, SpotImage, ReviewImage, sequelize} = require('../../db/models');
// const spot = require('../../db/models/spot');
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


router.get('/', async (req,res) => {
  let { page, size } = req.query;
  if (!page) page = 1;
  if (!size) size = 20;
  if (page > 10) page = 10;
  if (size > 20) size = 20;
  let upCase = /[A-Z]/g;
  let lowCase = /[a-z]/g;
  const arr1 = [page.match(upCase), page.match(lowCase)].flat(5)
  const arr2 = [size.match(upCase), size.match(lowCase)].flat(5)
  if (Number.isInteger(page) && Number.isInteger(size) &&
    page > 0 && size > 0 && page < 11 && size < 21
    ) {page = parseInt(page);size = parseInt(size);}
    // else if (arr1.length > 1 && arr2.length > 1){
    //   res.status(400);
    //   res.json({
    //     // "message": "Validation Error",
    //     // "statusCode": 400,
    //     // "errors": {
    //     //   "page": "Page must be greater than or equal to 1",
    //     //   "size": "Size must be greater than or equal to 1"
    //     // }
    //       "message": `${arr1.length} , ${arr1}`,
    //      "message2": `${arr2.length}, ${arr2}`,
    //   })
    // }

      const spot = await Spot.findAll({
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
