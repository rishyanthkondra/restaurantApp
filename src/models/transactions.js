const pool= require('../utils/database');

module.exports = class Transactions{
    
    constructor(){
        this.trans_id = null;        
    }

    async add_transaction(cartvalue,status='pending',description=''){
        var now = new Date();
        var date = now.getFullYear()+'-'+now.getMonth()+'-'+now.getDate()
        var time = now.getHours() +':'+now.getMinutes()+':00'+'+05:30'
        var start_time = date+' '+time
        var trans_id =  await pool.query('INSERT INTO transactions(transaction_description,start_time,trans_status,cost) VALUES ($1,$2,$3,$4) RETURNING transaction_id',
                        [description,start_time,status,cartvalue]);
        this.trans_id = trans_id.rows[0].transaction_id;
        return this.trans_id;        
    }

    async update_paid_status(trans_id){
        return pool.query("UPDATE transactions SET trans_status = 'successful' WHERE transaction_id=$1;",[trans_id]);
        
    }

}
