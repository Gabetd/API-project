const router = require('express').Router();
const { Spot, SpotImage, User, ReviewImage, Review, Booking } = require('../../db/models');
const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { requireAuth } = require('../../utils/auth');


router.delete('/:imageId', requireAuth, async (req, res) => {
  const SpotImageId = req.params.imageId;
  const { user } = req
  const image = await SpotImage.findByPk(SpotImageId)
  if (!image) {
    res.status(404)
    res.json({
      message: "Spot Image couldn't be found",
      statusCode: 404
    })
  }
  const spot = await Spot.findByPk(image.spotId)

  if(spot.ownerId !== user.id){
    res.status(403);
    res.json({
      "message": "Forbidden",
      "statusCode": 403
    })
  }

    await image.destroy()
    res.json({
        message: "Successfully deleted",
        statusCode: 200
      })
})

module.exports = router;
