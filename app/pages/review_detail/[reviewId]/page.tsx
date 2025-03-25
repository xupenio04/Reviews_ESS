"use client";
import Button from "../../../components/button/Button";
import HeartButton from "../../../components/heart_button/heart_button";
import Review from "../../../components/review/reviews";
import Comment from "../../../components/comments/comments";
import { useEffect, useState } from "react";
import { useParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import "./style.css"

export default function ReviewDetail() {
  const params = useParams();
  const reviewId = params.reviewId;
  const [post, setPost] = useState(null);
  const [owner, setOwner] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [comments, setComments] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isTextBoxVisible, setIsTextBoxVisible] = useState(false);
  const router = useRouter()
  const [text, setText] = useState('');

  
  const handleChange = (event) => {
    setText(event.target.value);
  };
  const handleClick = () => {
    setIsTextBoxVisible(!isTextBoxVisible);
  };
  
  const handleConfirm = async () => {
    try {
      const token = JSON.parse(localStorage.getItem('userToken'));
      if (text == '') {
        alert('Por favor, digite algo!');
        return;
      }
      const response = await fetch('http://localhost:5001/comment/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', 
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({body: text, review: reviewId}) 
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar o texto!');
      }

      alert('Comentário enviado com sucesso!');
      setText('');
    } catch (err) {
      setError(err.message);
      console.error('Erro ao enviar:', err);
    }
  };
  
  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await fetch(`http://localhost:5001/reviews/getReview/${reviewId}`); 
        if (!response.ok) {
          console.log(response.text)
          throw new Error(`Erro ao buscar post: ${response.status}`);
        }
        const data = await response.json();
        setPost(data.review);
        setOwner(data.owner || null);
        setContent(data.content || null);
        setComments(data.review.comments || []);
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser) {
          setUserId(loggedInUser.name); 
        }
     
        if(owner?.name == loggedInUser) {
          setIsOwner(true)
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
  if (!post) return <p>Nenhum post encontrado.</p>;
  
  return (
    <div className="vertical-left">
      <Review reviewId={reviewId}/>
     
      <div>
        <h2>Comentários</h2>
        {comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment._id} className="comment">
              <Comment
                key={comment._id}
                comment={comment}
              />
            </div>
          ))
        ) : (
          <p>Sem comentários ainda.</p>
        )}
      </div>
      <div data-testid="comment-button">
          <Button label="Comentar" onClick={handleClick} />
      </div>
      {isTextBoxVisible && (
        <div className="overlay" onClick= {handleChange}>
          {/* Popup */}
          <div className="popup">
            <textarea className="custom-textarea" placeholder="Digite aqui..." data-testid="comment-textarea"></textarea>
            <div data-testid="confirm"> 
              <Button label="Confirmar" onClick={handleConfirm} />
            </div>
          </div>
        </div>
      )}
      
    </div>
  );
}