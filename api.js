const axios = require('axios'); // Import the axios library for making HTTP requests

const url = 'https://makeatum-function.azurewebsites.net/api/detectBias/'; // Replace with your Azure Function URL
const data = { text: 'girlbsos' };
const jsonData = JSON.stringify(data);
console.log(jsonData); // Output: {"text":"girlbsos"}
 // Replace with your string text

axios.post(url, data, { timeout: 180000 })
    .then((response) => {
        console.log(response.data); // Handle the response from the API
    })
    .catch((error) => {
        console.error(error); // Handle any errors that occur
    });
