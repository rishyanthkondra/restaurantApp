const pool = require('../utils/database')
const User = require('../models/user')
module.exports = class Bookings{
    constructor(email,booking_date,booking_time,tableList){
        this.email = email;
        this.booking_date = booking_date;
        this.booking_time = booking_time;
        this.tableList = tableList;
    }

    async getDetailsId(){
        const usr = new User(this.email);
        const details_id = await usr.getDetailsId().catch(err=>console.log(err));
        return details_id;
    }

    async hasActiveBooking(){
        const details_id = await this.getDetailsId().catch(err=>console.log(err));
        const exists = await pool.query(
            "SELECT 1 FROM booking WHERE customer_id = $1 AND start_time > $2;",
            [details_id,new Date().toISOString()]);
        return (exists.rowCount > 0);
    }

    async getActiveBooking(){
        const details_id = await this.getDetailsId().catch(err=>console.log(err));
        return pool.query(
            "SELECT booking_id,start_time, booking_time "+
            "FROM booking  "+
            "WHERE customer_id = $1 AND start_time > $2;",
            [details_id,new Date().toISOString()]);
    }

    static cancelBooking(booking_id){
        pool.query('DELETE FROM  booking_has_tables WHERE booking_id = $1',[booking_id])
        .catch(err=>console.log(err));
        return pool.query('DELETE FROM booking WHERE booking_id = $1',[booking_id]);
    }

    async getTables(booking_id){
        return pool.query("SELECT table_id FROM booking_has_tables WHERE booking_id = $1;",
        [booking_id]);
    }

    async getFreeTables(){
        const reqTime = String(this.booking_date)+" "+String(this.booking_time).split(':')[0]+":00 +5:30";
        return pool.query(
            "SELECT * FROM "+
            "(SELECT table_id FROM tabless "+
            "EXCEPT "+
            "SELECT DISTINCT table_id "+
            " FROM booking b JOIN booking_has_tables bt ON b.booking_id = bt.booking_id "+
            " WHERE start_time = $1) AS newTab"+
            " ORDER BY table_id;",
            [reqTime]);
    }
    
    async bookTables(){
        const details_id = await this.getDetailsId().catch(err=>console.log(err));
        const freeTables = await this.getFreeTables().catch(err=>console.log(err));
        for (var i=0;i<this.tableList.length;i++){
            if (! this.tableList[i] in freeTables) {
                console.log("not free table detected!");
                throw "A free table is booked, not free now";
            }
        }
        const start_time = String(this.booking_date)+" "+String(this.booking_time).split(':')[0]+":00 +5:30";
        const qRes = await pool.query("INSERT INTO booking(start_time,customer_id) VALUES($1,$2) RETURNING booking_id;",
                        [start_time,
                        details_id]);
        const bid = qRes.rows[0].booking_id;
        for (var i=0;i<this.tableList.length;i++){
            pool.query("INSERT INTO booking_has_tables VALUES($1,$2);",
            [bid,this.tableList[i]]);
        }
        return true;
    }

    
}