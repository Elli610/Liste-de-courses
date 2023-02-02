

if(!localStorage["courses"]){
    localStorage["courses"] = JSON.stringify([]);
}
if(!localStorage["deletedItems"]){
    localStorage["deletedItems"] = JSON.stringify([]);
}
$url = "http://89.58.41.130/liste_de_courses/"; //"http://localhost/advanced_web_dev/TD2/";
// add a synchronisation button that connect to the server and sync the shopping list
var buttonSync = document.createElement("button");
buttonSync.innerHTML = "Synchroniser";
document.body.appendChild(buttonSync);
buttonSync.onclick = function(){
    synchoniser();
};
var serverShoppingList = "";

function synchoniser(){
    var savedShoppingList = localStorage["courses"];
    // 0. envoyer la liste des suppressions au serveur
    // 1. récuperer la liste des courses du serveur php 
    // 2. comparer avec la liste locale et extraire les différences ( quantité, ajout, suppression )
    // 3. envoyer les modificatiosn au serveur
    
    // 0.
    if(localStorage["deletedItems"] != "[]" && localStorage["deletedItems"] != ""){
        var deletedItem = localStorage["deletedItems"];
        var del = JSON.parse(deletedItem);
        var elems = "";
        for(var i = 0; i < del.length-1; i++){
            elems += del[i].name + ",";
        }
        if(del.length > 0){
            elems += del[del.length-1];
        }
        
        var xhr = new XMLHttpRequest();
        xhr.open('GET', $url + "server.php?mode=3&item=" + elems, true);
        xhr.responseType = 'text';
        xhr.onload = function () {
            if (xhr.readyState === xhr.DONE) {
                if (xhr.status === 200) {
                    console.log("deletedItems sent");
                }
            }
        };
        xhr.send();
        // empty the deleted items list
        localStorage["deletedItems"] = [];
    }

    // 1.
    var xhr = new XMLHttpRequest();
    xhr.open('GET', $url + 'server.php?mode=1', true);

    // If specified, responseType must be empty string or "text"
    xhr.responseType = 'text';

    xhr.onload = function () {
        if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
                var serverShoppingList = JSON.parse(xhr.responseText);
                var shoppingList = JSON.parse(savedShoppingList);
                // 2.
                if(serverShoppingList['status'] == 'ok'){
                    //console.log("server shopping list : ", serverShoppingList);
                    serverList = serverShoppingList['courses'];
                    // compare all the items in the server list with the local list
                    for(var i = 0; i < serverList.length; i++){
                        var found = false;
                        for(var j = 0; j < shoppingList.length; j++){// if the item is in the server list : compare the quantity
                            if(serverList[i]['name'] == shoppingList[j]['name']){
                                found = true;
                                // if the quantity is different, update the server list. If the quantity is the same, do nothing
                                if(serverList[i]['quantity'] != shoppingList[j]['quantity']){
                                    // check the higher timestamp
                                    if(serverList[i]['timestamp'] > shoppingList[j]['timestamp']){
                                        // update the local list
                                        shoppingList[j]['quantity'] = serverList[i]['quantity'];
                                        shoppingList[j]['timestamp'] = serverList[i]['timestamp'];
                                        localStorage["courses"] = JSON.stringify(shoppingList);
                                    }
                                    else{
                                        // update the server list
                                        var request = new XMLHttpRequest();
                                        //console.log($url + "server.php?mode=2&item=" + shoppingList[j].name + "&quantity=" + shoppingList[j].quantity);
                                        request.open("GET", $url + "server.php?mode=2&item=" + shoppingList[j].name + "&quantity=" + shoppingList[j].quantity, true);
                                        request.send();
                                        request.onload = function() {
                                            //console.log(request.responseText)
                                        }
                                    }
                                }
                            }        
                        } 
                        // if the item is not in the server list : add it
                        if(!found){
                            // add the item to the local list
                            shoppingList.push(serverList[i]);
                            console.log("local list updated : item added : " + serverList[i]);
                        }
                        // reload the page
                        //window.location.reload();               
                    }
                    // check if there are items in local storage that are not in the server list
                    for(var i = 0; i < shoppingList.length; i++){
                        var found = false;
                        for(var j = 0; j < serverList.length; j++){
                            if(shoppingList[i]['name'] == serverList[j]['name']){
                                found = true;
                            }
                        }
                        if(!found){
                            // add the item to the server list
                            var request = new XMLHttpRequest();
                            request.open("GET", $url + "server.php?mode=2&item=" + shoppingList[i].name + "&quantity=" + shoppingList[i].quantity, true);
                            request.send();
                            request.onload = function() {
                                //console.log(request.responseText)
                            }
                        }
                    }
                }
                else{
                    console.log("error while getting the shopping list from the server")
                }
                // save the shopping list in the local storage
                localStorage["courses"] = JSON.stringify(shoppingList);
            }
        }
        // refresh the page
        //location.reload();
    };

    xhr.send(null);
}