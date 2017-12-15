// TO DO
//prompt 
// ORDER
// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.

// Check if there is enough stock.  If not display message that there isnt enough stock and restart app.
// If there is enough stock it should subtract from the stock and display order total.




var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

    initialInventory();
});



function initialInventory() {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        console.log("Welcome to Bamazon!  Where everything is for sale! Even the children.\n")
        console.log("=====================================================================")
        console.log("========================= Current Inventory =========================")
        console.log("=====================================================================\n")
        console.log("ID  |   Product Name   |   Department   |   Price   |   In Stock\n")

        for (var i = 0; i < res.length; i++) {
            console.log(res[i].item_id + " | " + res[i].product_name + " | " + res[i].department_name + " | " + res[i].price + " | " + res[i].stock_quantity);
        }
        console.log("=====================================================================")
        console.log("=====================================================================")

        buyPrompt();
    });
}



function buyPrompt() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
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
                // When i select an ID and product.  Its taking the correct ID and converting it to whatever the NEXT IDs product quantity is, subtracting the number of units to buy and putting it in the place of the actual ID you selected.


                var chosenItem = parseInt(answer.itemNum); // tried to do a - 1 here but it didnt work.
                var product = results[chosenItem]; // What is product pulling its number from?
                var chosenUnits = parseInt(answer.units);
                
                // console.log hell
                console.log("chosenItem - " + chosenItem + " type of " + typeof chosenItem);
                console.log("product - " + product.stock_quantity + " type of " + typeof product.stock_quantity);
                console.log("chosenUnits - " + chosenUnits + " type of " + typeof chosenUnits)
                console.log(chosenUnits <= product.stock_quantity);

                // var updatedProduct = product - 1;

                var updatedStock = product.stock_quantity - chosenUnits;
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

                    console.log("===== Receipt of Purchase =====");
                    console.log("Quantity: " + chosenUnits + " | Total Cost: " + product.price * chosenUnits)
                
                    initialInventory();

                } else {
                    console.log("Not enough inventory!  Please order again.")
                    initialInventory();
                } 
            });
    })
}



