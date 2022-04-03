import mongodb from "mongodb"   // we need to import this to get access to object id because we will need to convert string to mongodb object id
const ObjectId = mongodb.ObjectId

let reviews

export default class ReviewsDAO {
    static async injectDB(conn) {
        if (reviews) {      //if reviews already exists return
            return
        }
        try {
            reviews = await conn.db(process.env.RESTREVIEWS_NS).collection("reviews")   //it will try to create to reviews, if it doesnt exist mongodb will create reviews
        } catch (e) {
            console.error('Unable to establish collection handles in userDAO: ${e}')
        }
    }

    static async addReview(restaurantId, user, review, date) {
        try {
            const reviewDoc = {
                name: user.name,
                user_id: user._id,
                date: date,
                text: review,
                restaurant_id: ObjectId(restaurantId),
            }
            return await reviews.insertOne(reviewDoc)
        } catch (e) {
            console.error('Unable to post review: '+e)
            return { error: e }
        }
    }

    static async updateReview(reviewId, userId, text, date) {
        try {
            const updateResponse = await reviews.updateOne(
                { user_id: userId, _id: ObjectId(reviewId) },
                { $set: { text: text, date: date }},
            )

            return updateResponse
        } catch (e) {
            console.error('Unable to update review: ${e}')
            return { error: e }
        }
    }

    static async deleteReview(reviewId, userId) {
        try {
            const deleteResponse = await reviews.deleteOne({
                _id: ObjectId(reviewId),
                user_id: userId,
            })
            
            return deleteResponse
        } catch (e) {
            console.error('Unable to delete review: ${e}')
            return {error: e }
        }
    }
}