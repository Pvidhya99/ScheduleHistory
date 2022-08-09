const PAYMOB_GATEWAY_URL='https://accept.paymobsolutions.com/api';
class PayMobService{
    authenticationRequest=(api_key)=>{
        return fetch(`${PAYMOB_GATEWAY_URL+'/auth/tokens'}`,{
            method: 'POST',
            body: JSON.stringify({
                "api_key":api_key
            }),
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }
    orderRegistration=(reqBody)=>{
        return fetch(`${PAYMOB_GATEWAY_URL+'/ecommerce/orders'}`,{
            method: 'POST',
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }
    paymentKeyRequest=(reqBody)=>{
        return fetch(`${PAYMOB_GATEWAY_URL+'/acceptance/payment_keys'}`,{
            method: 'POST',
            body: JSON.stringify(reqBody),
            headers: {
                'Content-Type': 'application/json'
            },
        });
    }
}
export default PayMobService