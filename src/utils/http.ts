//const url = "http://localhost:8000/buckets/create_bucket";
import { env } from "$env/dynamic/public"; 
import { toastSignal } from "$lib/store";


let url:string = env.PUBLIC_BACKEND_URL


async function createUserFileBucket() {
    url = url + "/buckets/create_bucket"
    console.log('Creating user file bucket...');
    const token:string = await localStorage.getItem("token") as string
    console.log(`Bearer ${token}`)
    fetch(url, {
        method: 'POST',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(data => console.log(data)).catch((err:Response) => {
        toastSignal.update(value => value = "An Error occurred")
        console.log(err)
    })
}

async function createSession() {
    console.log(JSON.stringify({
        token:
            "eyJhbGciOiJIUzI1NiIsImtpZCI6IllNWVlmU1BCb1dXL1Z2UU4iLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjkyODE4MjA5LCJpYXQiOjE2OTI4MTQ2MDksImlzcyI6Imh0dHBzOi8vc2hnaWl5cnZlaWxzZWdqbnl2dWYuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6ImUxNjY1YjI2LWQ1ZTctNDAxOS1iMDQ1LTc0ZTg0YjJhZGE5MSIsImVtYWlsIjoic2FpbGVuZHJhLmRhcmJoYUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6Imdvb2dsZSIsInByb3ZpZGVycyI6WyJnb29nbGUiXX0sInVzZXJfbWV0YWRhdGEiOnsiYXZhdGFyX3VybCI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBY0hUdGVOR2R6MWNUVmZ4RTFBNjlEVzZJdDlaQS1zR3NraTNRakRaNmh3S0Flcz1zOTYtYyIsImVtYWlsIjoic2FpbGVuZHJhLmRhcmJoYUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiU2FpbGVuZHJhIERhcmJoYSIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsIm5hbWUiOiJTYWlsZW5kcmEgRGFyYmhhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBY0hUdGVOR2R6MWNUVmZ4RTFBNjlEVzZJdDlaQS1zR3NraTNRakRaNmh3S0Flcz1zOTYtYyIsInByb3ZpZGVyX2lkIjoiMTE2NTI5ODM2OTQyOTE1NTY2NTUwIiwic3ViIjoiMTE2NTI5ODM2OTQyOTE1NTY2NTUwIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib2F1dGgiLCJ0aW1lc3RhbXAiOjE2OTI4MTQ2MDl9XSwic2Vzc2lvbl9pZCI6IjRiMDY1Nzk2LWE5NzYtNGZjMi04ZDU2LWM2ZjRiZTVjNzk4MSJ9.FAyBdYH8qNl_1JPxRg8P_kAygmj65VoNbDmW7s1m14A"
    }))
	fetch(url, {
        method: 'POST',
        //mode: 'no-cors',
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            token:
                "eyJhbGciOiJIUzI1NiIsImtpZCI6IllNWVlmU1BCb1dXL1Z2UU4iLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNjkyODE4MjA5LCJpYXQiOjE2OTI4MTQ2MDksImlzcyI6Imh0dHBzOi8vc2hnaWl5cnZlaWxzZWdqbnl2dWYuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6ImUxNjY1YjI2LWQ1ZTctNDAxOS1iMDQ1LTc0ZTg0YjJhZGE5MSIsImVtYWlsIjoic2FpbGVuZHJhLmRhcmJoYUBnbWFpbC5jb20iLCJwaG9uZSI6IiIsImFwcF9tZXRhZGF0YSI6eyJwcm92aWRlciI6Imdvb2dsZSIsInByb3ZpZGVycyI6WyJnb29nbGUiXX0sInVzZXJfbWV0YWRhdGEiOnsiYXZhdGFyX3VybCI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBY0hUdGVOR2R6MWNUVmZ4RTFBNjlEVzZJdDlaQS1zR3NraTNRakRaNmh3S0Flcz1zOTYtYyIsImVtYWlsIjoic2FpbGVuZHJhLmRhcmJoYUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZnVsbF9uYW1lIjoiU2FpbGVuZHJhIERhcmJoYSIsImlzcyI6Imh0dHBzOi8vYWNjb3VudHMuZ29vZ2xlLmNvbSIsIm5hbWUiOiJTYWlsZW5kcmEgRGFyYmhhIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FBY0hUdGVOR2R6MWNUVmZ4RTFBNjlEVzZJdDlaQS1zR3NraTNRakRaNmh3S0Flcz1zOTYtYyIsInByb3ZpZGVyX2lkIjoiMTE2NTI5ODM2OTQyOTE1NTY2NTUwIiwic3ViIjoiMTE2NTI5ODM2OTQyOTE1NTY2NTUwIn0sInJvbGUiOiJhdXRoZW50aWNhdGVkIiwiYWFsIjoiYWFsMSIsImFtciI6W3sibWV0aG9kIjoib2F1dGgiLCJ0aW1lc3RhbXAiOjE2OTI4MTQ2MDl9XSwic2Vzc2lvbl9pZCI6IjRiMDY1Nzk2LWE5NzYtNGZjMi04ZDU2LWM2ZjRiZTVjNzk4MSJ9.FAyBdYH8qNl_1JPxRg8P_kAygmj65VoNbDmW7s1m14A"
        })
    })
		.then((response) => response.json())
		.then((data) => {
			console.log('Response:', data);
		})
		.catch((error) => {
			console.error('Error:', error);
		});
}

// async function uploadFile(file:File) {
//     url = `${env.PUBLIC_BACKEND_URL}/files/upload_file/`
//     console.log('Establishing backend handshake...')
//     const token:string = await localStorage.getItem("token") as string
//     //console.log(`Bearer ${token}`)
//     fetch(url, {
//         method: 'POST',
//         headers: {
//             accept: 'application/json',
//             //'Content-Type': 'application/json',
//             'Authorization': token
//         }
//     }).then(async data => {
//         let newdata = await data.json()
//         console.log("new data",newdata)
//     }).catch((err:Response) => {
//         toastSignal.update(value => value = "An Error occurred")
//         console.log(err)
//     })
// }


export default createUserFileBucket;
