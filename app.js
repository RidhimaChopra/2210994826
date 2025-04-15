const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

const apiUrl = 'http://20.244.56.144/evaluation-service';
const windowSize = 10;
let storedNumbers = [];

function calculateAverage(numbers) {
    const sum = numbers.reduce((acc, num) => acc + num, 0);
    return sum / numbers.length;
}

async function fetchNumber(numberId) {
    try {
        const response = await axios.get(`${apiUrl}/numbers/${numberId}`, { timeout: 500 });
        return response.data.number;
    } catch (error) {
        console.error(`Error fetching number for ID ${numberId}:`, error);
        return null;
    }
}

app.get('/numbers/:numberid', async (req, res) => {
    const { numberid } = req.params;
    const beforeNumbers = [...storedNumbers];
    
    const newNumber = await fetchNumber(numberid);
    
    if (newNumber === null) {
        return res.status(500).send('Error fetching the number.');
    }

    if (!storedNumbers.includes(newNumber)) {
        storedNumbers.push(newNumber);
    }

    if (storedNumbers.length > windowSize) {
        storedNumbers.shift(); 
    }
    const average = calculateAverage(storedNumbers);
e
    res.json({
        beforeNumbers,
        afterNumbers: storedNumbers,
        average
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
