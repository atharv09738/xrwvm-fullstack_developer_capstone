import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import "./Dealers.css";
import "../assets/style.css";
import positive_icon from "../assets/positive.png"
import neutral_icon from "../assets/neutral.png"
import negative_icon from "../assets/negative.png"
import Header from '../Header/Header';

const Dealer = () => {
  const [dealer, setDealer] = useState({});
  const [reviews, setReviews] = useState([]);
  const [unreviewed, setUnreviewed] = useState(false);

  let params = useParams();
  let id = params.id;

  const get_dealer = async () => {
    try {
      const res = await fetch("http://localhost:8000" + `/djangoapp/dealer/${id}`, { method: "GET" });
      const retobj = await res.json();
      if (retobj.dealer) {
        setDealer(retobj.dealer);
      }
    } catch (error) {
      console.error("Failed to fetch dealer:", error);
    }
  };

  const get_reviews = async () => {
    try {
      const res = await fetch("http://localhost:8000" + `/djangoapp/reviews/dealer/${id}`, { method: "GET" });
      const retobj = await res.json();
      if (retobj.reviews && retobj.reviews.length > 0) {
        setReviews(retobj.reviews);
      } else {
        setUnreviewed(true);
      }
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    }
  };

  const senti_icon = (sentiment) => {
    let icon = sentiment === "positive" ? positive_icon : sentiment === "negative" ? negative_icon : neutral_icon;
    return icon;
  };

  useEffect(() => {
    get_dealer();
    get_reviews();
  }, []);

  return (
    <div style={{ margin: "20px" }}>
      <Header />
      <div style={{ marginTop: "10px" }}>
        <h1 style={{ color: "grey" }}>
          {dealer.full_name}
          <a href={`/postreview/${id}`} style={{ marginLeft: '15px', color: 'blue', fontSize: '18px' }}>Add Review</a>
        </h1>
        <h4 style={{ color: "grey" }}>{dealer['city']}, {dealer['address']}, Zip - {dealer['zip']}, {dealer['state']}</h4>
      </div>
      <div className="reviews_panel">
        {reviews.length === 0 && unreviewed === false ? (
          <text>Loading Reviews....</text>
        ) : unreviewed === true ? <div>No reviews yet!</div> :
          reviews.map(review => (
            <div key={review.id} className='review_panel'>
              <img src={senti_icon(review.sentiment)} className="emotion_icon" alt='Sentiment' />
              <div className='review'>{review.review}</div>
              <div className="reviewer">{review.name} {review.car_make} {review.car_model} {review.car_year}</div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Dealer;