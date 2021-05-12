const pool= require('../utils/database');
module.exports = class Data_screen{

    constructor(){
        this.title = "data_screen";
    }

    get_dish_stats(start_date,end_date){
        return pool.query(`With stat(dish_id,count)  as (select dish_id, sum(servings) from order_has_dish NATURAL JOIN orders where
        orders.order_time::date <= $1 and orders.order_time::date >= $2 group by dish_id)
        select * from stat NATURAL JOIN dish where stat.dish_id = dish.dish_id`,[end_date,start_date]);
    }

    get_ingredient_stats(start_date,end_date){
        return pool.query(`With dish_stat(dish_id,count)  as  (select dish_id, sum(servings) from order_has_dish, orders where orders.order_id = order_has_dish.order_id and
        orders.order_time::date <= $1 and orders.order_time::date >= $2 group by dish_id),
        ingredient_stat(id, count) as (select ingredient_id, sum(count*quantity) from dish_stat, dish_has_ingredients where dish_stat.dish_id = dish_has_ingredients.dish_id group by ingredient_id)
        select * from ingredient_stat INNER JOIN ingredients ON ingredients.ingredient_id = ingredient_stat.id`,[end_date,start_date]);
    }

    get_pur(start_date,end_date,status){
        return pool.query(`with purchases(id,count) as (select ingredient_id, sum(quantity) from supply_order,transactions where transactions.transaction_id = supply_order.transaction_id 
        and start_time::date >= $1 and start_time::date <= $2 and transactions.trans_status = $3 group by ingredient_id)
        select *  from purchases,ingredients where ingredients.ingredient_id = purchases.id`,[start_date,end_date,status]);
    }

    get_pur(start_date,end_date,status){
        return pool.query(`with purchases(id,count) as (select ingredient_id, sum(quantity) from supply_order,transactions where transactions.transaction_id = supply_order.transaction_id 
        and start_time::date >= $1 and start_time::date <= $2 and transactions.trans_status = $3 group by ingredient_id)
        select *  from purchases,ingredients where ingredients.ingredient_id = purchases.id`,[start_date,end_date,status]);
    }

    get_trans(start_date,end_date){
        return pool.query(`select * from transactions 
        where start_time::date >= $1 and start_time::date <= $2`,[start_date,end_date]);
    }

    get_roles(){
        return pool.query('select * from roles');
    }

    async new_employee(details_id,role,wage,work_type,work_status='active'){
         var emp = await pool.query("INSERT INTO employee(employee_id, work_status,work_type,current_wage,role_id) VALUES($5,$1,$2,$3,$4)",[work_status,work_type,wage,role,details_id]);
         if(parseInt(role)==4){
            emp = await pool.query("INSERT INTO delivery_boy VALUES($1,$2,$3,$4)",['Free',1,2,details_id]);
         }
    }

    get_emps(){
        return pool.query('SELECT * from (employee INNER JOIN details ON employee.employee_id = details.details_id) INNER JOIN Roles ON employee.role_id = roles.role_id ORDER BY employee.employee_id');
    }

    get_emp(empid){
        return pool.query('SELECT * from employee INNER JOIN details ON employee.employee_id = details.details_id WHERE employee.employee_id=$1',[empid]);
    }

    async update_employee(empid,first_name,last_name,phone,email,dob,role,wage,gender,work_type,work_status){
        var details = await pool.query(`UPDATE details SET first_name = $1,last_name=$2,email=$3,phone_number=$4,date_of_birth=$5,gender=$6
         WHERE details_id = $7`,[first_name,last_name,email,phone,dob,gender,empid]);
        var emp = await pool.query("UPDATE employee SET work_status=$1,work_type=$2,current_wage=$3,role_id=$4 WHERE employee_id=$5",[work_status,work_type,wage,role,empid]);
   }

   async updatedel(empid,insert){
       if(insert){
    var emp = await pool.query("INSERT INTO delivery_boy VALUES($1,$2,$3,$4)",['Free',1,2,empid]);
       }
       else{
        var emp = await pool.query("DELETE FROM delivery_boy WHERE employee_id=$1",[empid]);
       }
}



};