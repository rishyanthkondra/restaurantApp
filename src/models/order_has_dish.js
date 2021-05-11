const pool= require('../utils/database');

module.exports = class order_has_dish{
    constructor(){}

    add_order_has_dish(dish_id,order_id,quantity){
        return pool.query('INSERT INTO order_has_dish(dish_id,order_id,servings) VALUES ($1,$2,$3)',[dish_id,order_id,quantity]);
    }
};