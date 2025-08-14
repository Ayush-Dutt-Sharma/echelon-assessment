import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_URL } from '../constants';

function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${API_URL}/api/items/` + id)
      .then(res => res.ok ? res.json() : Promise.reject(res))
      .then(setItem)
      .catch(() => navigate('/'));
  }, [id, navigate]);

  if (!item) return <p className="item-detail-loading">Loading...</p>;

  return (
    <div className="item-detail-container">
      <h2 className="item-detail-title">{item.name}</h2>
      <p className="item-detail-category"><strong>Category:</strong> {item.category}</p>
      <p className="item-detail-price"><strong>Price:</strong> ${item.price}</p>
    </div>
  );
}

export default ItemDetail;