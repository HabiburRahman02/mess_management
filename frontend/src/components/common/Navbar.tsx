"use client";

import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-blue-600 text-white shadow-md">
      {/* Left: Logo */}
      <div className="flex items-center space-x-2">
        {/* <Image
          src="/logo.png" 
          alt="Mess Logo"
          width={40}
          height={40}
          className="rounded-full"
        /> */}
        <span className="font-bold text-lg">Mess Management</span>
      </div>

      {/* Right: Links */}
      <div className="flex space-x-6">
        <Link href="/members" className="hover:text-gray-200 transition">
          Members
        </Link>
          <Link href="/deposits" className="hover:text-gray-200 transition">
          Deposits
        </Link>
        <Link href="/meals" className="hover:text-gray-200 transition">
          Meals
        </Link>
      </div>
    </nav>
  );
}
