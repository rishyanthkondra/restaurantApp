import csv

def insert(insert_file,data_file,columns):
	csvfile = open(data_file,'r')
	output = open(insert_file,'w+')
	reader = csv.reader(csvfile)
	for row in reader:
		myrow = ["'"+row[i]+"'" for i in range(len(columns))]
		output.write(f"INSERT INTO DISH({','.join(columns)}) VALUES({','.join(myrow)});\n")

dish_columns = ['dish_name','cost_per_unit','image_url','dish_description','nutritional_info','health_info','cusine','dish_type','sub_type']
insert("insertScripts/dish.sql","data/dish.csv",dish_columns)

ingredient_columns = ['ingredient_name','ingredient_description','image_url','unit','cost_per_unit']
insert("insertScripts/ingredients.sql","data/ingredients.csv",ingredient_columns)



