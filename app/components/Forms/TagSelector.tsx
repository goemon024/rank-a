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
      .map((tag: string) => TAGS.indexOf(tag as (typeof TAGS)[number]))
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
        タグを選択（１つ以上）：
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
