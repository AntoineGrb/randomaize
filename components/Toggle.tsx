import React from "react";

interface ToggleProps {
  value: number;
  onChange: (value: number) => void;
  options: number[];
}

export default function Toggle({ value, onChange, options }: ToggleProps) {
  return (
    <div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
      {options.map((option) => (
        <button
          key={option}
          onClick={() => onChange(option)}
          style={{
            padding: "10px 20px",
            fontSize: "14px",
            border: "1px solid black",
            backgroundColor: value === option ? "black" : "white",
            color: value === option ? "white" : "black",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          {option}
        </button>
      ))}
    </div>
  );
}
