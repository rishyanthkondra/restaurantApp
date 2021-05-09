const pool = require('../utils/database')
const User = require('../models/user')
module.exports = class Address{
    constructor(email,address_id,house_num,region,alias,symbol){
        this.email = email;
        this.address_id = address_id;
        this.house_num = house_num;
        this.alias = alias;
        this.region = region;
        this.symbol = symbol;
    }

    async getDetailsId(){
        const usr = new User(this.email);
        const details_id = await usr.getDetailsId().catch(err=>console.log(err));
        return details_id;
    }
    ///// -> adding a new address
    async addAddress(){ //use address model
        const details_id = await this.getDetailsId().catch(err=>console.log(err));
        return  pool.query(
                        "INSERT INTO address(house_num,region,belongs_to,symbol,alias)"+ 
                        " VALUES ($1,$2,$3,$4,$5)" ,
                        [this.house_num,this.region,
                        details_id,this.symbol,this.alias]);
    }
    ///// -> deleting an existing address
    static deleteAddress(address_id){
        return pool.query("DELETE FROM address WHERE address_id = $1",[address_id]);
    }
    ///// -> updating an existing address
    async updateAddress(){
        return  pool.query("UPDATE address SET "+ 
                        "house_num = $1,"+
                        "region = $2,"+
                        "symbol = $3,"+
                        "alias = $4"+
                        " WHERE address_id = $5" ,
                        [this.house_num,this.region,this.symbol,
                        this.alias,this.address_id]);
    }
}