        if(!localStorage["courses"]){
            localStorage["courses"] = JSON.stringify([]);
        }
        if(!localStorage["deletedItems"]){
            localStorage["deletedItems"] = JSON.stringify([]);
        }
        // champs de saisie et bouton ajouter un element
        var input = document.createElement("input");
        input.type = "text";
        input.id = "course";
        var inputQty = document.createElement("input");
        inputQty.type = "text";
        inputQty.id = "qty";
        inputQty.value = "1";
        document.body.appendChild(input);
        document.body.appendChild(inputQty);
        var button = document.createElement("button");
        button.innerHTML = "Ajouter un élément";
        document.body.appendChild(button);
        // on click on the button, we add an element to the list
        button.onclick = function() {
            var savedShoppingList = localStorage["courses"];
            // Parse the JSON string into an object
            if(savedShoppingList){
                var shoppingList = JSON.parse(savedShoppingList);
            }
            else{
                var shoppingList = [];
            }

            console.log(shoppingList);
            // add the new item to the shopping list if it is not already
            var found = false;
            for (var i = 0; i < shoppingList.length; i++) {
                console.log(shoppingList[i].name, input.value);
                if (shoppingList[i].name == input.value) {
                    found = true;
                    break;
                }
            }
            if(!found){
                var name = input.value;
                var quantity = inputQty.value;
                shoppingList.push({name, quantity});
                console.log("shoppingList", shoppingList);
                // save the shopping list in the local storage
                localStorage["courses"] = JSON.stringify(shoppingList);
                // clear the input
                input.value = "";
                inputQty.value = "1";
                // refresh the page
                location.reload();
            } else{
                alert("Cet élément est déjà dans la liste");
            }
        }
        // check if there are some items in the local storage
        // if yes, display them wity their quantity
        // if no, display a message
        var savedShoppingList = localStorage["courses"];
        if (savedShoppingList != "[]") {
            // Parse the JSON string into an object
            const shoppingList = JSON.parse(savedShoppingList);
            // display the list with a button to edit the quantity
            var ul = document.createElement("ul");
            for (var i = 0; i < shoppingList.length; i++) {
                var li = document.createElement("li");
                li.innerHTML = shoppingList[i].name + " - " + shoppingList[i].quantity + " " + " <button onclick='editQty(" + i + ")'>Modifier la quantité</button>";

                ul.appendChild(li);
            }
            document.body.appendChild(ul);
        }
        else {  
            var p = document.createElement("p");
            p.innerHTML = "Votre liste est vide";
            document.body.appendChild(p);
        }

        // function to edit the quantity of an item
        function editQty(i) {
            var savedShoppingList = localStorage["courses"];
            // Parse the JSON string into an object
            var shoppingList = JSON.parse(savedShoppingList);
            // ask the new quantity
            var newQty = prompt("Nouvelle quantité");
            // update the quantity
            if(newQty == 0){
                // add the deleted item to the deleted items list
                var savedDeletedItems = localStorage["deletedItems"];
                if(savedDeletedItems){
                    var deletedItems = JSON.parse(savedDeletedItems);
                }
                else{
                    var deletedItems = [];
                }
                console.log("deletedItems", deletedItems);
                deletedItems.push(shoppingList[i]['name']);
                // save the deleted items in the local storage
                localStorage["deletedItems"] = JSON.stringify(deletedItems);
                // delete from the shopping list
                shoppingList.splice(i, 1);
            }
            else{
                shoppingList[i].quantity = newQty;
            }
            // save the shopping list in the local storage
            localStorage["courses"] = JSON.stringify(shoppingList);
            // refresh the page
            location.reload();
        }

        
    