require('dotenv').config(); //to load .env file : rename .env.example to .env and put there your PK to test.

const axios = require('axios');
const TronWeb = require('tronweb');

const TRON_NODE = process.env.TRON_NODE; //https://api.nileex.io https://api.trongrid.io/
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const tronWeb =  new TronWeb(
    new TronWeb.providers.HttpProvider( TRON_NODE ),
    new TronWeb.providers.HttpProvider( TRON_NODE ),
    TRON_NODE,
    PRIVATE_KEY //this should match origin address
);

const API_SERVER = process.env.API_SERVER;
const MARKET = 'Open';
const ORIGIN = tronWeb.defaultAddress.base58;
const TARGET = "TAtPNH8sNWHJXFaZPAQJu9fMasGZMTnbnj";
const RESOURCE = 0; //0 energy, 1 bandwidth
const PRICE = 50; //suns per day, whatever price you want
const AMOUNT = 65000; //energy amount points, min 100000
const DURATION = 300; //Duration in seconds. 300 (5 minutes), 600, 900, 1800, ... 2590000 (30 days)

//This parameter is not needed anymore if you are using api_key or signed_ms
const PAYMENT = parseInt(((PRICE * AMOUNT * (DURATION + ((DURATION < 86400) ? 86400 : 0))) / 86400).toFixed(0));//we need to increment 1 day of duration per orders smaller than 24 hours / 86400 seconds

const PARTFILL = true; //true for allowing several address to fill your order. if false it will force to only be allowed from 1 address
const BULK = false; //true for creating several orders at once with the same energy, for this working target must be an array of address and payment must be the total of the orders.

async function BuyTest()
{
    
    const message = (new Date()).getTime().toString();
    const signed_ms = 
    {
        message: message,
        signature: await tronWeb.trx.signMessageV2(tronWeb.toHex(message)),
        version: 2
    };;//buy only with credits
    //we send the order
    let params = 
    {
        market: MARKET,
        address: ORIGIN,
        target: TARGET,
        amount: AMOUNT,
        resource: RESOURCE,
        duration: DURATION,
        price: PRICE,
        partfill: PARTFILL,
        bulk: BULK,
        signed_ms: signed_ms,
        signed_tx: undefined
    }

    const POST_URL = `${API_SERVER}/order/new`;
    axios.post(POST_URL, params,)
    .then((res)=>
    {
        console.log("all ok, order created");
        console.log(res.data); //order created response in res.data { order: 1644 }
    })
    .catch((error) =>
    {
        console.error("woops, something wrong happened!");
    });
}

BuyTest();