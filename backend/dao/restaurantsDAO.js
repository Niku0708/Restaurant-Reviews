import mongodb from "mongodb"
const ObjectId = mongodb.ObjectId
let restaurants //created a variable which we are going to use to store reference to our database

export default class RestaurantsDAO {
    static async injectDB(conn) {
        //this is how we initially connect to the database, we will call this as soon our server starts       
        if(restaurants) {
            return
        }
        try {
            restaurants = await conn.db(process.env.RESTREVIEWS_NS).collection("restaurants")   //connecting restaurants to the "restaurants" part of sample_restaurants database on mongodb atlas
        }
        catch (e) {
            console.error(
                'Unable to establish a collection handle in restaurantsDAO: ${e}'
            )
        }
    }

    static async getRestaurants({   //used to get list of restaurants
        //setting the default values
        filters = null,             //can be used to get restaurants name wise , zip code etc.
        page = 0,                   
        restaurantsPerPage = 20, 
    } = {}) {
        let query
        if(filters) {
            if ("name" in filters) {
                query = { $text: { $search: filters["name"]}}
            } else if("cuisine" in filters) {
                query = { "cuisine": { $eq: filters["cuisine"] } }
            } else if ("zipcode" in filters) {
                query = { "address.zipcode": { $eq: filters["zipcode"] } }
            }
        }

        let cursor

        try {
            cursor = await restaurants.find(query)              //will find all the restaurants which go along the query
        } catch (e) {
            console.error('Unable to issue find command, ${e}')
            return { restaurantsList: [], totalNumRestaurants: 0 }
        }

        const displayCursor = cursor.limit(restaurantsPerPage).skip(restaurantsPerPage * page)
        
        try {
            const restaurantsList = await displayCursor.toArray()
            const totalNumRestaurants = await restaurants.countDocuments(query)

            return { restaurantsList , totalNumRestaurants }
        } catch (e) {
            console.error(
                'Unable to convert cursor to array or problem counting documents, ${e}'
            )
            return { restaurantsList: [], totalNumRestaurants: 0}
        }
    }

    static async getRestaurantByID(id) {
        try {
            const pipeline = [      //in mongodb you can create pipelines that can match different collections together
                {
                    $match: {
                        _id: new ObjectId(id),      //trying to match id of cerrtain restaurant
                    },
                },
                    {
                        $lookup: {                  //part of mongodb aggregation pipeline
                            from: "reviews",        //looking up reviews to add to the result
                            let: {
                                id: "$_id",
                            },
                            pipeline: [
                                {
                                    $match: {
                                        $expr: {
                                            $eq: ["$restaurant_id", "$$id"],    //matching id to get results
                                        },
                                    },
                                },
                                {
                                    $sort: {
                                        date: -1,
                                    },
                                },
                            ],
                            as: "reviews",      //result is going to be listed as reviews
                        },
                    },
                    {
                        $addFields: {
                            reviews: "$reviews",
                        },
                    },
            ]
            return await restaurants.aggregate(pipeline).next()
        } catch (e) {
            console.error("Something went wront in getRestaurantsByID: " + e)
        }
    }

    static async getCuisines() {
        let cuisines = []
        try {
            cuisines = await restaurants.distinct("cuisine")
            return cuisines
        } catch (e) {
            console.error('Unable to get cuisines, '+ e)
            return cuisines
        }
    }
}