"use client";
import { useState, useEffect, useRef, useCallback } from 'react';
import Button from "../../components/button/Button";
import HeartButton from "../../components/heart_button/heart_button";
import Review from "../../components/review/reviews";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import "./style.css"
import Footer from '../../components/footer/Footer';
import TopBar from '../../components/topbar_all/topbar';

export default function ReviewDetail() {
  const [reviews, setReviews] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const loaderRef = useRef(null);
  const router = useRouter();

  const handleClick = (reviewId) => {  
    router.push(`/review_detail/${reviewId}`);
  };

  const handleConfirm = () => {  
    router.push(`/pages/choseMovie`); 
  };

  const fetchReviews = useCallback(async () => {
    if (isLoading || !hasMore) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:5001/reviews/get?page=${page}&limit=3`);
      
      if (!response.ok) {
        throw new Error(`Erro ${response.status}: ${await response.text()}`);
      }

      const data = await response.json();
      
      if (!Array.isArray(data.reviews)) {
        throw new Error('Resposta da API não é um array');
      }

      setReviews(prev => [...prev, ...data.reviews]);
      setHasMore(data.hasMore);
      setPage(prev => prev + 1);
    } catch (err) {
      console.error("Erro ao carregar reviews:", err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [page, isLoading, hasMore]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const firstEntry = entries[0];
        if (firstEntry.isIntersecting && hasMore && !isLoading) {
          fetchReviews();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    const currentLoader = loaderRef.current;
    if (currentLoader) {
      observer.observe(currentLoader);
    }

    return () => {
      if (currentLoader) {
        observer.unobserve(currentLoader);
      }
    };
  }, [fetchReviews, hasMore, isLoading]);

  useEffect(() => {
    fetchReviews();
  }, []);

  return (
    <div className="vertical"> 
        <TopBar/>
      <Button label="Postar" onClick={handleConfirm}/>
      {reviews.map((review) => (
        <div className="reviewsContainer"> 
          <Link href={`/pages/review_detail/${review._id}`} className="review-link" > 
            <Review key={review._id} reviewId={review._id} 
  data-testid={`post-${review._id.toString()}`}/>
          </Link>
        </div>  
      ))}
      <div ref={loaderRef} className="loader">
        {isLoading && (
          <div className="loading-spinner">
            <p>Carregando mais reviews...</p>
          </div>
        )}
      </div>
      
      {!hasMore && reviews.length > 0 && (
        <p className="end-message">Você viu todas as reviews disponíveis!</p>
      )}
      <Footer/>
    </div>
  );
}