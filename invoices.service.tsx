import firebase from './firebase';

/**
 * Api doc ref: https://github.com/romelgomez/2ulaundry-functions
 */
const endpoint = 'https://us-central1-fire2ulaundry.cloudfunctions.net/invoices';

/**
 * Firebase invoices ref
 */
export const invoicesRef = firebase.database().ref('invoices');

export const updateInvoiceStatus = (id: any, status: string) => {

    const options = {
        method: 'PATCH',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
        body: JSON.stringify({
            id: id,
            status: status
        })
    };

    return fetch(endpoint, options);
}

export default invoicesRef;
