const pool= require('../utils/database');
module.exports = class Ingredients{
    constructor(){
        this.ingredient_name = ingredient_name;
        this.image_url = image_url;
        this.cost_per_unit = cost_per_unit;
        this.ingredient_description = ingredient_description;
        this.unit = unit;
    }
    static get_all(){
        return pool.query('select * from ingredients order by ingredient_id ASC;');
    }
    static add_dish_has_ing(dish_id,ing_id,quantity){
        return pool.query('insert into dish_has_ingredients(dish_id,ingredient_id,quantity) values ($1,$2,$3);',[dish_id,ing_id,quantity]);
    }
    static add_ing(ingredient_name,ingredient_description,image_url,cost_per_unit,unit){
        return pool.query('insert into ingredients(ingredient_name,ingredient_description,image_url,cost_per_unit,unit) values ($1,$2,$3,$4,$5);',[ingredient_name,ingredient_description,image_url,cost_per_unit,unit]);
    }
    static getlatest(){
        return pool.query('SELECT ingredient_id FROM ingredients order by ingredient_id DESC LIMIT 1');
    }
    static get_dish_has_ing(dish_id){
        return pool.query('with my(dish_id,ingredient_id,ingredient_name) as (select dish_id,ingredient_id,ingredient_name from dish,ingredients where dish_id = $1) select my.dish_id,my.ingredient_id,my.ingredient_name,coalesce(quantity,0) as quantity from my left outer join dish_has_ingredients on my.dish_id = dish_has_ingredients.dish_id and my.ingredient_id = dish_has_ingredients.ingredient_id order by my.ingredient_id;',[dish_id]);
    }
    static get_dish_has_ing1(dish_id){
        return pool.query('with my(dish_id,ingredient_id,ingredient_name) as (select dish_id,ingredient_id,ingredient_name from dish,ingredients where dish_id = $1) select my.dish_id,my.ingredient_id,coalesce(quantity,-1) as quantity from my left outer join dish_has_ingredients on my.dish_id = dish_has_ingredients.dish_id and my.ingredient_id = dish_has_ingredients.ingredient_id order by my.ingredient_id;',[dish_id]);
    }
    static update_dish_has_ing(dish_id,ing_id,quantity){
        return pool.query('update dish_has_ingredients set quantity = $3 where dish_id = $1 and ingredient_id = $2;',[dish_id,ing_id,quantity]);
    }
    //with my(dish_id,ingredient_id) as (select dish_id,ingredient_id from dish,ingredients where dish_id = 1)
    // select my.dish_id,my.ingredient_id,coalesce(quantity,0) as quantity from my left outer join dish_has_ingredients on my.dish_id = dish_has_ingredients.dish_id and my.ingredient_id = dish_has_ingredients.ingredient_id;
};