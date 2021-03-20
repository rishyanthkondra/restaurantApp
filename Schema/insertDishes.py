import csv

def insert_dishes(insert_file,data_file):
    csvfile = open(data_file,'r')
    output = open(insert_file,'w')
    reader = csv.DictReader(csvfile)
    columns = ['dish_name','cost_per_unit','image_url','dish_description','nutritional_info','health_info','cusine','dish_type','sub_type']
    for row in reader:
        myrow = ["'"+row[x]+"'" for x in columns]
        output.write(f"INSERT INTO DISH({','.join(columns)}) VALUES({','.join(myrow)});\n")

insert_dishes("insert_Dishes.sql","data/Dishes.csv")

