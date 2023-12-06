const axios = require('axios');

const TRON_NODE = "https://api.trongrid.io/"; //https://api.nileex.io https://api.trongrid.io/
const API_KEY = "YOUR_API_KEY"; //to obtain firstly an api-key it must be manually added. After it you can create a new one in case of leak using /apiley/new like shown in postman https://www.postman.com/tronenergy/workspace/tron-energy-market/collection/26095185-f45ab499-afda-4575-bb06-1162fdb453fd?ctx=documentation

const API_SERVER = "https://api.tronenergy.market";
const SERVER_ADDRESS = "TEMkRxLtCCdL4BCwbPXbbNWe4a9gtJ7kq7"
const MARKET = 'Open';
const ORIGIN = "YOUR_OWN_ADDRESS";
const TARGET = "TAtPNH8sNWHJXFaZPAQJu9fMasGZMTnbnj";
const RESOURCE = 0; //0 energy, 1 bandwidth
//suns per day, each duration has it's own price: (check them on https://api.tronenergy.market/info in price > fastEnergy)
//  >= 86400 = 70 sun
//  >= 259200 = 35 sun
const PRICE = 50; //suns per day, whatever price you want
const AMOUNT = 20000; //energy amount points, min 100000
const DURATION = 259200; //3 days (check them on https://api.tronenergy.market/info in order > openDurations)
const PAYMENT = parseInt(((PRICE * AMOUNT * DURATION) / 86400).toFixed(0));
const PARTFILL = true; //true for allowing several address to fill your order. if false it will force to only be allowed from 1 address
const BULK = false; //true for creating several orders at once with the same energy, for this working target must be an array of address and payment must be the total of the orders.

async function BuyTest()
{
    //no need for signature, only api-key

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
        bulk: BULK,
        signed_ms: undefined,
        signed_tx: undefined,
        api_key: API_KEY
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