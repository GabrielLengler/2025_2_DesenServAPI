<?php
    header( "Content-type: application/json" );
    $local = "localhost" ;
    $user = "root";
    $password = "";
    $banco = "loja_2025_2";

    $conn = mysqli_connect($local, $user, $password, $banco);
    if ( $conn ){
        $query = "SELECT * FROM produto ORDER BY nome";
        $result = mysqli_query($conn, $query);
        $linhas = array();
        while( $row = mysqli_fetch_assoc($result) ){
            $linhas[] = $row;
        }
        echo '{ "produtos" : '.json_encode($linhas).' }';
    }