import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./newsfeed.css";

function Newsfeed({ user }) {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("java");
  const [maxResults, setMaxResults] = useState(5);

  const fetchNews = async (searchQuery = query, max = maxResults) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(
        `http://localhost:5000/api/news?query=${encodeURIComponent(
          searchQuery
        )}&max=${max}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setNews(data.articles || []);

      if (data.fallback) {
        setError("Using demo data: " + data.error);
      }
    } catch (err) {
      console.error("Error fetching news:", err);
      setError("Failed to load news. Using demo data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      className="newsfeed-container"
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h1 className="newsfeed-title">📰 Explore the Latest News</h1>

      {/* Search Form */}
      <motion.div
        className="search-form"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter topic (e.g., AI, Java, Startups)"
          className="search-input"
        />
        <select
          value={maxResults}
          onChange={(e) => setMaxResults(parseInt(e.target.value))}
          className="results-select"
        >
          <option value={3}>3 results</option>
          <option value={5}>5 results</option>
          <option value={8}>8 results</option>
          <option value={10}>10 results</option>
        </select>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => fetchNews(query, maxResults)}
          className="search-button"
        >
          Fetch News
        </motion.button>
      </motion.div>

      {/* Loading */}
      {loading && (
        <motion.div
          className="loading-container"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="loading-title">Loading latest news...</h2>
          <p className="loading-text loading-pulse">
            Fetching articles about "{query}"
          </p>
        </motion.div>
      )}

      {/* Error */}
      {error && !loading && (
        <motion.div
          className="error-message"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          ⚠️ {error}
        </motion.div>
      )}

      {/* Results */}
      <AnimatePresence>
        {!loading && news.length > 0 && (
          <>
            <h2 className="results-title">Results for: "{query}"</h2>
            <div className="news-grid">
              {news.map((article, index) => (
                <motion.div
                  key={index}
                  className="news-article"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <h3 className="article-title">{article.title}</h3>
                  <p className="article-description">
                    {article.description || "No description available"}
                  </p>
                  {article.url && article.url !== "#" && (
                    <motion.a
                      href={article.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="article-link"
                      whileHover={{ x: 5 }}
                    >
                      Read full article →
                    </motion.a>
                  )}
                </motion.div>
              ))}
            </div>
          </>
        )}
      </AnimatePresence>

      {/* No results */}
      {!loading && news.length === 0 && (
        <motion.div
          className="no-results"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          No news articles found. Try a different search term.
        </motion.div>
      )}
    </motion.div>
  );
}

export default Newsfeed;
