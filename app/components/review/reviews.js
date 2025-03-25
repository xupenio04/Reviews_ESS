"use client";
import Button from "../../components/button/Button";
import HeartButton from "../../components/heart_button/heart_button";
import StarRating from "../../components/star_classification/star_classification";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import "./review.css"
import { ST } from "next/dist/shared/lib/utils";

export default function Reviews({ reviewId}) {
  const [post, setPost] = useState(null);
  const [owner, setOwner] = useState("");
  const [movie, setMovie] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false); 
  const [userId, setUserId] = useState(null);
  const [likesCount, setLikesCount] = useState(0);
  const router = useRouter()
  const handleDeleteReview = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userToken'));
      const response = await fetch(`http://localhost:5001/reviews/delete`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }, 
        body: JSON.stringify({
          id: reviewId  
        })
      });

      if (!response.ok) {
        throw new Error('Erro ao excluir a review');
      }
      alert('Review excluída com sucesso!');
      window.location.href = '/';
      router.replace('/pages/initial_page');
    } catch (err) {
      console.error('Erro ao excluir:', err);
      alert('Erro ao excluir a review' + err);
    }
  };
  const handleUnlikeReview = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userToken'));
      
      const response = await fetch('http://localhost:5001/reviews/unlike', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({reviewId: reviewId}) 
      });
      
      if (!response.ok) {
        setLiked(false);
        throw new Error('Erro ao descurtir a review!');
      }
      setLikesCount(prev => prev - 1);
      setLiked(!liked);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao enviar:', err);
    }
  }
  const handleLikeReview = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userToken'));
      
      const response = await fetch('http://localhost:5001/reviews/like', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({reviewId: reviewId}) 
      });
      
      if (!response.ok) {
        throw new Error('Erro ao curtir a review!');
      }
      setLikesCount(prev => prev + 1);
      setLiked(!liked);
    } catch (err) {
      setError(err.message);
      console.error('Erro ao enviar:', err);
    }
  }
  const handleClick = async () => {
    if (liked) {
      await handleUnlikeReview(); 
    } else {
      await handleLikeReview(); 
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        if (!reviewId) {
            throw new Error(`id inválido`);
        }
        const response = await fetch(`http://localhost:5001/reviews/getReview/${reviewId}`);
        if (!response.ok) {
          console.log(response.text)
          throw new Error(`Erro ao buscar post: ${response.status}`);
        }
        const data = await response.json();
        setPost(data.review);
        setOwner(data.owner);
        setMovie(data.movie);
        setLikesCount(data.review.likes.length);
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser) {
          setUserId(loggedInUser.name); 
        }
        if (data.review.likes?.some(like => like.name === loggedInUser.name)) {
          setLiked(true);
        } else {
          setLiked(false);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, []);

  if (loading) return <p>Carregando...</p>;
  if (error) return <p>Erro: {error}</p>;
  
  return (
    <div>
      <div >
        {/* Post */}
        <div className="horizontal"> 
            {/* Container da foto */}
          <div className="mr-4"> 
            <img
              src={movie?.cover?.imageURL || 'default-image.jpg'}
              alt="Foto do post"
              className="photo_img"
            />
          </div>
         <div className="var-vertical">

            <div>
                <div className="var-horizontal">
                  <div>
                    <h1 className="h1">{post?.title}</h1>
                    <h2 className="h2">{movie?.name || 'Nome do filme indisponível'}</h2>
                  </div>
                  <div className="vertical-right">
                    <StarRating rating ={post.classification}></StarRating> 
                    {userId == owner.name && (
                      <button
                        onClick={handleDeleteReview}
                        className="button-style"
                        title="Excluir review"
                      > Excluir Review </button>
                    )}
                  </div>
                </div>
               
                <b className="p">por: {owner?.name || 'Anônimo'}</b>
                <p className="b">{post?.body || 'Conteúdo indisponível'}</p>
            </div>
            <div className="horizontal">
              <HeartButton onClick={handleClick} liked={liked} setLiked={setLiked} />
              <p className="text-xl font-bold">
                {liked ? "Descurtir Review" : "Curtir Review"}
              </p>
              <b className="text-gray-600">
                {likesCount === 1 ? "1 curtida" : `${likesCount} curtidas`}
              </b>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
