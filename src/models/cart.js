const pool= require('../utils/database');
module.exports = class Cart{

    constructor(){
        this.customer_customer_id = null;
        this.dish_dish_id = null;
        this.quantity = 0;
    }
    async check(prodId){
        const present = await pool.query('SELECT 1 FROM cart WHERE user_id = 1 AND item_id = $1',[prodId]);
        if (present.rowCount > 0) {
            return true;
        } else {
            return false;   
        }
    }
    async add_to_cart(cusId,dishId,quant){
        return pool.query('INSERT INTO cart(customer_customer_id,dish_dish_id,quantity) VALUES ($1,$2,$3);', [cusId,dishId,quant]);
    }
    async update_cart(prodId,userId){
        return pool.query('UPDATE cart SET quantity = quantity+1 WHERE item_id = $1 AND user_id = $2;', [prodId,userId]);
    }
    get_all(cusId){
        // return pool.query('SELECT products.title,products.image,products.price,cart.quantity FROM cart inner join products on cart.item_id = products.id and cart.user_id = 1');
        return pool.query('SELECT * from cart inner join dish on cart.dish_dish_id = dish.dish_id and cart.customer_customer_id = $1',[cusId])
    }

    // get_credits(){
    //     return pool.query('SELECT credit from users where user_id = 1');
    // }

};