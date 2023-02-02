<?php
    // get the arguments in the url
    $args = $_SERVER['QUERY_STRING'];
    header("Access-Control-Allow-Origin: *");
    $db = new SQLite3('C:\Users\hervi\Documents\Cours ESILV\Advanced web dev\Liste de courses\liste.db'); // 
    // get the first 6 characters of the arguments
    $arg = substr($args, 0, 6);
    if ($arg == 'mode=1') { // if the arguments are mode=1 : send the course list
        // get the list from db
        $results = $db->query('SELECT * FROM liste');
        
        $courses = array();
        while ($row = $results->fetchArray()) {
            $courses[] = array('id' => $row['id'], 'name' => $row['name'], 'quantity' => $row['quantity'], 'timestamp' => $row['timestamp']);
        }
        // add status element to the json
        $out = array('status' => 'ok', 'courses' => $courses);
        // send the list
        echo json_encode($out);
    } else if ($arg == 'mode=2') { // if the arguments are mode=2 : add a course to the list
        // get the name and the quantity of the course
        if(isset($_GET['item']) && isset($_GET['quantity'])&&$_GET['quantity']!="undefined"&&$_GET['quantity']!=""&&$_GET['item']!="undefined"&&$_GET['item']!=""){
            $name = $_GET['item'];
            $quantity = $_GET['quantity'];
               // check if the course already exists
            $results = $db->query("SELECT * FROM liste WHERE name = '$name'");
            $row = $results->fetchArray();
            if ($row) { // if the course already exists
                // update the quantity of the course
                $query = "UPDATE liste SET quantity = '$quantity' WHERE liste.name = '$name'";
                $result = $db->exec($query);
                if(!$result){
                    echo $db->lastErrorMsg();
                }
                // add status element to the json
                $out = array('status' => 'ok');
                // send the status
                echo json_encode($out);
            }
            else{
                $time = time();
                // add the course to the db
                $db->exec("INSERT INTO liste (name, quantity, timestamp) VALUES ('$name', '$quantity', $time)");
                // add status element to the json
                $out = array('status' => 'ok');
                // send the status
                echo json_encode($out);
            }
        }
        else
        {
            echo json_encode(array('status' => 'ok'));
        }
    } else if ($arg == 'mode=3') { // if the arguments are mode=3 : delete an item from the list
        // get the id of the course
        if(isset($_GET['item'])){
            $nameList = $_GET['item'];
            $array = explode('","', $nameList);
            for ($i = 0; $i < count($array); $i++) {
                $name = $array[$i];
                echo $name;
                // delete the course from the db
                $db->exec("DELETE FROM liste WHERE liste.name = '$name'");
            }
            $out = array('status' => 'ok');
            // send the status
            echo json_encode($out);
        }      
        else
        {
            echo json_encode(array('status' => 'error'));
        }
    }
    $db->close();
    unset($db);
?>

