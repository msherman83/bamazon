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
    password: "Qwerty_123",
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

                var chosenItem = parseInt(answer.itemNum) - 1;
                var product = results[chosenItem];
                var chosenUnits = parseInt(answer.units);
                console.log("product - " + product.stock_quantity + " type of " + typeof product.stock_quantity);
                console.log("chosenItem - " + chosenItem + " type of " + typeof chosenItem);
                console.log("chosenUnits - " + chosenUnits + " type of " + typeof chosenUnits)
                console.log(chosenUnits <= product.stock_quantity);

                var updatedStock = product.stock_quantity - chosenUnits;
                if (chosenUnits > product.stock_quanity) {

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
                
                    process.exit();

                // } else {
                //     console.log("try again")
                //     connection.end(); 
                } 
            });
    })
}



// function buyPrompt() {
//     // query the database for all items being auctioned
//     connection.query("SELECT * FROM products", function(err, results) {
//       if (err) throw err;
//       // once you have the items, prompt the user for which they'd like to bid on
//       inquirer
//         .prompt([
//           {
//             name: "choice",
//             type: "rawlist",
//             choices: function() {
//               var choiceArray = [];
//               for (var i = 0; i < results.length; i++) {
//                 choiceArray.push(results[i].item_id);
//               }
//               return choiceArray;
//             },
//             message: "What is the product ID of the item you would like to buy?"
//           },
//           {
//             name: "bid",
//             type: "input",
//             message: "How many would you like to buy?"
//           }
//         ])
//         .then(function(answer) {
//           // get the information of the chosen item
//           var chosenItem;
//           for (var i = 0; i < results.length; i++) {
//             if (results[i].item_id === answer.choice) {
//               chosenItem = results[i];
//             }
//           }

//           // determine if bid was high enough
//           if (chosenItem.stock_quantity - parseInt(answer.bid) < 0) {
//             // bid was high enough, so update db, let the user know, and start over
//             connection.query(
//               "UPDATE products SET ? WHERE ?",
//               [
//                 {
//                   stock_quantity: answer.bid
//                 },
//                 {
//                   item_id: chosenItem.id
//                 }
//               ],
//               function(error) {
//                 if (error) throw err;
//                 console.log("Bid placed successfully!");
//                 initialInventory();
//               }
//             );
//           }
//           else {
//             // bid wasn't high enough, so apologize and start over
//             console.log("Your bid was too low. Try again...");
//             initialInventory();
//           }
//         });
//     });
//   })
