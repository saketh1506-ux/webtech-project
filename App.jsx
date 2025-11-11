import React from "react";
import Landing from "./components/Landing";
import Builder from "./components/Builder";

export default function App() {
  return (
    <div>
      <Landing />
      {/* The Landing component opens Builder in a new tab or route */}
    </div>
  );
}
