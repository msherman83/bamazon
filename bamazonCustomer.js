// Required files
var mysql = require("mysql");
var inquirer = require("inquirer");

// Create the SQL DB connection to Bamazon.
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Qwerty_123",
    database: "bamazon"
});

// Connect to the server and run the initialInventory() function.
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

    initialInventory();
});


// Display all products and current inventory.
function initialInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        console.log("Welcome to Bamazon!  Where everything is for sale! Even the children.\n")
        console.log("=====================================================================")
        console.log("========================= Current Inventory =========================")
        console.log("=====================================================================\n")
        console.log("ID  |   Product Name   |   Department   |   Price   |   In Stock\n")

        // Loop through the products in the DB and display them on screen.
        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("\n=====================================================================")
        console.log("=====================================================================\n\n")

        // Intialize buyPrompt() function.
        buyPrompt();
    });
}



function buyPrompt() {
    // Queries the products table of the DB.
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        // Inquirer prompts to ask what product they would like to buy and how many units of that product.
        inquirer
            .prompt([
                {
                    name: "itemNum",
                    type: "input",
                    message: "What is the ID of a product you would like to buy?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                },
                {
                    name: "units",
                    type: "input",
                    message: "How many units would you like to buy?",
                    validate: function (value) {
                        if (isNaN(value) === false) {
                            return true;
                        }
                        return false;
                    }
                }
            ])
            .then(function (answer) {

                // Turn the inquirer queries and results of the DB query into variables.
                var chosenItem = parseInt(answer.itemNum);
                var product = results[chosenItem - 1]; // <---- Justin is my hero. Stupid "- 1" INSIDE the brackets.
                var chosenUnits = parseInt(answer.units);
                
                // console.log hell for testing.
                // ====================================================================================
                // console.log("chosenItem - " + chosenItem + " type of " + typeof chosenItem);
                // console.log("product - " + product.stock_quantity + " type of " + typeof product.stock_quantity);
                // console.log("chosenUnits - " + chosenUnits + " type of " + typeof chosenUnits)
                // console.log(chosenUnits <= product.stock_quantity);
                // ====================================================================================

                // Subtrack chosen units from the actual stock quantity and store into a variable.
                var updatedStock = product.stock_quantity - chosenUnits;

                // Decide if there is enough inventory in stock.
                // If there is update stock levels and print out a receipt for the customer.
                // If not let them know there isn't enough inventory and they need to try to order again.
                if (chosenUnits <= product.stock_quantity) {

                    connection.query(
                        "UPDATE products SET ? WHERE ?",
                        [
                            {
                                stock_quantity: updatedStock
                            },
                            {
                                item_id: chosenItem
                            }
                        ]
                    );

                    console.log("\nThank you for your purchase!  Please come again.\n")
                    console.log("===== Receipt of Purchase =====\n");
                    console.log("Quantity: " + chosenUnits + " | " + "Product Name: " + product.product_name + " | " + " Total Cost: " + "$" + product.price * chosenUnits)
                    console.log("\n===============================");
                    console.log("===============================\n\n");
                
                    // Loop back to initial inventory screen.
                    initialInventory();

                } else {
                    console.log("Not enough inventory!  Please order again.")

                    // Loop back to initial inventory screen.
                    initialInventory();
                } 
            });
    })
}



