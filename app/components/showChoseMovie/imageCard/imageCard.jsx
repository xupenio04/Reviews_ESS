import './imageCard.css'
import { useRouter } from 'next/navigation';
export default function ImageCard({ imageURL, title, movie }) {
    const router = useRouter()
    const handleClick = (reviewId) => {  
        router.push(`/pages/create_review/${movie}`);
    };
    return (
        <div className="image-card">
            <button onClick = {handleClick} className="image-button">
                <img src={imageURL} alt={title} width={200} height={200} className="image" />
            </button>
            <h3 className="title">{title}</h3>
        </div>
    );
}