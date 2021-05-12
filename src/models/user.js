const pool = require('../utils/database');
module.exports = class User{

/////////////////// Constructors ////////////////////////
    constructor(email){
        this.email = email;
    }

////////////////// Some useful checks ////////////////////////
    async inDb(){
        const exists = await pool.query(
            "SELECT 1 FROM details WHERE email = $1;",
            [this.email]);
        return (exists.rowCount > 0);
    }

    async checkIsEmployee(){
        if (!this.inDb()){
            console.warn("Tried checking employee records for an email not in database!");
            return false;
        }else{
            const details_id = await this.getDetailsId().catch(err=>console.log(err));
            const inEmployee = await pool.query(
                "SELECT 1 FROM Employee WHERE employee_id = $1;",
                [details_id]);
            return inEmployee.rowCount > 0;
        }
    }

    async checkIsRequiredRole(role){
        if (!this.inDb()){
            console.warn("Tried checking employee records for an email not in database!");
            return false;
        }else{
            const details_id = await this.getDetailsId().catch(err=>console.log(err));
            const inEmployee = await pool.query(
                " select 1 from employee natural join roles WHERE employee_id = $1 and role_name = $2;",
                [details_id,role]);
            return inEmployee.rowCount > 0;
        }
    }

    async getRole(){
        if (!this.inDb()){
            console.warn("Tried checking employee records for an email not in database!");
            return false;
        }else{
            const details_id = await this.getDetailsId().catch(err=>console.log(err));
            const inEmployee = await pool.query(
                " select role_name from employee natural join roles WHERE employee_id = $1;",
                [details_id]);
            return inEmployee.rows;
        }
    }

////////////////// some useful functions
    async getDetailsId(){
        const details = await pool.query(
            "SELECT details_id FROM details WHERE email = $1;",
            [this.email]);
        return details.rows[0].details_id;
    }

/////////////// user details part including addresses ////////////////////////
///// -> do the things when user logged in for first time
    async doFirstTimeThings(user){
        const first_name = user.given_name;
        const last_name = user.family_name;
        const email = user.email;
        // insert into details
        await pool.query("INSERT INTO details(first_name,last_name,email) VALUES ($1,$2,$3);",[first_name,last_name,email]);
        // insert into Customer
        const details_id = await this.getDetailsId().catch(err=>console.log(err));
        return pool.query("INSERT INTO customer(customer_id) VALUES ($1);",
                          [details_id]);
    }
///// -> getting all details
    async getDetailsUsingDetailsId(details_id){
        return pool.query("SELECT * FROM details WHERE details_id = $1;",[details_id]);
    }

    async getDetails(){
        return pool.query("SELECT * FROM details WHERE email = $1;",[this.email]);
    }   

///// -> get all addresses using 
    async getAddressesUsingDetailsId(details_id){
        return pool.query("SELECT * FROM address WHERE belongs_to = $1",[details_id]);
    }
    async getAddresses(){
        const details_id = await this.getDetailsId().catch(err=>console.log(err));
        return pool.query("SELECT * FROM address WHERE belongs_to = $1",
                [details_id]);
    }
///// -> adding a new address and updating in address.js
/////////////////////// Favourite dishes ///////////////////////////////////
    async getFavouriteDishes(customer_id){
        return pool.query("SELECT  dish_id FROM favourites WHERE customer_id = $1",[customer_id]);
        //extract as list and call the one similar to menu object
        // use a dish_model and get all from there ?? - to be discussed
    }
//////////////////////// Previous orders //////////////////////////////////
    async getPendingOrders(){
        const details_id = await this.getDetailsId().catch(err=>console.log(err));
        return pool.query(
            "SELECT o.order_id,o.order_time,o.cost,oo.delivery_charges,oo.order_status, "+
            "ad.alias,ad.house_num "+
            "FROM "+
            "orders o INNER JOIN "+
            "online_order oo ON o.order_id = oo.order_id INNER JOIN "+
            "address ad ON oo.delivery_address_id = ad.address_id "+
            "WHERE o.customer_id = $1 AND oo.order_status = 'pending';"
        ,[details_id]);
    }
    async getOnWayOrders(){
        const details_id = await this.getDetailsId().catch(err=>console.log(err));
        return pool.query(
            "SELECT o.order_id,o.order_time,o.cost,oo.delivery_charges,oo.order_status, "+
            "ad.alias,ad.house_num,d.first_name,d.phone_number "+
            "FROM "+
            "orders o INNER JOIN "+
            "online_order oo ON o.order_id = oo.order_id INNER JOIN "+
            "address ad ON oo.delivery_address_id = ad.address_id INNER JOIN "+
            "details d ON d.details_id = oo.delivery_boy_employee_id "+
            "WHERE o.customer_id = $1 AND oo.order_status = 'on_way';"
        ,[details_id]);
    }
    async getConfirmedOrders(){
        const details_id = await this.getDetailsId().catch(err=>console.log(err));
        return pool.query(
            "SELECT o.order_id,o.order_time,o.cost,oo.delivery_charges,oo.order_status, "+
            "ad.alias,ad.house_num "+
            "FROM "+
            "orders o INNER JOIN "+
            "online_order oo ON o.order_id = oo.order_id INNER JOIN "+
            "address ad ON oo.delivery_address_id = ad.address_id "+
            "WHERE o.customer_id = $1 AND oo.order_status = 'confirmed';"
        ,[details_id]);
    }
    async getCompletedOrders(){
        const details_id = await this.getDetailsId().catch(err=>console.log(err));
        var res = await pool.query(
            "SELECT o.order_id,o.rating,o.review,o.order_time,o.cost,oo.delivery_charges,oo.order_status, "+
            "ad.alias,ad.house_num "+
            "FROM "+
            "orders o INNER JOIN "+
            "online_order oo ON o.order_id = oo.order_id INNER JOIN "+
            "address ad ON oo.delivery_address_id = ad.address_id "+
            "WHERE o.customer_id = $1 AND oo.order_status IN ('rejected','delivered') LIMIT 5;"
        ,[details_id]).catch(err=>console.log(err));
        //fetch dishes too dish_id, name, image_url, rating
        for(var i=0;i<res.rowCount;i++){
            const oid = res.rows[i].order_id;
            const dishRows = await pool.query(
                "SELECT d.dish_id,d.dish_name,d.image_url,"+
                "(SELECT rating from rates r WHERE r.dish_id = d.dish_id "+
                " AND r.customer_id = $2) as rating"+
                "FROM order_has_dish od INNER JOIN "+
                "dish d ON od.dish_id = d.dish_id"+
                "WHERE od.order_id = $1",[oid,details_id]).catch(err=>console.log(err));
            res.rows[i].dishes = dishRows;
        }
        return res;
    }
//////////////////////// Bookings /////////////////////////////////////////
};