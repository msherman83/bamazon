DROP DATABASE IF EXISTS bamazon;
CREATE database bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  price DECIMAL(19,4) NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY (item_id)
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("Ethernet Cable", "Networking", 10.99, 8),
("4 Port USB Hub", "Accessories", 14.99, 11),
("16 Port Ethernet Switch", "Networking", 205.99, 6),
("8 Port Ethernet Switch", "Networking", 105.99, 9),
("DDR4 RAM - 16 Gigs", "Computer Parts", 199.99, 7),
("2TB 7200RPM Hard Disk Drive", "Computer Parts", 110.99, 9),
("6TB 7200RPM Hard Disk Drive", "Computer Parts", 355.99, 4),
("Light Bulb", "Electrical", 5.99, 24),
("Pack of cool stickers", "Random", 2.99, 14),
("Castlevania - Symphony of the Night - PS1", "Video Games", 59.99, 2)

