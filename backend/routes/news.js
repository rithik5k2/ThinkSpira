import express from "express";
const router = express.Router();

// Simple cache implementation
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

// GET /api/news?query=java&max=5
router.get("/", async (req, res) => {
  try {
    const query = req.query.query || "education technology";
    const max = Math.min(parseInt(req.query.max) || 5, 10);
    
    const API_KEY = process.env.PERPLEXITY_API_KEY;
    
    if (!API_KEY) {
      return res.status(500).json({ 
        error: "PERPLEXITY_API_KEY not configured on server" 
      });
    }

    // Check cache first
    const cacheKey = `news:${query}:${max}`;
    const cached = cache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return res.json({ 
        fromCache: true, 
        query,
        articles: cached.data 
      });
    }

    const prompt = `Provide ${max} recent news articles about "${query}". 
Return ONLY valid JSON array where each item has: title, description, and url.
Be accurate and provide real recent news.
Example: [{"title":"News Title","description":"Brief summary","url":"https://example.com"}]`;

    const response = await fetch("https://api.perplexity.ai/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "sonar-pro",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Perplexity API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    let articles;
    try {
      articles = JSON.parse(content);
      if (!Array.isArray(articles)) {
        throw new Error("Response is not an array");
      }
    } catch (e) {
      throw new Error("Invalid JSON response from Perplexity API");
    }

    // Cache the result
    cache.set(cacheKey, {
      data: articles,
      timestamp: Date.now()
    });

    res.json({ 
      fromCache: false, 
      query,
      articles 
    });
    
  } catch (error) {
    console.error("News API error:", error);
    
    // Fallback mock data based on query
    const query = req.query.query || "education technology";
    const mockData = getMockData(query);
    
    res.json({ 
      success: false, 
      error: error.message,
      query,
      articles: mockData,
      fallback: true 
    });
  }
});

// Helper function for mock data based on query
function getMockData(query) {
  const lowerQuery = query.toLowerCase();
  
  if (lowerQuery.includes("java")) {
    return [
      {
        title: "Java 21 New Features Released",
        description: "Latest Java LTS version introduces virtual threads and pattern matching.",
        url: "https://example.com/java21"
      },
      {
        title: "Spring Framework 6.0 Update",
        description: "Major release with improved performance and new capabilities.",
        url: "https://example.com/spring6"
      },
      {
        title: "Java in Cloud Native Development",
        description: "How Java is adapting to modern cloud infrastructure trends.",
        url: "https://example.com/java-cloud"
      }
    ];
  } else if (lowerQuery.includes("python")) {
    return [
      {
        title: "Python 3.12 Performance Improvements",
        description: "Latest Python version shows significant speed enhancements.",
        url: "https://example.com/python312"
      },
      {
        title: "Machine Learning with Python Trends",
        description: "New libraries and frameworks emerging in the Python ML ecosystem.",
        url: "https://example.com/python-ml"
      }
    ];
  } else {
    // Default education technology news
    return [
      {
        title: "Educational Technology Trends 2024",
        description: "AI and machine learning are transforming modern classrooms.",
        url: "https://example.com/edtech-trends"
      },
      {
        title: "Virtual Reality in Education",
        description: "Schools adopting VR technology for immersive learning experiences.",
        url: "https://example.com/vr-education"
      },
      {
        title: "Remote Learning Platforms Evolution",
        description: "Latest updates in online education tools and student engagement.",
        url: "https://example.com/remote-learning"
      }
    ];
  }
}

export default router;