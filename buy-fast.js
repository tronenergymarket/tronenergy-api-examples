const axios = require('axios');
const TronWeb = require('tronweb');

const TRON_NODE = "https://api.trongrid.io/"; //https://api.nileex.io/ https://api.trongrid.io/
const PRIVATE_KEY = "YOU_PRIVATE_KEY";

const tronWeb =  new TronWeb(
    new TronWeb.providers.HttpProvider( TRON_NODE ),
    new TronWeb.providers.HttpProvider( TRON_NODE ),
    TRON_NODE,
    PRIVATE_KEY //this should match origin address
);
const API_SERVER = "https://api.tronenergy.market"; //http://192.168.1.136:16743 https://api.tronenergy.market
const SERVER_ADDRESS = "TEMkRxLtCCdL4BCwbPXbbNWe4a9gtJ7kq7" //TEMdSN6xEeFBfAK9o81gbqfmVnP6pYkQZc TEMkRxLtCCdL4BCwbPXbbNWe4a9gtJ7kq7
const MARKET = 'Fast';
const ORIGIN = tronWeb.defaultAddress.base58;
const TARGET = "TAtPNH8sNWHJXFaZPAQJu9fMasGZMTnbnj";
const RESOURCE = 0; //0 energy, 1 bandwidth
//suns per day, each duration has it's own price: (check them on https://api.tronenergy.market/info in price > fastEnergy)
//  >= 86400 = 90 sun
//  >= 43200 = 110 sun
//  >= 21600 = 115 sun
//  >= 3600 = 120 sun
const PRICE = 120; 
const AMOUNT = 32000; //energy amount points, min 20000
const DURATION = 3600; //3 days (check them on https://api.tronenergy.market/info in order > fastDurations)
const PAYMENT = parseInt(((PRICE * AMOUNT * (DURATION + (DURATION < 86400) ? 86400 : 0)) / 86400).toFixed(0));//we need to increment 1 day of duration per orders smaller than 24 hours / 86400 seconds
PAYMENT += (AMOUNT * PRICE); // recovery time
const PARTFILL = true; //true for allowing several address to fill your order. if false it will force to only be allowed from 1 address

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
        payment: PAYMENT,
        resource: RESOURCE,
        duration: DURATION,
        price: PRICE,
        partfill: PARTFILL,
        //signed_ms: signed_ms,
        signed_tx: JSON.stringify(signed_tx)
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
        console.log(error.response.data);

    });
}

BuyTest();