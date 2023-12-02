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
const ORIGIN = tronWeb.defaultAddress.base58; //sender of the TRX to add the credit.
const ADDRESS = "TAtPNH8sNWHJXFaZPAQJu9fMasGZMTnbnj"; //destiny of the credit, it can be the same or other address.
const AMOUNT = 10000000; //amount of TRX to load as credit in sun. Here 20k TRX. Min amount 10 TRX == 10000000

async function DepositCreditTest()
{
    //we sign the tx
    const raw_tx  = await tronWeb.transactionBuilder.sendTrx(SERVER_ADDRESS, AMOUNT , ORIGIN);
    const signed_tx = await tronWeb.trx.sign( raw_tx );

    //we send the order
    let params = 
    {
        address: ADDRESS,
        signed_tx: JSON.stringify(signed_tx)
    }

    const POST_URL = `${API_SERVER}/credit/deposit`;
    axios.post(POST_URL, params,)
    .then(()=>
    {
        console.log("all ok, credit deposited");
    })
    .catch((error) =>
    {
        console.error("woops, something wrong happened!");
        console.error(error);
    });
}

DepositCreditTest();