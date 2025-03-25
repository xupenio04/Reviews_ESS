"use client";
import Button from "../../components/button/Button";
import HeartButton from "../../components/heart_button/heart_button";
import Review from "../../components/review/reviews";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from "react";
import "./style.css"

export default function ReviewDetail() {
  const [reviews, setReviews] = useState([]);
  const [owner, setOwners] = useState([]);
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  
  const handleClick = (reviewId) => {  
    router.push(`/review_detail/${reviewId}`);
  };
  const handleConfirm = () => {  
    router.push(`/pages/create_review`); 
  };
  useEffect(() => {
    const fetchReview = async () => {
      try {
        const response = await fetch("http://localhost:5001/reviews/get");
        
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Erro ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        

        if (!Array.isArray(data)) {
          throw new Error('Resposta da API não é um array');
        }

        setReviews(data);
        setError(null);

      } catch (err) {
        console.error("Erro na requisição:", err);
        setError(err.message);
      
        setReviews([]);
        
      } finally {
        setLoading(false);
      }
    };

    fetchReview();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;;

  return (
    <div className="vertical"> 
      <Button label="Postar" onClick={handleConfirm}/>
      {reviews.map((review) => (
        <div className="reviewsContainer"> 
          <Link href={`/pages/review_detail/${review._id}`} className="review-link" > 
            <Review key={review._id} reviewId={review._id} 
  data-testid={`post-${review._id.toString()}`}/>
          </Link>
        </div>  
      ))}
    </div>
  );
}