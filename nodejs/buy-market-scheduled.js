require('dotenv').config(); //to load .env file : rename .env.example to .env and put there your PK to test.

const axios = require('axios');
const TronWeb = require('tronweb');

const TRON_NODE = process.env.TRON_NODE; //https://api.nileex.io/ https://api.trongrid.io/
const PRIVATE_KEY = process.env.PRIVATE_KEY;

const tronWeb =  new TronWeb(
    new TronWeb.providers.HttpProvider( TRON_NODE ),
    new TronWeb.providers.HttpProvider( TRON_NODE ),
    TRON_NODE,
    PRIVATE_KEY //this should match origin address
);

const API_SERVER = process.env.API_SERVER;
const SERVER_ADDRESS = process.env.SERVER_ADDRESS;
const MARKET = 'Open';
const ORIGIN = tronWeb.defaultAddress.base58;
const TARGET = "TXyYbRRkixvU3YYDvmt4seDRNv2ErqPLV1";
const RESOURCE = 0; //0 energy, 1 bandwidth
const PRICE = 50; //suns per day, whatever price you want
const AMOUNT = 20000; //energy amount points, min 100000
const DURATION = 300; //300 = 5 minutes (check them on https://api.tronenergy.market/info in order > openDurations)
//This parameter is not needed anymore if you are using api_key or signed_ms
const PAYMENT = parseInt(((PRICE * AMOUNT * (DURATION + ((DURATION < 86400) ? 86400 : 0))) / 86400).toFixed(0));//we need to increment 1 day of duration per orders smaller than 24 hours / 86400 seconds
const PARTFILL = true; //true for allowing several address to fill your order. if false it will force to only be allowed from 1 address
const SCHEDULED = (new Date(Date.now() + 86400000)).toISOString();//example "2025-11-12T23:00:00.000Z"
const signed_ms = undefined;//not used right now, only for credits

async function BuyTest()
{
    //we sign the tx
    const raw_tx  = await tronWeb.transactionBuilder.sendTrx(SERVER_ADDRESS, PAYMENT , ORIGIN);
    const signed_tx = await tronWeb.trx.sign( raw_tx );

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
        scheduled: SCHEDULED,
        signed_ms: signed_ms,
        signed_tx: JSON.stringify(signed_tx),
    }

    const POST_URL = `${API_SERVER}/order/new`;
    axios.post(POST_URL, params,)
    .then((res)=>
    {
        console.log("all ok, at least some orders were created");
        console.log(res.data); //order created response in res.data { order: [1644], target:["TAtPNH8sNWHJXFaZPAQJu9fMasGZMTnbnj"], errors:["TAtPNH8sNWHJXFaZPAQJu9fMasGZMTnbnj"] }
    })
    .catch((error) =>
    {
        console.error("woops, something wrong happened!");
        console.error(error.response.data);
    });
}

BuyTest();