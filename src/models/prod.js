
const pool= require('../utils/database');
module.exports = class Prod{

    constructor( title, image, price, quantity){
        this.title = title;
        this.image = image;
        this.price = price;
        this.quantity = quantity;
    }

    add_prod(){
        return pool.query('INSERT INTO products(title, price, image, quantity) VALUES ($1, $2, $3, $4);', [this.title, this.price, this.image, this.quantity]);
    }
    static get_all(){
        return pool.query('SELECT * FROM products');
    }
    async check(prodId){
        const present = pool.query('SELECT quantity FROM products WHERE id = $1',[prodId]);
        if ((await present).rows[0].quantity > 0) {
            return true;
        } else {
            return false;   
        }
    }
    async update_count(prodId){
        return pool.query('UPDATE products SET quantity = quantity-1 WHERE id = $1',[prodId]);
    }
};