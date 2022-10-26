const router = require('express').Router();
const {Spot, User, Review, SpotImage, ReviewImage, Booking, sequelize} = require('../../db/models');
const { Op } = require('sequelize');
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
          {model: SpotImage, attributes: [["url","previewImage"]]}
        ],
          attributes: {
            exclude:["createdAt", "updatedAt"]
            // [sequelize.col('SpotImages.url'), 'previewImage']
          }
      },
      {model: ReviewImage, attributes: ["id", "url"]}
    ],
    group: ["review.id"]
  });
  res.status(200);
  res.json({Reviews: allReviews})

})






// Delete a Review
router.delete('/:reviewId', requireAuth, async (req, res) => {
  const { user } = req;
  const revId = req.params.reviewId;
  const review = await Review.findByPk(revId)

  if(review.userId !== user.id){
    res.status(403);
    res.json({
      "message": "Forbidden",
      "statusCode": 403
    })
  }


  if (!review) {
    review.destroy()
    res.status(200)
    res.json({
      message: "Successfully deleted",
      statusCode: 200
    })
  } else {
    res.status(404)
    res.json({
      message: "Review couldn't be found",
      statusCode: 404
    })
  }
})





module.exports = router;
