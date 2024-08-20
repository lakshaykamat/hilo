"use client";
import React, { useState } from "react";
import { Search, X } from "lucide-react"; // Adding a clear (X) icon
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";

const TopBar = () => {
  const router = useRouter();
  const [inputSearchText, setInputSearchText] = useState("");

  const goSearch = (e: any) => {
    e.preventDefault(); // prevent page reload
    if (inputSearchText.trim()) {
      router.push(`/search?q=${inputSearchText}`);
    }
  };

  const clearSearch = () => {
    setInputSearchText("");
  };

  return (
    <form
      onSubmit={goSearch}
      className="flex items-center justify-between pt-3 bg-card px-7 gap-5"
    >
      <div className="relative flex items-center w-full">
        <Input
          onChange={(e) => setInputSearchText(e.target.value)}
          type="text"
          value={inputSearchText}
          placeholder="Search..."
          className="rounded-full px-5 py-3 w-full" // Make input larger for better UX
        />
        {inputSearchText && (
          <X
            className="absolute right-4 cursor-pointer text-muted"
            onClick={clearSearch} // Clear the input field
          />
        )}
      </div>
      <button type="submit" className="ml-3">
        <Search />
      </button>
    </form>
  );
};

export default TopBar;
