-- -----------------------------------------------------
-- Schema public
-- -----------------------------------------------------
SET timezone = 'Asia/Kolkata';

DROP TABLE IF EXISTS Supply_Order ;
DROP TABLE IF EXISTS Order_has_dish ;
DROP TABLE IF EXISTS Online_order ;
DROP TABLE IF EXISTS Delivery_Boy ;
DROP TABLE IF EXISTS Orders ;
DROP TABLE IF EXISTS Rates ;
DROP TABLE IF EXISTS Cart ;
DROP TABLE IF EXISTS Dish_has_Ingredients ;
DROP TABLE IF EXISTS Ingredients ;
DROP TABLE IF EXISTS Dish ;
DROP TABLE IF EXISTS Booking_has_Tables ;
DROP TABLE IF EXISTS Booking ;
DROP TABLE IF EXISTS Transactions ;
DROP TABLE IF EXISTS Tabless ;
DROP TABLE IF EXISTS Address ;
DROP TABLE IF EXISTS Employee ;
DROP TABLE IF EXISTS Roles ;
DROP TABLE IF EXISTS Customer ;
DROP TABLE IF EXISTS Details ;
-- -----------------------------------------------------
-- Table public.Details : BCNF, fixed
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.Details (
  details_id serial PRIMARY KEY,
  first_name VARCHAR(45) NOT NULL,
  last_name VARCHAR(45) NOT NULL,
  email VARCHAR(225) NOT NULL UNIQUE,
  phone_number VARCHAR(15),
  date_of_birth DATE,
  gender VARCHAR(10) CHECK(gender IN ('other','male','female'))
);

