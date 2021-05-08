const pool = require('../utils/database')
const User = require('../models/user')
module.exports = class UserDetails{
    constructor(first_name,last_name,email,phone_number,date_of_birth,gender){
        this.first_name = first_name;
        this.last_name = last_name;
        this.email = email;
        this.phone_number = phone_number;
        this.date_of_birth = date_of_birth;
        this.gender = gender;
    }

    async getDetailsId(){
        const usr = new User(this.email);
        const details_id = await usr.getDetailsId().catch(err=>console.log(err));
        return details_id;
    }
    ///// -> use for editing user details
    async updateDetails(){
        const details_id = await this.getDetailsId().catch(err=>console.log(err));
        return  pool.query("UPDATE details SET "+ 
                        "first_name = $1,"+
                        "last_name = $2,"+
                        "phone_number = $3,"+
                        "date_of_birth = $4,"+
                        "gender = $5"+
                        " WHERE details_id = $6;" ,
                        [this.first_name,this.last_name,
                        this.phone_number,this.date_of_birth,this.gender,
                        details_id]);
    }
}