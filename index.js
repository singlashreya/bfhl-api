require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());
app.use(cors());

const OFFICIAL_EMAIL = "shreya1212.be23@chitkara.edu.in"; 

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
        if (num % i === 0) return false;
    }
    return true;
};

const getGCD = (a, b) => b === 0 ? a : getGCD(b, a % b);
const getLCM = (a, b) => (a * b) / getGCD(a, b);

app.get('/', (req, res) => {
    res.send("BFHL API is running");
});

app.get('/health', (req, res) => {
    res.status(200).json({
        "is_success": true,
        "official_email": OFFICIAL_EMAIL
    });
});

app.post('/bfhl', async (req, res) => {
    try {
        const body = req.body;
        let responseData = null;
        
        if (body.fibonacci !== undefined) {
            const n = parseInt(body.fibonacci);
            let seq = [0, 1];
            if (n <= 0) seq = [];
            else if (n === 1) seq = [0];
            else {
                for (let i = 2; i < n; i++) seq.push(seq[i - 1] + seq[i - 2]);
            }
            responseData = seq;
        } 
        else if (body.prime) {
            responseData = body.prime.filter(num => isPrime(num));
        } 
        else if (body.lcm) {
            let result = body.lcm[0];
            for (let i = 1; i < body.lcm.length; i++) result = getLCM(result, body.lcm[i]);
            responseData = result;
        } 
        else if (body.hcf) {
            let result = body.hcf[0];
            for (let i = 1; i < body.hcf.length; i++) result = getGCD(result, body.hcf[i]);
            responseData = result;
        } 
        else if (body.AI) {
            try {
                const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
                const prompt = `Answer in exactly one word: ${body.AI}`;
                const result = await model.generateContent(prompt);
                const response = await result.response;
                responseData = response.text().trim();
            } catch (aiError) {
                return res.status(500).json({
                     "is_success": false,
                     "official_email": OFFICIAL_EMAIL,
                     "message": "AI Service Failed"
                });
            }
        } 
        else {
            return res.status(400).json({
                "is_success": false,
                "official_email": OFFICIAL_EMAIL,
                "message": "Invalid Input Format"
            });
        }

        res.json({
            "is_success": true,
            "official_email": OFFICIAL_EMAIL,
            "data": responseData
        });

    } catch (error) {
        res.status(500).json({
            "is_success": false,
            "official_email": OFFICIAL_EMAIL,
            "message": "Internal Server Error"
        });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
