import RestaurantsDAO from "../dao/restaurantsDAO.js"

export default class RestaurantsController {
    static async apiGetRestaurants(req, res, next) {
        const restaurantsPerPage = req.query.restaurantsPerPage ? parseInt(req.query.restaurantsPerPage, 10) : 20
        //in the above line first we check if restaurantsPerPage query exists in the url (api request), if it exists we convert it to int or set it to 20
        const page = req.query.page ? parseInt(req.query.page, 10) : 0      //query is something that is after a question mark in the url

        let filters = {}                            //start filter object as empty
        if (req.query.cuisine) {                    // if cuisine query string is present
            filters.cuisine = req.query.cuisine     // then set filters.cuisine to the cuisine required
        } else if (req.query.zipcode) {
            filters.zipcode = req.query.zipcode
        } else if (req.query.name) {
            filters.name = req.query.name
        }

        const { restaurantsList, totalNumRestaurants } = await RestaurantsDAO.getRestaurants({
            filters, page, restaurantsPerPage,
        })

        let response = {                    //this is the response that the api will give to the user
            restaurants: restaurantsList,
            page: page,
            filters: filters,
            entries_per_page: restaurantsPerPage,
            total_results: totalNumRestaurants,
        }
        res.json(response)         //we are going to send a json response with above response information
    }

    static async apiGetRestaurantsById(req, res, next) {
        try {
            let id = req.params.id || {}        //parameter is something that is right after a slash
            let restaurant = await RestaurantsDAO.getRestaurantByID(id)
            if (!restaurant) {
                res.status(404).json({ error: "Not found" })
                return
            }
            res.json(restaurant)
        } catch (e) {
            console.log('api, ' + e)
            res.status(500).json({ error: e })
        }
    }

    static async apiGetRestaurantCuisines(req, res, next) {
        try {
            let cuisines = await RestaurantsDAO.getCuisines()
            res.json(cuisines)
        } catch (e) {
            console.log('api, ${e}')
            res.status(500).json({ error: e })
        }
    }
}