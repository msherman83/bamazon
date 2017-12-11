// TO DO
//prompt 
// The first should ask them the ID of the product they would like to buy.
// The second message should ask how many units of the product they would like to buy.




var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Qwerty_123",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

    initialInventory()
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

        buyPrompt();
    });
}



// GETTING UNDEFINED WHEN ENTERING NUMBER FOR FIRST PROMPT
//  Also tried removing the if statement for isNaN and entering a string and still getting undefined.

function buyPrompt() {
    inquirer
        .prompt({
            name: "id",
            type: "input",
            message: "What is the ID of a product you would like to bid on?",
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

        })
        .then(function (answer) {
            var query = "SELECT id FROM products";
            connection.query(query, [answer.id, answer.units], function (err, res) {

                console.log(res);


            });
        });
}
