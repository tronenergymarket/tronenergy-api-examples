const axios = require('axios');
const TronWeb = require('tronweb');

const TRON_NODE = "https://api.trongrid.io/"; //https://api.nileex.io https://api.trongrid.io/
const PRIVATE_KEY = "YOUR_PRIVATE_KEY";

const tronWeb =  new TronWeb(
    new TronWeb.providers.HttpProvider( TRON_NODE ),
    new TronWeb.providers.HttpProvider( TRON_NODE ),
    TRON_NODE,
    PRIVATE_KEY //this should match origin address
);

const API_SERVER = "https://api.tronenergy.market";
const SERVER_ADDRESS = "TEMkRxLtCCdL4BCwbPXbbNWe4a9gtJ7kq7"
const MARKET = 'Open';
const ORIGIN = tronWeb.defaultAddress.base58;
const TARGET = "TAtPNH8sNWHJXFaZPAQJu9fMasGZMTnbnj";
const RESOURCE = 0; //0 energy, 1 bandwidth
const PRICE = 50; //suns per day, whatever price you want
const AMOUNT = 20000; //energy amount points, min 100000
const DURATION = 259200; //3 days (check them on https://api.tronenergy.market/info in order > openDurations)
const PAYMENT = parseInt(((PRICE * AMOUNT * DURATION) / 86400).toFixed(0));
const PARTFILL = true; //true for allowing several address to fill your order. if false it will force to only be allowed from 1 address

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
        payment: PAYMENT,
        resource: RESOURCE,
        duration: DURATION,
        price: PRICE,
        partfill: PARTFILL,
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
        console.error(error);
    });
}

BuyTest();