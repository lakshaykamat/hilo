"use client";
import React, { useState } from "react";
import { Search, X } from "lucide-react"; // Adding a clear (X) icon
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

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
      className="flex items-center justify-between pt-3 bg-card px-7 gap-2"
    >
      <div className="relative flex items-center w-full">
        <Input
          onChange={(e) => setInputSearchText(e.target.value)}
          type="text"
          value={inputSearchText}
          placeholder="Search people's..."
          className="rounded-lg px-3 w-full"
        />
        {inputSearchText && (
          <X
            className="absolute right-4 cursor-pointer text-muted"
            onClick={clearSearch} // Clear the input field
          />
        )}
      </div>
      <Button
        disabled={inputSearchText ? false : true}
        type="submit"
        className="px-5"
        variant={"outline"}
        size={"sm"}
      >
        <Search className="w-3 h-3 mr-2" />
        <span>Search</span>
      </Button>
    </form>
  );
};

export default TopBar;
