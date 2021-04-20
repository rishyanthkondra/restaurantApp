const pool= require('../utils/database');
module.exports = class Cart{

    constructor(){
        this.title = "";
        this.image = "";
        this.price = 0;
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
    async add_to_cart(prodId,userId){
        return pool.query('INSERT INTO cart(user_id,item_id,quantity) VALUES ($1,$2,$3);', [userId,prodId,1]);
    }
    async update_cart(prodId,userId){
        return pool.query('UPDATE cart SET quantity = quantity+1 WHERE item_id = $1 AND user_id = $2;', [prodId,userId]);
    }
    get_all(){
        return pool.query('SELECT products.title,products.image,products.price,cart.quantity FROM cart inner join products on cart.item_id = products.id and cart.user_id = 1');
    }

    get_credits(){
        return pool.query('SELECT credit from users where user_id = 1');
    }

};