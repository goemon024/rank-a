import { useState, useEffect } from "react";
import { Chip } from "@mui/material";
import styles from "./Forms.module.css";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { TAGS } from "@/constants";

export default function TagSelector({
  onChange,
  tags,
}: {
  onChange: (indexes: number[]) => void;
  tags?: number[];
}) {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  const hundleChange = (_event: React.SyntheticEvent, newValue: string[]) => {
    setSelectedTags(newValue);

    const selectedIndexes = newValue
      .map((tag: string) => TAGS.indexOf(tag))
      .filter((index) => index !== -1);

    onChange(selectedIndexes);
  };

  useEffect(() => {
    if (tags) {
      const selected = tags.map((index) => TAGS[index]).filter(Boolean);
      setSelectedTags(selected);
    }
  }, [tags]);

  return (
    <div>
      <label className={styles.label} htmlFor="TagInput">
        タグを入力：
      </label>
      <Autocomplete
        multiple
        freeSolo
        options={TAGS}
        value={selectedTags}
        onChange={hundleChange}
        renderTags={(value: readonly string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip
              label={option}
              color="primary"
              variant="filled"
              {...getTagProps({ index })}
              key={option}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            placeholder="例: React, Prisma..."
            className={styles.TagInput}
          />
        )}
      />
    </div>
  );
}

//   const [selected, setSelected] = useState<number[]>([]);

//   const toggleTag = (index: number) => {
//     const newSelected = selected.includes(index)
//       ? selected.filter((i) => i !== index)
//       : [...selected, index];

//     setSelected(newSelected);
//     onChange(newSelected);
//   };

//   return (
//     <div>
//       <label className={styles.label}>タグ : </label>
//       <Stack direction="row" spacing={2} flexWrap="wrap">
//         {TAGS.map((tag, index) => {
//           const isSelected = selected.includes(index);
//           return (
//             <Chip
//               key={index}
//               label={tag}
//               clickable
//               onClick={() => toggleTag(index)}
//               color={isSelected ? "primary" : "default"}
//               variant={isSelected ? "filled" : "outlined"}
//               sx={{
//                 fontSize: "1.0rem",
//                 padding: "3px 5px",
//                 margin: "3px",
//                 bgcolor: isSelected ? "primary.main" : "grey.300", // ← 背景色
//                 color: isSelected ? "white" : "black", // ← 文字色
//               }}
//             />
//           );
//         })}
//       </Stack>
//     </div>
//   );
// }
