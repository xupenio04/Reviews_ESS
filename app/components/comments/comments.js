"use client";
import Button from "../../components/button/Button";
import HeartButton from "../../components/heart_button/heart_button";
import StarRating from "../../components/star_classification/star_classification";
import { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import "./comments.css"
import { ST } from "next/dist/shared/lib/utils";

const Comment = ({ comment }) => {
    const [userId, setUserId] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [liked, setLiked] = useState(false); 
    const [likesCount, setLikesCount] = useState(0);
    const [error, setError] = useState(null);
    const handleUnlikeComment = async () => {
        try {
          const token = JSON.parse(localStorage.getItem('userToken'));
          
          const response = await fetch('http://localhost:5001/comment/unlike', {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({commentId: comment._id}) 
          });
          
          if (!response.ok) {
            setLiked(false);
            throw new Error('Erro ao descurtir o comentário!');
          }
          setLikesCount(prev => prev - 1);
          setLiked(!liked);
        } catch (err) {
          setError(err.message);
          console.error('Erro ao enviar:', err);
        }
    }
    const handleLikeComment = async () => {
        try {
          const token = JSON.parse(localStorage.getItem('userToken'));
          
          const response = await fetch('http://localhost:5001/comment/like', {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json', 
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({commentId: comment._id}) 
          });
          
          if (!response.ok) {
            throw new Error('Erro ao curtir o comentário!');
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
        const fetchComment = async () => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser) {
          setUserId(loggedInUser.name); 
        }
        if(comment.owner?.name == loggedInUser) {
          setIsOwner(true)
        }
        if (comment.likes?.some(like => like.name === loggedInUser.name)) {
            setLiked(true);
          } else {
            setLiked(false);
        }
    };

    fetchComment();
  }, []);

  return (
    <div key={comment._id} className="comment">
      <div className="commentH">
        <b>por: {comment.owner?.name || "Anônimo"}</b>
        <div className="horizontal">
        <button 
            onClick={() => handleLikeComment(comment._id)}
            className="like-button"
          >
            {comment.likes.includes(comment.owner?.name)
              ? "Descurtir Comentário"
              : "Curtir Comentário"}
          </button>
          <b className="text-gray-600">
            {comment.likes.length === 1 ? `${comment.likes.length} curtida` : `${comment.likes.length} curtidas`}
          </b>
        </div>
      </div>
      <div className="comments">
        <p>{comment.body}</p>
      </div>
    </div>
  );
};

export default Comment;
