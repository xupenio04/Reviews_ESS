import React from "react";
import "./heart_button.css";

function HeartButton({ onClick, liked }) {
  return (
    <button 
      className={`heart-button ${liked ? "liked" : ""}`} 
      onClick={onClick}
      data-testid={liked ? "unlike-button" : "like-button"}
    >
      <svg width="23" height="23" viewBox="0 0 23 23" fill={liked ? "red" : "none"} xmlns="http://www.w3.org/2000/svg">
        <path d="M19.9719 4.41796C19.4824 3.92825 18.9012 3.53978 18.2616 3.27475C17.6219 3.00971 16.9363 2.87329 16.2439 2.87329C15.5516 2.87329 14.866 3.00971 14.2263 3.27475C13.5867 3.53978 13.0055 3.92825 12.516 4.41796L11.5002 5.43379L10.4844 4.41796C9.49566 3.42925 8.15469 2.8738 6.75645 2.8738C5.35821 2.8738 4.01723 3.42925 3.02853 4.41796C2.03982 5.40666 1.48438 6.74763 1.48438 8.14587C1.48437 9.54411 2.03982 10.8851 3.02853 11.8738L11.5002 20.3455L19.9719 11.8738C20.4616 11.3843 20.85 10.8032 21.1151 10.1635C21.3801 9.52386 21.5165 8.83826 21.5165 8.14587C21.5165 7.45349 21.3801 6.76789 21.1151 6.12824C20.85 5.48859 20.4616 4.90743 19.9719 4.41796Z" stroke="black" strokeWidth="2" />
      </svg>
    </button>
  );
}

export default HeartButton;