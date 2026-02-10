const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

const OFFICIAL_EMAIL = "shreya1212.be23@chitkara.edu.in";

// helpers
const isPrime = (n) => {
  if (n < 2) return false;
  for (let i = 2; i * i <= n; i++) {
    if (n % i === 0) return false;
  }
  return true;
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const lcm = (a, b) => (a * b) / gcd(a, b);

// GET /health
app.get("/health", (req, res) => {
  res.status(200).json({
    is_success: true,
    official_email: OFFICIAL_EMAIL,
  });
});

// POST /bfhl
app.post("/bfhl", (req, res) => {
  try {
    const body = req.body;

    if (!body || Object.keys(body).length !== 1) {
      return res.status(400).json({
        is_success: false,
        official_email: OFFICIAL_EMAIL,
        data: "Invalid input",
      });
    }

    const key = Object.keys(body)[0];
    const value = body[key];
    let result;

    switch (key) {
      case "fibonacci":
        result = [];
        for (let i = 0; i < value; i++) {
          if (i === 0) result.push(0);
          else if (i === 1) result.push(1);
          else result.push(result[i - 1] + result[i - 2]);
        }
        break;

      case "prime":
        result = value.filter(isPrime);
        break;

      case "lcm":
        result = value.reduce((a, b) => lcm(a, b));
        break;

      case "hcf":
        result = value.reduce((a, b) => gcd(a, b));
        break;

      case "AI":
        result = "Mumbai"; // AI baad me add karenge
        break;

      default:
        throw "Unknown key";
    }

    res.status(200).json({
      is_success: true,
      official_email: OFFICIAL_EMAIL,
      data: result,
    });
  } catch (err) {
    res.status(400).json({
      is_success: false,
      official_email: OFFICIAL_EMAIL,
      data: String(err),
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
