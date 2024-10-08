"use client";
import React from "react";
import { Button } from "./ui/button";
import { ModeToggle } from "./ModeToggle";

const NavBar = () => {
  return (
    <nav className="flex items-center justify-between gap-12 p-5 bg-secondary">
      <h3 className="text-2xl font-semibold tracking-tight scroll-m-20">
        Hilo
      </h3>
      <div className="hidden gap-12 md:flex">
        <a
          className="text-sm md:text-base hover:cursor-pointer hover:underline"
          href="/"
        >
          Home
        </a>
        <a
          className="text-sm md:text-base hover:cursor-pointer hover:underline"
          href="/about"
        >
          About
        </a>
        <a
          className="text-sm md:text-base hover:cursor-pointer hover:underline"
          href="/contactus"
        >
          Contact
        </a>
      </div>
      <div>
        <ModeToggle />
      </div>
    </nav>
  );
};

export default NavBar;
