import { useState } from "react";
import { Chip, Stack } from "@mui/material";
import styles from "./Forms.module.css";

const TAGS = [
  "Python",
  "SQL",
  "React",
  "Next.js",
  "Prisma",
  "TypeScript",
  "CSS",
  "HTML",
  "Node.js",
  "Express",
  "Django",
  "Vue",
  "Svelte",
  "Ruby",
  "Java",
];

export default function TagSelector({
  onChange,
}: {
  onChange: (selected: number[]) => void;
}) {
  const [selected, setSelected] = useState<number[]>([]);

  const toggleTag = (index: number) => {
    const newSelected = selected.includes(index)
      ? selected.filter((i) => i !== index)
      : [...selected, index];

    setSelected(newSelected);
    onChange(newSelected);
  };

  return (
    <div>
      <label className={styles.label}>タグ : </label>
      <Stack direction="row" spacing={2} flexWrap="wrap">
        {TAGS.map((tag, index) => {
          const isSelected = selected.includes(index);
          return (
            <Chip
              key={index}
              label={tag}
              clickable
              onClick={() => toggleTag(index)}
              color={isSelected ? "primary" : "default"}
              variant={isSelected ? "filled" : "outlined"}
              sx={{
                fontSize: "1.0rem",
                padding: "3px 5px",
                margin: "3px",
                bgcolor: isSelected ? "primary.main" : "grey.300", // ← 背景色
                color: isSelected ? "white" : "black", // ← 文字色
              }}
            />
          );
        })}
      </Stack>
    </div>
  );
}
