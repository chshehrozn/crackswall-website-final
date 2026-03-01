"use client";
import Image from "next/image";

export default function CommentsList({ key, comt }) {
  return (
    <div key={key} className="flex gap-6">
      <div className="w-[25px]">
        <Image
          src="/images/avatar.png"
          alt="logo of software"
          width={25}
          height={25}
        />
      </div>
      <div className="flex flex-col gap-4 w-full">
        <h3 className="text-lg text-[#2b373a]">{comt?.name || ""}</h3>
        {/* <span className=""> {moment(comt?.created_at).format("MMM DD, YYYY")}</span> */}
        <p className="text-sm text-[#666] font-normal">{comt?.comment || ""}</p>
      </div>
    </div>
  );
}
