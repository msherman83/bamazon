var inquirer = require('inquirer');
var mysql = require('mysql');

var connection = mysql.createConnection({
    host: "localhost", port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Qwerty_123",
    database: "bamazon"
});


displayProducts();

inquirer.prompt([
    {
        type: "input",
        name: "id",
        message: "What is the ID of the product you would like to purchase?"
    },
    {
        type: "input",
        name: "amount",
        message: "How many would you like to purchase?"
    }
]).then(function (response) { // when promise executes
    console.log(response.id);
    console.log(response.amount);
    checkQuantity(response.id, response.amount);
});





function displayProducts() {
    var query = connection.query("SELECT * FROM products", function (err, res) {
        console.log('----------------------------')
        for (var i = 0; i < res.length; i++) {
            console.log('Item ID: ' + res[i].item_id);
            console.log('Product Name: ' + res[i].product_name);
            console.log('Department: ' + res[i].department_name);
            console.log('Price: ' + res[i].price);
            console.log('----------------------------')
        }
    });
}


function checkQuantity(product_id, desired_quantity) {
    var query = connection.query("SELECT * FROM products WHERE ?", [
        {item_id: product_id}
    ], function (err, res) {
        if (err)
            throw err;
        var currentInventory = res.stock_quantity;
        if (desired_quantity > currentInventory) {
            console.log('Insufficient Inventory');
        } else {
            var updatedInventory = currentInventory - desired_quantity;            
            //update db with quantity subtracted and calculate price and console to customer   
            var query = connection.query("UPDATE products SET ? WHERE ?", [
                {stock_quantity: updatedInventory},
                {item_id: product_id}
            ], function (err, res) {
                if (err)
                    throw err;
                console.log('Working');
            });

        }
    });
}





