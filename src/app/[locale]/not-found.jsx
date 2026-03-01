// import Link from "next/link";
import ButtonLink from "@/components/ButtonLink";
import SearchBox from "@/components/SearchBox";

export default function NotFound() {
  return (
    <div className="search-box-com flex flex-col items-center justify-center gap-4 min-h-screen bg-[#EBEEF2]">
      <h1 className="text-2xl font-medium text-gray-800 text-center mb-4">
        Nothing was found at this location.
        <br /> Maybe try a search?
      </h1>
      <SearchBox />
      <ButtonLink label={"< Go Back to Home"} href="/" />
    </div>
  );
}
