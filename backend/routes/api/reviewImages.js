const router = require('express').Router();
const { Spot, SpotImage, User, ReviewImage, Review, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');


router.delete('/:reviewImageId', requireAuth, async (req, res) => {
  const reviewImageId = req.params.reviewImageId;
  const { user } = req
  const reviewImage = await ReviewImage.findByPk(reviewImageId)
  if (!reviewImage) {
    res.status(404)
    res.json({
      message: "Review Image couldn't be found",
      statusCode: 404
    })
  }
  const userReview = await Review.findByPk(reviewImage.reviewId)


  if(userReview.userId !== user.id){
    res.status(403);
    res.json({
      "message": "Forbidden",
      "statusCode": 403
    })
  }

    reviewImage.destroy()
    res.json({
        message: "Successfully deleted",
        statusCode: 200
      })
})

module.exports = router;
