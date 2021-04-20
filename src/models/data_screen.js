const pool= require('../utils/database');
module.exports = class Data_screen{

    constructor(){
        this.title = "data_screen";
    }

    get_dish_stats(start_date,end_date){
        return pool.query(`With stat(dish_id,count)  as (select dish_id, sum(servings) from order_has_dish NATURAL JOIN orders where
        orders.order_time <= $1::date and orders.order_time >= $2::date group by dish_id)
        select * from stat NATURAL JOIN dish where stat.dish_id = dish.dish_id`,[end_date,start_date]);
    }

    get_ingredient_stats(start_date,end_date){
        return pool.query(`With dish_stat(dish_id,count)  as  (select dish_id, sum(servings) from order_has_dish, orders where orders.order_id = order_has_dish.order_id and
        orders.order_time <= $1::date and orders.order_time >= $2::date group by dish_id),
        ingredient_stat(id, count) as (select ingredient_id, sum(count*quantity) from dish_stat, dish_has_ingredients where dish_stat.dish_id = dish_has_ingredients.dish_id group by ingredient_id)
        select * from ingredient_stat INNER JOIN ingredients ON ingredients.ingredient_id = ingredient_stat.id`,[end_date,start_date]);
    }

    get_pur(start_date,end_date,status){
        return pool.query(`with purchases(id,count) as (select ingredient_id, sum(quantity) from supply_order,transactions where transactions.transaction_id = supply_order.transaction_id 
        and start_time >= $1::date and start_time <= $2::date and transactions.trans_status = $3 group by ingredient_id)
        select *  from purchases,ingredients where ingredients.ingredient_id = purchases.id`,[start_date,end_date,status]);
    }

    get_pur(start_date,end_date,status){
        return pool.query(`with purchases(id,count) as (select ingredient_id, sum(quantity) from supply_order,transactions where transactions.transaction_id = supply_order.transaction_id 
        and start_time >= $1::date and start_time <= $2::date and transactions.trans_status = $3 group by ingredient_id)
        select *  from purchases,ingredients where ingredients.ingredient_id = purchases.id`,[start_date,end_date,status]);
    }

    get_trans(start_date,end_date){
        return pool.query(`select * from (transactions INNER JOIN employee ON transactions.supervising_employee_id = employee.employee_id) INNER JOIN details ON details.details_id = employee.details
        where start_time >= $1::date and start_time <= $2::date`,[start_date,end_date]);
    }

    get_roles(){
        return pool.query('select * from roles');
    }

    async new_employee(first_name,middle_name,last_name,phone,email,dob,role,wage,gender,work_type,work_status='active'){
         var details = await pool.query(`INSERT INTO details(first_name,middle_name,last_name,email,phone_number,date_of_birth,gender) VALUES($1,$2,$3,$4,$5,$6,$7) 
         RETURNING details_id`,[first_name,middle_name,last_name,email,phone,dob,gender]);
         var emp = await pool.query("INSERT INTO employee(work_status,work_type,details,current_wage,role_id) VALUES($5,$1,$2,$3,$4)",[work_type,details.rows[0].details_id,wage,role,work_status]);
    }

    get_emps(){
        return pool.query('SELECT * from (employee INNER JOIN details ON employee.details = details.details_id) INNER JOIN Roles ON employee.role_id = roles.role_id');
    }

    get_emp(empid){
        return pool.query('SELECT * from employee INNER JOIN details ON employee.details = details.details_id WHERE employee.employee_id=$1',[empid]);
    }

    async update_employee(empid,details_id,first_name,middle_name,last_name,phone,email,dob,role,wage,gender,work_type,work_status){
        var details = await pool.query(`UPDATE details SET first_name = $1,middle_name=$2,last_name=$3,email=$4,phone_number=$5,date_of_birth=$6,gender=$7
         WHERE details_id = $8`,[first_name,middle_name,last_name,email,phone,dob,gender,details_id]);
        var emp = await pool.query("UPDATE employee SET work_status=$1,work_type=$2,current_wage=$3,role_id=$4 WHERE employee_id=$5",[work_status,work_type,wage,role,empid]);
   }

};