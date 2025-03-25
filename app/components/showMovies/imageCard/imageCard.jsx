import './imageCard.css'

export default function ImageCard({ imageURL, title }) {
    return (
        <div className="image-card">
            <img src={imageURL} alt={title} width={200} height={200} className="image"/>
            <h3 className="title">{title}</h3>
        </div>
    );
}