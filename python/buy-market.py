import os
import json
import requests

# Load environment variables
from dotenv import load_dotenv
load_dotenv()

from tronpy import Tron
from tronpy.providers import HTTPProvider
from tronpy.keys import PrivateKey

TRON_NODE = os.getenv("TRON_NODE")  # "https://api.trongrid.io/"
API_SERVER = os.getenv("API_SERVER")  # "https://api.tronenergy.market"
PRIVATE_KEY = os.getenv("PRIVATE_KEY")
SERVER_ADDRESS = "TEMkRxLtCCdL4BCwbPXbbNWe4a9gtJ7kq7"
MARKET = 'Open'
ORIGIN = os.getenv("ADDRESS")
TARGET = "TAtPNH8sNWHJXFaZPAQJu9fMasGZMTnbnj"
RESOURCE = 0
PRICE = 50
AMOUNT = 20000
DURATION = 300
PAYMENT = int(((PRICE * AMOUNT * (DURATION + (86400 if DURATION < 86400 else 0))) / 86400))
PARTFILL = True
BULK = False

def buy_test():
    global MARKET, ORIGIN, TARGET, PAYMENT, RESOURCE, DURATION, PRICE, PARTFILL, BULK, API_KEY, API_SERVER, PRIVATE_KEY

    tron = Tron(provider=HTTPProvider(TRON_NODE))

    # we sign the tx
    signed_tx = tron.trx.transfer(ORIGIN, SERVER_ADDRESS, PAYMENT).build().sign(PrivateKey(bytes.fromhex(PRIVATE_KEY))).to_json()

    # Define the request parameters
    params = {
        'market': MARKET,
        'address': ORIGIN,
        'target': TARGET,
        'amount': AMOUNT,
        'resource': RESOURCE,
        'duration': DURATION,
        'price': PRICE,
        'partfill': PARTFILL,
        'bulk': BULK,
        'signed_ms': None,
        'signed_tx': json.dumps(signed_tx),
        'api_key': None
    }

    # Define the POST URL
    post_url = f"{API_SERVER}/order/new"

    # Send the order using requests library
    try:
        response = requests.post(post_url, json=params)

        # Check if the request was successful
        if response.status_code == 200:
            response_data = response.json()
            print("All OK, order created")
            print("Order ID:", response_data['order'])
        else:
            print("Request failed with status code:", response.status_code)
            if response.headers.get("content-type", "").startswith("application/json"):
                print(response.json())
    except Exception as e:
        print("Woops, something wrong happened!")
        print(e)

buy_test()
