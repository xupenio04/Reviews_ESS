"use client"; // Adicione isso se estiver usando React Server Components
import "./user_card.css";

export default function UserCard({ name, reviews, rating, avatar, onClick }) {
  return (
      <div className="user-card" onClick={onClick}> {/* Adicione o evento onClick aqui */}
        <div className="avatar">
          {avatar} 
        </div>
        <div className="user-info">
          <h2 className="user-name">{name}</h2>
          <p className="user-reviews">{reviews}</p>
        </div>
      </div>
  );
}