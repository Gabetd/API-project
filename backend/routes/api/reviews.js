const router = require('express').Router();
const {Spot, User, Review, SpotImage, ReviewImage, Booking, sequelize} = require('../../db/models');
const { requireAuth } = require('../../utils/auth');






// Add an Image to a Review based on the Review's id
router.post('/:reviewId/images', requireAuth, async (req, res) => {
  const { user } = req
  const { url } = req.body
  const revId = req.params.reviewId
  const rev = await Review.findByPk(revId)
  if (!rev) {
    res.status(404)
    res.json({
        message: "Review couldn't be found",
        statusCode: 404
    })
  }
    const imgCount = await ReviewImage.findAll({
      where: {
        reviewId: rev.id
      }
    })

    if(imgCount.length >= 10){
      res.status(403);
      res.json({
        "message": "Maximum number of images for this resource was reached",
        "statusCode": 403
      })
    }

    if(rev.userId !== user.id){
      res.status(403);
      res.json({
        "message": "Forbidden",
        "statusCode": 403
      })
    }

      const imageReview = await ReviewImage.create({
          reviewId: parseInt(req.params.reviewId),
          url
      })
      let result = {
        id: imageReview.id,
        url: imageReview.url
      }
      res.status(200)
      res.json(result)

})










// Edit a Review
router.put('/:reviewId', requireAuth, async (req, res) => {
  const { review, stars } = req.body
  const revId = req.params.reviewId
  const { user } = req
  const userReview = await Review.findByPk(revId)

  if (stars > 5 || stars < 1){
    res.status(400);
    res.json({
      "message": "Validation error",
      "statusCode": 400,
      "errors": {
        "review": "Review text is required",
        "stars": "Stars must be an integer from 1 to 5",
      }
    })
  }


  if(!userReview){
    res.status(404)
    res.json({
        message: "Review couldn't be found",
        statusCode: 404
    })
  }
  if(userReview.userId !== user.id){
    res.status(403);
    res.json({
      "message": "Forbidden",
      "statusCode": 403
    })
  }
  userReview.update({
    review,
    stars})
      res.status(200)
      res.json(userReview)
})





// Get all Reviews of the Current User
router.get('/current', requireAuth, async (req, res) => {
  const { user } = req
  const allReviews = await Review.findAll({
    where: {
      userId: user.id
    },
    include:[
      {model: User, attributes: ["id", "firstName", "lastName"]},
      {model: Spot,
        include: [
          {model: SpotImage, attributes: ["id", "url"]}
        ],
          attributes: {
            exclude:["createdAt", "updatedAt"]
            // [sequelize.col('SpotImages.url'), 'previewImage']
          }
      },
      {model: ReviewImage, attributes: ["id", "url"]}
    ],
    // group: ["Spot.id", "SpotImages.id", "User.id", "Review.id"],
  });

  const Reviews = []
  for(let i = 0; i < allReviews.length; i++){
      const b = allReviews[i]
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
        userId: b.userId,
        spotId: b.spotId,
        review: b.review,
        stars: b.stars,
        createdAt: b.createdAt,
        updatedAt:b.updatedAt,
        User: b.User,
        Spot: Spot,
        ReviewImages: b.ReviewImages
      }
      Reviews.push(obj)
  }
  res.status(200);
  res.json({Reviews})

})






// Delete a Review (not working)
router.delete('/:reviewId', requireAuth, async (req, res) => {
  const { user } = req;
  const revId = req.params.reviewId;
  const rev = await Review.findByPk(revId)
    if (!rev) {
      res.status(404)
      res.json({
        message: "Review couldn't be found",
        statusCode: 404
      })
    }

    if(rev.userId !== user.id){
      res.status(403);
      res.json({
        "message": "Forbidden",
        "statusCode": 403
      })
    };

    rev.destroy()
    res.status(200)
    res.json({
      message: "Successfully deleted",
      statusCode: 200
    })
})





module.exports = router;
