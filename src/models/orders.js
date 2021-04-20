const pool= require('../utils/database');
module.exports = class Orders{

    constructor(){
        this.title = "";
        this.image = "";
        this.price = 0;
        this.quantity = 0;
    }

    async order(cartvalue){
        //see if order already placed for the object
        //insert if not present 
        //await pool.query('INSERT INTO orders(user_id,item_id,quantity) SELECT cart.user_id,cart.item_id,cart.quantity FROM cart WHERE ')
        //else update
       // await pool.query('UPDATE orders(user_id,item_id,quantity) select cart.user_id,cart.item_id,coalesce((select quantity from orders where user_id = 1 and item_id = cart.item_id),0)+cart.quantity from orders left outer join cart on  where user_id = 1;')
       const cart_items = await pool.query('SELECT item_id from cart where user_id = 1');
       for(var i=0;i<cart_items.rows.length;i++){
           const query_s = "do $$ DECLARE item int = "+cart_items.rows[i].item_id+"; begin IF EXISTS (SELECT quantity from orders where item_id = item and user_id = 1) THEN UPDATE orders set quantity = quantity+(select quantity from cart where item_id = item and user_id = 1) where item_id = item and user_id = 1; ELSE INSERT INTO orders SELECT * from cart where item_id = item and user_id = 1; END IF; end $$";
           await pool.query({text: query_s});
       }
       await pool.query('DELETE from cart where user_id = 1;')
        return pool.query('UPDATE users set credit = credit-$1 where user_id = 1;',[cartvalue]);
    }

    order_cond(){
        return pool.query('SELECT * FROM cart where user_id = 1');
    }


    get_cartvalue(){
        return pool.query('SELECT sum(products.price*cart.quantity) as cartvalue FROM cart inner join products on cart.item_id = products.id where cart.user_id = 1 group by cart.user_id;');
    }
    get_credits(){
        return pool.query('SELECT credit from users where user_id = 1');
    }
    async get_all(){
        return pool.query('SELECT products.title,products.image,products.price,orders.quantity FROM orders inner join products on orders.item_id = products.id and orders.user_id = 1');
    }
};