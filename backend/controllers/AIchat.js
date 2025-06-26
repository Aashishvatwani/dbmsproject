
const { GoogleGenerativeAI } = require('@google/generative-ai');

// ✅ Google Generative AI Configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY); // Adjust the path as necessary

exports.getcitydoubt = async (req, res) => {
  const { city, content1 } = req.body;

  if (!city) {
    return res.status(400).json({ error: "City name is required" });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `Give me ${content1} about ${city} in 4 bullet points(each point should not content content more than 15 word). Format it clearly.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Split and filter lines
    const lines = text.split('\n').filter(line => line.trim());

    // Basic assumption: return all lines as 'facts' if no clear format is enforced
    const facts = lines;

    res.json({ city, facts });
    console.log('Gemini response:', { city, facts });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ message: 'Error generating text', error: error.message });
  }
};
