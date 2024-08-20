"use client";
import { Button } from "@/components/ui/button";
import React from "react";

type Props = {
  title?: string;
  message?: string;
  onTryAgain?: () => void;
};

const Error = ({
  title = "An Error Occurred",
  message = "We encountered an issue while processing your request. Please try again later. We appreciate your patience and understanding.",
  onTryAgain = () => window.location.reload(),
}: Props) => {
  return (
    <div className="bg-destructive p-10 rounded">
      <h1 className="text-2xl mb-2 font-bold">{title}</h1>
      <p className="mb-4">{message}</p>
      <Button onClick={onTryAgain}>Try Again</Button>
    </div>
  );
};

export default Error;
