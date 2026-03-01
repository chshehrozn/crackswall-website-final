"use client";

import React, { useState } from "react";
import { postCreateComment } from "@/utils/apis";

export default function CommentFrom({ data }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    comment: "",
  });
  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    if (!data?.data?.id) {
      console.error("No blog ID provided");
      return;
    }

    try {
      const response = await postCreateComment({
        formData,
        id: data?.data?.id, // Use the "data" prop here without conflict
      });
      console.log("What is post response:", response);

      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        comment: "",
      });
    } catch (error) {
      console.error("Error submitting comment:", error.message);
      alert("Failed to post comment. Please try again later.");
    }
  };
  return (
    <form onSubmit={onSubmitForm} className="flex flex-col w-full gap-4">
      <div className="w-full grid md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-4">
        <div className="flex flex-col w-full gap-1">
          <label className="text-sm text-[#666] font-medium ">Name *</label>
          <input
            type="text"
            name="name"
            required
            placeholder="Name"
            value={formData.name}
            onChange={handleInput}
            className="text-base font-normal bg-transparent border border-solid border-[#ebebeb] rounded p-2 focus:border-teal-600 anim"
          />
        </div>
        <div className="flex flex-col w-full gap-1">
          <label className="text-sm text-[#666] font-medium ">Email *</label>
          <input
            type="email"
            name="email"
            required
            placeholder="Email"
            value={formData.email}
            onChange={handleInput}
            className="text-base font-normal bg-transparent border border-solid border-[#ebebeb] rounded p-2 focus:border-teal-600 anim"
          />
        </div>
      </div>
      <div className="flex flex-col w-full gap-1">
        <label className="text-sm text-[#666] font-medium ">Message *</label>
        <textarea
          type="text"
          name="comment"
          required
          value={formData.comment}
          onChange={handleInput}
          placeholder="Write your comment here..."
          className="text-base font-normal bg-transparent border border-solid border-[#ebebeb] rounded p-2 focus:border-teal-600 anim min-h-[200px] max-h-[200px]"
        />
      </div>
      <button
        type="submit"
        className="buttonPrimary !p-3 !px-5 font-semibold text-2xl !w-max !bg-teal-700"
      >
        Post Comment
      </button>
      {/* <input
        type="submit"
        value={"Post Comment"}
        // value={response.isLoading ? "Loading..." : "Post Comment"}
        className="buttonPrimary !p-3 !px-5 font-semibold text-2xl !w-max !bg-teal-700"
      /> */}
    </form>
  );
}
