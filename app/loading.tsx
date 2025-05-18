"use client";

import { HashLoader } from "react-spinners";

export default function loading() {
  return (
    <div className="justify-center flex items-center h-screen">
      <HashLoader color="#d4af37" />
    </div>
  );
}
