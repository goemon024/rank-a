import { useState } from "react"
import { Chip, Stack } from "@mui/material"
import styles from "./Forms.module.css"
const TAGS = ["React", "Next.js", "Prisma",
  "TypeScript", "Python", "CSS", "HTML",
  "Node.js", "Express", "Django", "Vue",
  "Svelte", "Ruby", "Java", "SQL"]

export default function TagSelector({ onChange }: { onChange: (selected: string[]) => void }) {
  const [selected, setSelected] = useState<string[]>([])

  const toggleTag = (tag: string) => {
    const newSelected = selected.includes(tag)
      ? selected.filter(t => t !== tag)
      : [...selected, tag]

    setSelected(newSelected)
    onChange(newSelected)
  }

  return (
    <div>
      <label className={styles.label}>タグ :{" "}</label>
      <Stack direction="row" spacing={2} flexWrap="wrap">
        {TAGS.map(tag => {
          const isSelected = selected.includes(tag)
          return (
            <Chip
              key={tag}
              label={tag}
              clickable
              onClick={() => toggleTag(tag)}
              color={selected.includes(tag) ? "primary" : "default"}
              variant={selected.includes(tag) ? "filled" : "outlined"}
              sx={{
                fontSize: '1.0rem',
                padding: '3px 5px',
                margin: '3px',
                bgcolor: isSelected ? 'primary.main' : 'grey.300', // ← 背景色
                color: isSelected ? 'white' : 'black',             // ← 文字色
              }}
            />
          )
        })}
      </Stack>
    </div>
  )
}
