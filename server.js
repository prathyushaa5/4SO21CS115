    const express = require('express');
    const axios = require('axios');

    const app = express();
    const PORT = 9876;
    const WINDOW_SIZE = 10;
    const FETCH_TIMEOUT = 2000;

    let numbers = [];

   
    const BEARER_TOKEN='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzIxMjk3OTI5LCJpYXQiOjE3MjEyOTc2MjksImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjhmNmYzNzE4LTZlZjItNDhmYy1hOGUyLTg4MjJiNDEzYjE1NCIsInN1YiI6InByYXRoeXVzaGFhY2hhcnlhMDUwQGdtYWlsLmNvbSJ9LCJjb21wYW55TmFtZSI6IkFmZm9yZCIsImNsaWVudElEIjoiOGY2ZjM3MTgtNmVmMi00OGZjLWE4ZTItODgyMmI0MTNiMTU0IiwiY2xpZW50U2VjcmV0IjoiYUJ5RkNEdlpEbkVFUWNIciIsIm93bmVyTmFtZSI6IlByYXRoeXVzaGEiLCJvd25lckVtYWlsIjoicHJhdGh5dXNoYWFjaGFyeWEwNTBAZ21haWwuY29tIiwicm9sbE5vIjoiNFNPMjFDUzExNSJ9.HfNB5PEOeK8DHu4FRW0RaPhNHnOUsQ7ptIOuZ8WR6ns'
    
    async function fetchNumber(numberId) {
    let url;
    switch (numberId) {
        case 'p':
        url = 'http://20.244.56.144/test/primes'; 
        case 'f':
        url = 'http://20.244.56.144/test/fibo'; 
        break;
        case 'e':
        url = 'http://20.244.56.144/test/even'; 
        break;
        case 'r':
        url = 'http://20.244.56.144/test/rand'  ; 
        break;
        default:
        return null; 
    }
    try {
        const response = await axios.get(url, {
        headers: {
            'Authorization': `Bearer ${BEARER_TOKEN}`
        },
        timeout: FETCH_TIMEOUT
        });
        return response.data;
    } catch (error) {
        console.error(`Error fetching number with ID ${numberId}:`, error.message);
        return null;
    }
    }
    function calculateAverage(numbers) {
        if (numbers.length === 0) return 0;
        const sum = numbers.reduce((acc, num) => acc + num, 0);
        return sum / numbers.length;
    }
    

    app.get('/numbers/:numberId', async (req, res) => {
        const { numberId } = req.params;
        const validIds = ['p', 'f', 'e', 'r'];
    
        if (!validIds.includes(numberId)) {
        return res.status(400).json({ error: 'Invalid number ID' });
        }
    
        try {
        
        const fetchedNumber = await fetchNumber(numberId);
    
        if (fetchedNumber !== null) {
            if (numbers.length >= WINDOW_SIZE) {
            numbers.shift();
            }
            numbers.push(fetchedNumber);
        }
        const average = calculateAverage(numbers);

        res.json({
            numbersBefore: [...numbers],
            fetchedNumber,
            numbersAfter: [...numbers],
            average
        });
        } catch (error) {
        console.error('Error processing request:', error.message);
        res.status(500).json({ error: 'Failed to process request' });
        }
    });
    
    // Start the server
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });