import React, { useState } from "react";
import "./newsfeed.css"; // Import the CSS file

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

  const handleFetch = () => {
    fetchNews(query, maxResults);
  };

  return (
    <div className="newsfeed-container">
      <h1 className="newsfeed-title">📰 News Search</h1>

      {/* Search Form */}
      <div className="search-form">
        <div className="search-form-content">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Enter search topic (e.g., java, python, AI)"
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
          <button onClick={handleFetch} className="search-button">
            Fetch News
          </button>
        </div>
      </div>

      {loading && (
        <div className="loading-container">
          <h2 className="loading-title">Loading latest news...</h2>
          <p className="loading-text loading-pulse">
            Fetching articles about "{query}"
          </p>
        </div>
      )}

      {error && !loading && (
        <div className="error-message">⚠️ {error}</div>
      )}

      {!loading && news.length > 0 && (
        <>
          <h2 className="results-title">Results for: "{query}"</h2>
          <div className="news-grid">
            {news.map((article, index) => (
              <div key={index} className="news-article">
                <h3 className="article-title">{article.title}</h3>
                <p className="article-description">{article.description}</p>
                {article.url && article.url !== "#" && (
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="article-link"
                  >
                    Read full article →
                  </a>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && news.length === 0 && (
        <div className="no-results">
          No news articles found. Try a different search term.
        </div>
      )}
    </div>
  );
}

export default Newsfeed;
