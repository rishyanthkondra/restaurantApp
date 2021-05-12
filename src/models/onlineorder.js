const pool= require('../utils/database');

module.exports = class Onlineorders{
    
    static add_onlineorder(order_id,status,address_id,delivery_charges){
        return pool.query('INSERT INTO online_order(order_id,order_status,delivery_address_id,delivery_charges) VALUES ($1,$2,$3,$4)',
        [order_id,status,address_id,delivery_charges]);
    }
    
    static update_paid_status(order_id){
        return pool.query("UPDATE online_order SET order_status = 'paid' WHERE order_id=$1;",[order_id]);
    }

};