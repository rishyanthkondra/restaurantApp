const pool= require('../utils/database');

module.exports = class Onlineorders{
    constructor(cartvalue,cusId,transId){
        this.order_id = null;
    }

    async add_onlineorder(order_id,status,address_id,delivery_charges){
        return pool.query('INSERT INTO online_order(order_id,order_status,delivery_address_id,delivery_charges) VALUES ($1,$2,$3,$4)',
        [order_id,status,address_id,delivery_charges]);
    }
}