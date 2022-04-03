import express from "express"
import RestaurantsCtrl from "./restaurants.controller.js"
import ReviewsCtrl from "./reviews.controller.js"

const router = express.Router() //route file

router.route("/").get(RestaurantsCtrl.apiGetRestaurants)                //displays all restaurants
router.route("/id/:id").get(RestaurantsCtrl.apiGetRestaurantsById)      //will give all the reviews of specific restaurant
router.route("/cuisines").get(RestaurantsCtrl.apiGetRestaurantCuisines) //gets a list of all available cuisies to display on front end

router
    .route("/review")                                                   
    .post(ReviewsCtrl.apiPostReview)            //add review
    .put(ReviewsCtrl.apiUpdateReview)           //update review
    .delete(ReviewsCtrl.apiDeleteReview)        //delete review

export default router