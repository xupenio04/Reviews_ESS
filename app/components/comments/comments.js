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
    const [deleted, setDeleted] = useState(false); 
    const [likesCount, setLikesCount] = useState(0);
    const [error, setError] = useState(null);
    const deleteComment = async () => {
      try {
        const token = JSON.parse(localStorage.getItem('userToken'));
        
        const response = await fetch('http://localhost:5001/comment/delete', {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json', 
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({id: comment._id}) 
        });
        
        if (!response.ok) {
          setLiked(false);
          throw new Error('Erro ao excluir comentário!');
        }
        setDeleted(!deleted);
      } catch (err) {
        setError(err.message);
        console.error('Erro ao enviar:', err);
      }
  }
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
        const loggedInUser = JSON.parse(localStorage.getItem('userName'));
        if (loggedInUser) {
          setUserId(loggedInUser.user.name); 
        }
        if(comment.owner?.name == loggedInUser.user.name) {
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
  if (deleted) return null;
  return (
    <div key={comment._id} className="comment">
      <div className="commentH">
        <b>por: {comment.owner?.name || "Anônimo"}</b>
        <div className="horizontal">
          <div> 
            {isOwner
                  ? <button  onClick={() => deleteComment(comment._id)} className="delete-button"> Excluir Comentário </button>
                  : <div> </div>
            }
          </div> 
          <div> 
          {!liked
                ? <button  onClick={() => handleLikeComment(comment._id)} className="like-button"> Curtir Comentário </button>
                : <button  onClick={() => handleUnlikeComment(comment._id)} className="like-button"> Descurtir Comentário </button>
          }
          </div>
            <b className="text-gray-600">
              {likesCount === 1 ? `${likesCount} curtida` : `${likesCount} curtidas`}
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
