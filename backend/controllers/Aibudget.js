const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.getcitybudget = async (req, res) => {
  const { city, profession, members, idealbudget } = req.body;

  if (!city) {
    return res.status(400).json({ error: "City name is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const content = `Provide the minimum, ideal, and maximum estimated total budget in Indian Rupees (₹) for a trip to ${city} for ${members} people. Consider that you are a ${profession} planning this trip, and your personal ideal budget for such a trip is ₹${idealbudget}. Structure your response strictly as follows:

Minimum Budget: ₹[minimum_amount]
Ideal Budget: ₹[ideal_amount]
Maximum Budget: ₹[maximum_amount]

Do not include any introductory or explanatory text. Just provide the budget figures in the specified format.`;

    const result = await model.generateContent(content);
    const response = await result.response;
    const text = response.text();

    // More robust parsing logic
    const budget = { city };
    const lines = text.split('\n').map(line => line.trim());

    for (const line of lines) {
      if (line.startsWith("Minimum Budget:")) {
        const match = line.match(/₹?\s*(\d+)/i);
        budget.minimum = match ? parseInt(match[1]) : null;
      } else if (line.startsWith("Ideal Budget:")) {
        const match = line.match(/₹?\s*(\d+)/i);
        budget.ideal = match ? parseInt(match[1]) : null;
      } else if (line.startsWith("Maximum Budget:")) {
        const match = line.match(/₹?\s*(\d+)/i);
        budget.maximum = match ? parseInt(match[1]) : null;
      }
    }

    res.json(budget);
    console.log('Gemini Budget Response:', budget);
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ message: 'Error generating budget', error: error.message });
  }
};