"use client";
import React, { useState } from "react";
import { postUpdateRating } from "@/utils/apis";
import { FaStar, FaRegStar } from "react-icons/fa";

const StarRating = ({ initialRating = 0, slug }) => {
  const [rating, setRating] = useState(initialRating);
  const [hover, setHover] = useState(null); // Highlighted stars on hover
  const [isSubmitting, setIsSubmitting] = useState(false);
  const totalStars = 5;

  const handleStarClick = async (starValue) => {
    if (isSubmitting || !slug) return;

    setRating(starValue); // Update the UI rating immediately
    setIsSubmitting(true);

    try {
      const response = await postUpdateRating({
        rating: starValue,
        slug,
      });
      console.log("Rating submitted successfully:", response);
      alert("Thank you for your rating!");
    } catch (error) {
      console.error("Error submitting rating:", error.message);
      alert("Failed to submit rating. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex items-center space-x-1">
      {[...Array(totalStars)].map((_, index) => {
        const starValue = index + 1;
        return (
          <span
            key={index}
            onClick={() => handleStarClick(starValue)} // Submit rating on star click
            onMouseEnter={() => setHover(starValue)} // Highlight on hover
            onMouseLeave={() => setHover(null)} // Reset hover state
            className={`cursor-pointer ${
              isSubmitting ? "cursor-not-allowed" : ""
            }`}
          >
            {starValue <= (hover || rating) ? (
              <FaStar className="text-yellow-500 text-xl" />
            ) : (
              <FaRegStar className="text-yellow-500 text-xl" />
            )}
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
