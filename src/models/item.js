const pool= require('../utils/database');
module.exports = class Item{
    constructor(dish_name,cost_per_unit,image_url,dish_description,nutritional_info,health_info,cusine,dish_type,sub_type){
        this.dish_name = dish_name;
        this.image_url = image_url;
        this.cost_per_unit = cost_per_unit;
        this.dish_description = dish_description;
        this.nutirional_info = nutritional_info;
        this.health_info = health_info;
        this.cusine = cusine;
        this.dish_type = dish_type;
        this.sub_type = sub_type;
        this.dish_availability = "available";
    }

    async add_dish(){
       return pool.query('INSERT INTO dish(dish_name,cost_per_unit,image_url,dish_description,dish_availability,nutritional_info,health_info,cusine,dish_type,sub_type) VALUES ($1, $2, $3, $4,$5,$6,$7,$8,$9,$10);', [this.dish_name,this.cost_per_unit,this.image_url,this.dish_description,this.dish_availability,this.nutritional_info,this.health_info,this.cusine,this.dish_type,this.sub_type]);
    }
};