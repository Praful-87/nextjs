"use client";

import { useState } from "react";

export default function Demo() {
  const [count, setCount] = useState(0);

  console.log("Render:", count);

  return (
    <div className="p-8">
      <h1 className="text-3xl">{count}</h1>

      <button
        className="mt-4 rounded bg-blue-600 px-4 py-2 text-white"
        onClick={() => {
          console.log(count);

          setCount(count + 1);

          console.log(count);
        }}
      >
        Increase
      </button>
    </div>
  );
}
