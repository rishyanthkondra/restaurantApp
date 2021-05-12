const pool= require('../utils/database');
module.exports = class Allot_order{

    constructor(){
        this.title = "allot_order";
    }

    get_orders(){
        return pool.query(`select * from orders INNER JOIN online_order
        ON orders.order_id = online_order.order_id 
        and online_order.order_status = 'paid'`);
    }

    get_porders(){
        return pool.query(`select order_id, max(cost) as amount, string_agg(order_description, ', ') as od, string_agg(dish_name, ', ') as dish_names, string_agg(servings::varchar(4), ', ') as dish_servings
        from orders natural join online_order natural join order_has_dish natural join dish where order_status = 'pending'
        group by order_id;`);
    }

    get_dels(){
        return pool.query(`Select delivery_boy.employee_id, boy_status, primarycode, secondarycode, first_name, last_name 
        from (Delivery_Boy INNER JOIN employee ON delivery_boy.employee_id = employee.employee_id) 
        INNER JOIN details on details.details_id = employee.employee_id`);
    }

    get_acc(order_id, status){
        return pool.query(`update online_order set order_status = $1 where order_id = $2`,[status,order_id]);
    }

    async update_status(order_id, employee_id){
        var details = await pool.query(`Update delivery_boy set boy_status = 'On delivery'
        where employee_id = $1`,[employee_id]);
        var dt = new Date();
        dt.setHours( dt.getHours() + 1 );
        var emp = await pool.query(`Update online_order set delivery_boy_employee_id = $2, estimated_time = $3, order_status = 'on_way' where online_order.order_id = $1`,[order_id, employee_id, dt]);
   }

   async update_trans(order_id){
       var tr_id = await pool.query('select transaction_id from orders where order_id=$1',[order_id]);
       var tr_up = await pool.query(`update transactions set trans_status = 'failed' where transaction_id=$1`,[tr_id.rows[0].transaction_id]);
   }

};