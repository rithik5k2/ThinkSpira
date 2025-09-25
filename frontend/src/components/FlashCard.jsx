// Flashcard.jsx
import React, { useState, useEffect } from 'react';
import './FlashCard.css';

const Flashcard = ({ data, title = "Editor's Picks", showNavigation = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [readArticles, setReadArticles] = useState(new Set());
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Filter articles by category
  const categories = ['all', ...new Set(data.map(article => article.category))];
  const filteredArticles = data.filter(article => 
    categoryFilter === 'all' || article.category === categoryFilter
  );

  const currentArticle = filteredArticles[currentIndex];

  useEffect(() => {
    setCurrentIndex(0);
  }, [categoryFilter, data]);

  const nextArticle = () => {
    if (isAnimating || filteredArticles.length <= 1) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === filteredArticles.length - 1 ? 0 : prevIndex + 1
      );
      setIsAnimating(false);
    }, 300);
  };

  const prevArticle = () => {
    if (isAnimating || filteredArticles.length <= 1) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === 0 ? filteredArticles.length - 1 : prevIndex - 1
      );
      setIsAnimating(false);
    }, 300);
  };

  const markAsRead = () => {
    if (currentArticle) {
      setReadArticles(prev => {
        const newSet = new Set(prev);
        if (newSet.has(currentArticle.id)) {
          newSet.delete(currentArticle.id);
        } else {
          newSet.add(currentArticle.id);
        }
        return newSet;
      });
    }
  };

  const goToArticle = (index) => {
    if (isAnimating) return;
    
    setIsAnimating(true);
    setTimeout(() => {
      setCurrentIndex(index);
      setIsAnimating(false);
    }, 300);
  };

  if (!data || data.length === 0) {
    return (
      <div className="flashcard-container">
        <div className="flashcard-empty">
          <h3>No articles available</h3>
          <p>Please provide valid article data</p>
        </div>
      </div>
    );
  }

  if (filteredArticles.length === 0) {
    return (
      <div className="flashcard-container">
        <div className="flashcard-empty">
          <h3>No articles match your filter</h3>
          <p>Try selecting a different category</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flashcard-container">
      <div className="flashcard-header">
        <h2>{title}</h2>
        <div className="progress-stats">
          <span>Articles: {filteredArticles.length}</span>
          <span>Read: {readArticles.size}</span>
          <span>Progress: {Math.round((readArticles.size / data.length) * 100)}%</span>
        </div>
      </div>

      {/* Category Filter */}
      <div className="category-filter">
        {categories.map(category => (
          <button
            key={category}
            className={`filter-btn ${categoryFilter === category ? 'active' : ''}`}
            onClick={() => setCategoryFilter(category)}
          >
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </button>
        ))}
      </div>

      {/* Main Flashcard */}
      <div className="flashcard-content">
        <div className="article-counter">
          Article {currentIndex + 1} of {filteredArticles.length}
          {currentArticle.category && (
            <span className="article-category-badge">{currentArticle.category}</span>
          )}
        </div>

        <div className={`article-card ${isAnimating ? 'animating' : ''}`}>
          <div className="article-header">
            <h3 className="article-title">{currentArticle?.title}</h3>
            <div className="article-meta">
              {currentArticle?.author && (
                <span className="author">By {currentArticle.author}</span>
              )}
              {currentArticle?.date && (
                <span className="date">{currentArticle.date}</span>
              )}
            </div>
          </div>

          <div className="article-description">
            <p>{currentArticle?.description}</p>
          </div>

          {currentArticle?.image && (
            <div className="article-image">
              <img src={currentArticle.image} alt={currentArticle.title} />
            </div>
          )}

          <div className="article-actions">
            <button 
              className={`read-btn ${readArticles.has(currentArticle?.id) ? 'read' : ''}`}
              onClick={markAsRead}
            >
              {readArticles.has(currentArticle?.id) ? '✅ Read' : '📖 Mark as Read'}
            </button>
            
            {currentArticle?.link && (
              <a 
                href={currentArticle.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="external-link"
                onClick={() => markAsRead()}
              >
                🔗 Read Full Article
              </a>
            )}
          </div>
        </div>

        {/* Article Navigation Dots */}
        {showNavigation && filteredArticles.length > 1 && (
          <div className="navigation-dots">
            {filteredArticles.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentIndex ? 'active' : ''} ${
                  readArticles.has(filteredArticles[index].id) ? 'read' : ''
                }`}
                onClick={() => goToArticle(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Navigation Controls */}
      {showNavigation && filteredArticles.length > 1 && (
        <div className="navigation-controls">
          <button onClick={prevArticle} disabled={isAnimating}>
            ⬅️ Previous
          </button>
          <button onClick={nextArticle} disabled={isAnimating}>
            Next ➡️
          </button>
        </div>
      )}

      <div className="keyboard-shortcuts">
        <p>Shortcuts: Arrow keys to navigate • Click dots for quick access</p>
      </div>
    </div>
  );
};

// Default props
Flashcard.defaultProps = {
  data: [],
  title: "Editor's Picks",
  showNavigation: true
};

export default Flashcard;