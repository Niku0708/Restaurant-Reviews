import app from "./server.js"
import mongodb from "mongodb"
import dotenv from "dotenv"
import RestaurantsDAO from "./dao/restaurantsDAO.js"
import ReviewsDAO from "./dao/reviewsDAO.js"
dotenv.config()
const MongoClient = mongodb.MongoClient
    
const port = process.env.PORT || 8000

MongoClient.connect(
    process.env.RESTREVIEWS_DB_URI,
    {
        maxPoolSize: 50,               //max 50 people can connect at once
        wtimeoutMS: 2500,             //request timeout 2500 mili seconds
        useNewUrlParser: true   }
    )
    .catch(err => {
        console.error(err.stack)    //log the error
        process.exit(1)            
    })
    .then(async client => {
        await RestaurantsDAO.injectDB(client)      // this is how we get our initial reference to the database
        await ReviewsDAO.injectDB(client)
        app.listen(port, () => {    //starting the web server, before this we were connecting the database
            console.log('listening on port ' + port)
        })
    })