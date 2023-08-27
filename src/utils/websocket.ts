import { env } from "$env/dynamic/public"; 
import { toastSignal } from "$lib/store";

let connection: WebSocket | null = null;
let url:string = env.PUBLIC_LOCAL_BACKEND_URL
let token = localStorage.getItem('token')

const headers = {
    'Authorization': 'Bearer ' + token,
    'accept': 'application/json',
    //'Content-Type': 'application/json',
}

const closeConnection = (event:any) => {
    if (event) {
        console.log("WebSocket Connection Closed" + event);
        connection = null;
    } else {
        connection = null;
    }
}

async function connectToServer (path:string='') {
    
    connection = new WebSocket(`ws://${url}/ws/${path}`, JSON.stringify(headers))

    connection.onopen = (event) => {
        console.log('WebSocket Connection Opened: ' + event);
    };
    // Set the event handler for receiving messages
    connection.onmessage = (event) => {
        console.log(event)
    };

    // Set the event handler for errors
    connection.onerror = (event) => {
        console.error('WebSocket error observed:', event);
    };


    connection.onclose = (event) => {closeConnection(event)}
}