-- -----------------------------------------------------
-- Table public.Customer : BCNF, looks good
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.Customer (
  customer_id INT PRIMARY KEY,
  registered_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  account_status VARCHAR(10) NOT NULL DEFAULT 'active',
  left_on TIMESTAMPTZ,
  CONSTRAINT Customer_Details
    FOREIGN KEY (customer_id)
    REFERENCES public.Details (details_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT Account_Status_Check
    CHECK (account_status IN ('active','inactive','deleted'))
);


-- -----------------------------------------------------
-- Table public.Roles : BCNF, looks good
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.Roles (
  role_id serial PRIMARY KEY,
  role_name VARCHAR(45) NOT NULL,
  supervisor_role INT,
  CONSTRAINT Role_Supervisor
    FOREIGN KEY (supervisor_role)
    REFERENCES public.Roles (role_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- CREATE INDEX Role_Supervisor_idx ON public.Role (supervisor_role ASC) VISIBLE;

-- -----------------------------------------------------
-- Table public.Employee : BCNF, looks good
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.Employee ( -- change this make details as details_id and make p.k remove employee_id
  employee_id  INT PRIMARY KEY,
  joined_on TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  work_status VARCHAR(20) NOT NULL,
  left_on TIMESTAMPTZ , -- change this
  work_type VARCHAR(20) NOT NULL,
  current_wage INT NOT NULL,
  role_id INT NOT NULL,
  CONSTRAINT Employee_Details
    FOREIGN KEY (employee_id)
    REFERENCES public.Details (details_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT Employee_Role
    FOREIGN KEY (role_id)
    REFERENCES public.Roles (role_id)
    ON DELETE SET NULL
    ON UPDATE CASCADE,
  CONSTRAINT Work_Status_Check
    CHECK (work_status IN ('suspended','active','leave','vacation','fired','reserve')),
  CONSTRAINT Work_Type_Check
    CHECK (work_type IN ('permanent','temporary','internship'))
);


-- -----------------------------------------------------
-- Table public.Address : BCNF
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.Address (
  address_id serial PRIMARY KEY,
  house_num VARCHAR(45) NOT NULL,
  region VARCHAR(100) NOT NULL, -- Eg: Colony and Area,etc
  belongs_to INT NOT NULL,
  symbol VARCHAR(45) NOT NULL, -- redundant predifined symbols
  alias VARCHAR(45) NOT NULL,
  primaryCode INT,
  secondaryCode INT,
  CONSTRAINT Address_Details
    FOREIGN KEY (belongs_to)
    REFERENCES public.Details (details_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

CREATE INDEX "Address_Details_idx" ON public.Address USING btree(belongs_to);

-- -----------------------------------------------------
-- Table public.Tabless : BCNF, looks good
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.Tabless (
  table_id serial PRIMARY KEY,
  capacity INT NOT NULL
);
-- -----------------------------------------------------
-- Table public.Transactions : BCNF, looks good
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.Transactions (
  transaction_id serial PRIMARY KEY,
  transaction_description TEXT NOT NULL DEFAULT '',
  start_time TIMESTAMPTZ NOT NULL,
  trans_status VARCHAR(20) NOT NULL,
  cost DOUBLE PRECISION NOT NULL,
  CONSTRAINT Trans_Status_Check
    CHECK (trans_status IN ('failed','pending','successful'))
);

-- -----------------------------------------------------
-- Table public.Booking : BCNF, looks good
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.Booking (
  booking_id serial PRIMARY KEY,
  start_time TIMESTAMPTZ NOT NULL,
  booking_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  customer_id INT NOT NULL,
  CONSTRAINT Booking_Customer
    FOREIGN KEY (customer_id)
    REFERENCES public.Customer (customer_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- CREATE INDEX Booking_Customer_idx ON public.Booking (customer_id ASC) VISIBLE;

-- CREATE INDEX Booking_Transaction_idx ON public.Booking (transaction_id ASC) VISIBLE;

-- -----------------------------------------------------
-- Table public.Booking_has_Tables : BCNF, looks good
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.Booking_has_Tables (
  booking_id INT NOT NULL,
  table_id INT NOT NULL,
  PRIMARY KEY (booking_id, table_id),
  CONSTRAINT Booking_has_Tables_Booking
    FOREIGN KEY (booking_id)
    REFERENCES public.Booking (booking_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT Booking_has_Tables_Tables
    FOREIGN KEY (table_id)
    REFERENCES public.Tabless (table_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE
);

-- CREATE INDEX Booking_has_Tables_Tables_idx ON public.Booking_has_Tables (table_id ASC) VISIBLE;

-- CREATE INDEX Booking_has_Tables_Booking_idx ON public.Booking_has_Tables (booking_id ASC) VISIBLE;

-- -----------------------------------------------------
-- Table public.Dish : BCNF, looks good
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.Dish (
  dish_id serial PRIMARY KEY,
  dish_name VARCHAR(45) NOT NULL,
  cost_per_unit INT NOT NULL,
  --currency VARCHAR(10) NOT NULL, -- Redundancy
  image_url VARCHAR(250) NOT NULL,
  dish_description TEXT NOT NULL,
  dish_availability VARCHAR(20) NOT NULL DEFAULT 'available',
  last_updated TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  nutritional_info TEXT,
  health_info TEXT,
  cusine VARCHAR(45) NOT NULL,
  dish_type VARCHAR(45) NOT NULL,
  sub_type VARCHAR(45) NOT NULL,
  CONSTRAINT Dish_Availability_Check
    CHECK (dish_availability IN ('available','out of stock','unavailable')),
  CONSTRAINT Cusine_Check
    CHECK (cusine IN ('Indian','Italian','American','Fusion')),
  CONSTRAINT Dish_Type_Check
    CHECK (dish_type IN ('Vegetarian','Non Vegetarian','Vegan'))
);

-- -----------------------------------------------------
-- Table public.Ingredients : BCNF, looks good
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.Ingredients (
  ingredient_id serial PRIMARY KEY,
  ingredient_name VARCHAR(45) NOT NULL,
  ingredient_description TEXT NOT NULL,
  image_url VARCHAR(250) NOT NULL,
  unit VARCHAR(45) NOT NULL,
  cost_per_unit DOUBLE PRECISION NOT NULL,
  last_updated TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- -----------------------------------------------------
-- Table public.Dish_has_Ingredients : BCNF, looks good
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.Dish_has_Ingredients (
  dish_id INT NOT NULL,
  ingredient_id INT NOT NULL,
  quantity INT NOT NULL,
  PRIMARY KEY (dish_id, ingredient_id),
  CONSTRAINT Dish_has_Ingredients_Dish
    FOREIGN KEY (dish_id)
    REFERENCES public.Dish (dish_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT Dish_has_Ingredients_Ingredients
    FOREIGN KEY (ingredient_id)
    REFERENCES public.Ingredients (ingredient_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT Quantity_Check
    CHECK (quantity >= 0)
);

CREATE INDEX "Dish_has_Ingredients_Ingredients_idx" ON public.Dish_has_Ingredients USING btree(ingredient_id,dish_id);

-- -----------------------------------------------------
-- Table public.Cart : BCNF, looks good
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.Cart (
  Customer_customer_id INT NOT NULL,
  Dish_dish_id INT NOT NULL,
  Quantity INT NOT NULL,
  PRIMARY KEY (Customer_customer_id, Dish_dish_id),
  CONSTRAINT Customer_has_Dish_Customer
    FOREIGN KEY (Customer_customer_id)
    REFERENCES public.Customer (customer_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT Customer_has_Dish_Dish
    FOREIGN KEY (Dish_dish_id)
    REFERENCES public.Dish (dish_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT Quantity_Check
    CHECK (quantity > 0)
);


-- -----------------------------------------------------
-- Table public.Rates : BCNF, looks good
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.Rates (
  customer_customer_id INT NOT NULL, -- changed name here
  dish_dish_id INT NOT NULL, -- here too
  rating INT,
  review TEXT,
  PRIMARY KEY (customer_customer_id,dish_dish_id),
  CONSTRAINT Customer_has_Dish_Customer
    FOREIGN KEY (customer_customer_id)
    REFERENCES public.Customer (customer_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT Customer_has_Dish_Dish
    FOREIGN KEY (dish_dish_id)
    REFERENCES public.Dish (dish_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT Rating_Check
    CHECK (rating <= 5 OR rating >= 0)
);

CREATE INDEX "Rates_Customer_has_Dish_Dish_idx" ON public.Rates USING btree(dish_dish_id,customer_customer_id);

-- -----------------------------------------------------
-- Table public.Order : BCNF, looks good
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.Orders (
  order_id serial PRIMARY KEY,
  cost INT NOT NULL,
  customer_id INT NOT NULL,
  rating INT NULL,
  review TEXT NULL,
  order_time TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  transaction_id INT NOT NULL,
  CONSTRAINT Order_Customer
    FOREIGN KEY (customer_id)
    REFERENCES public.Customer (customer_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT Order_Transaction
    FOREIGN KEY (transaction_id)
    REFERENCES public.Transactions (transaction_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT Rating_Check
    CHECK (rating <= 5 OR rating >= 0)
);

CREATE INDEX "Order_Customer_idx" ON public.Orders USING btree(customer_id);

-- CREATE INDEX Order_Transaction_idx ON public.Orders (transaction_id ASC) VISIBLE;

-- -----------------------------------------------------
-- Table public.Delivery_Boy : BCNF, looks good
-- specialization of Employee
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.Delivery_Boy (
  boy_status VARCHAR(20) NOT NULL,
  primaryCode INT NOT NULL,
  secondaryCode INT,
  employee_id INT NOT NULL,
  PRIMARY KEY (employee_id),
  CONSTRAINT Delivery_Boy_Employee
    FOREIGN KEY (employee_id)
    REFERENCES public.Employee (employee_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT Boy_Status_Check
    CHECK (boy_status IN ('On delivery','Free'))
);

-- -----------------------------------------------------
-- Table public.Online_order : BCNF, looks good
-- specialization of Orders
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.Online_order (
  order_status VARCHAR(15) NOT NULL,
  order_description TEXT,
  order_id INT NOT NULL,
  delivery_address_id INT NOT NULL,
  delivery_charges INT NOT NULL,
  estimated_time TIMESTAMPTZ ,
  delivery_boy_employee_id INT,
  PRIMARY KEY (order_id),
  CONSTRAINT Online_order_Order
    FOREIGN KEY (order_id)
    REFERENCES public.Orders (order_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT Online_order_Address
    FOREIGN KEY (delivery_address_id)
    REFERENCES public.Address (address_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT Online_order_Delivery_Boy
    FOREIGN KEY (delivery_boy_employee_id)
    REFERENCES public.Delivery_Boy (employee_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT Order_Status_Check
    CHECK (order_status IN ('confirmed','rejected','pending','paid','delivered','on_way'))
);

CREATE INDEX "Online_order_Address_idx" ON public.Online_order USING  btree(delivery_address_id,delivery_boy_employee_id);


-- CREATE INDEX Offline_order_Employee_idx ON public.Offline_order (waiter_employee_id ASC) VISIBLE;

-- -----------------------------------------------------
-- Table public.Order_has_dish : BCNF, looks good
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.Order_has_dish (
  dish_id INT NOT NULL,
  order_id INT NOT NULL,
  servings INT NOT NULL,
  PRIMARY KEY (dish_id, order_id),
  CONSTRAINT Dish_has_Order_Dish
    FOREIGN KEY (dish_id)
    REFERENCES public.Dish (dish_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT Dish_has_Order_Order
    FOREIGN KEY (order_id)
    REFERENCES public.Orders (order_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT Servings_Check
    CHECK (servings > 0)
);

CREATE INDEX "Dish_has_Order_Order_idx" ON public.Order_has_dish USING btree(order_id,dish_id ASC);


-- -----------------------------------------------------
-- Table public.Supply_Order : BCNF, looks good
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS public.Supply_Order (
  ingredient_id INT NOT NULL,
  transaction_id INT NOT NULL,
  comments TEXT NULL,
  quantity INT NOT NULL,
  supplier_name VARCHAR(45) NOT NULL,
  units VARCHAR(45) NOT NULL,
  PRIMARY KEY (ingredient_id, transaction_id),
  CONSTRAINT Ingredients_has_Transaction_Ingredients
    FOREIGN KEY (ingredient_id)
    REFERENCES public.Ingredients (ingredient_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT Ingredients_has_Transaction_Transaction
    FOREIGN KEY (transaction_id)
    REFERENCES public.Transactions (transaction_id)
    ON DELETE CASCADE
    ON UPDATE CASCADE,
  CONSTRAINT Quantity_Check
    CHECK (quantity > 0)
);

-- CREATE INDEX Ingredients_has_Transaction_Transaction_idx ON public.Supply_Order (transaction_id ASC) VISIBLE;

-- CREATE INDEX Ingredients_has_Transaction_Ingredients_idx ON public.Supply_Order (ingredient_id ASC) VISIBLE;
