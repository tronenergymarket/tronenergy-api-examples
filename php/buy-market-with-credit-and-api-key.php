<?php

require 'vendor/autoload.php'; // Make sure you have the GuzzleHTTP library installed via Composer

$dotenv = Dotenv\Dotenv::createUnsafeImmutable('./');
$dotenv->load();

$TRON_NODE = getenv("TRON_NODE");// "https://api.trongrid.io/"
$API_KEY = getenv("API_KEY"); // Retrieve the API key from environment variable
$API_SERVER = getenv("API_SERVER"); //"https://api.tronenergy.market"
$SERVER_ADDRESS = "TEMkRxLtCCdL4BCwbPXbbNWe4a9gtJ7kq7";
$MARKET = 'Open';
$ORIGIN = getenv("ADDRESS");
$TARGET = "TAtPNH8sNWHJXFaZPAQJu9fMasGZMTnbnj";
$RESOURCE = 0;
$PRICE = 50;
$AMOUNT = 20000;
$DURATION = 259200;
$PAYMENT = intval((($PRICE * $AMOUNT * ($DURATION + ($DURATION < 86400 ? 86400 : 0))) / 86400));
$PARTFILL = true;
$BULK = false;

use GuzzleHttp\Client;

function BuyTest() {
    global $MARKET, $ORIGIN, $TARGET, $PAYMENT, $RESOURCE, $DURATION, $PRICE, $PARTFILL, $BULK, $API_KEY, $API_SERVER;

    // Create a Guzzle HTTP client
    $client = new Client([
        'verify' => false,
        'headers' => [ 'Content-Type' => 'application/json' ]
    ]);

    // Define the request parameters
    $params =
    [
        'market' => $MARKET,
        'address' => $ORIGIN,
        'target' => $TARGET,
        'amount' => $AMOUNT,
        'resource' => $RESOURCE,
        'duration' => $DURATION,
        'price' => $PRICE,
        'partfill' => $PARTFILL,
        'bulk' => $BULK,
        'signed_ms' => null,
        'signed_tx' => null,
        'api_key' => $API_KEY,
    ];

    // Define the POST URL
    $POST_URL = $API_SERVER . "/order/new";

    // Send the order using Guzzle HTTP
    try
    {
        $response = $client->post($POST_URL,
        [
            'body' => json_encode($params)
        ]);

        // Check if the request was successful
        if ($response->getStatusCode() == 200)
        {
            $responseData = json_decode($response->getBody(), true);
            echo "all ok, order created\n";
            echo "Order ID: " . $responseData['order'] . "\n";
        }
        else
        {
            echo "Request failed with status code: " . $response->getStatusCode() . "\n";
        }
    }
    catch (Exception $e)
    {
        echo "woops, something wrong happened!\n";
        echo $e->getResponse()->getBody()->getContents() . "\n";
    }
}

BuyTest();
?>