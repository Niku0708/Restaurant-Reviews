import http from "../http-common";

class RestaurantDataService {
    getAll(page = 0) {                      
        return http.get(`?page=${page}`);   //the text inside get bracket is added to the baseURL in http-common.js file
    }

    get(id) {                           //used to get deatails of restaurant with a specific id.
        return http.get(`/${id}`);
    }

    find(query, by = "name", page = 0) {        //used to find all restaurants by a specific query
        return http.get(`?${by}=${query}&page=${page}`);
    }

    createReview(data) {
        return http.post("/review", data);
    }

    updateReview(data) {
        return http.put("/review", data);
    }

    deleteReview(id, userId) {
        return http.delete(`/review?id=${id}`, {data:{user_id: userId}});
    }

    getCuisines(id) {
        return http.get('/cuisines');
    }
}

export default new RestaurantDataService();