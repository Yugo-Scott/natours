const express = require('express');
const tourController = require('./../controllers/tourController');

const router = express.Router();

// create middleware that only applies when the id parameter is present
// router.param('id', callback) ルートパラメータ 'id' がURLに存在する場合に、指定されたコールバック関数を実行
// val: ルートパラメータの値。この場合、id の値
// router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  // .post(tourController.checkBody, tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
