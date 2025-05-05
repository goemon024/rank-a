"use client"
import React, { useState } from "react";
import { Box, Chip } from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { TAGS } from "@/constants";
import styles from "./SorterFilter.module.css";

type TagSelectorProps = {
    onChange: (indexes: number[]) => void;
}

export default function TagSelector({ onChange }: TagSelectorProps) {

    const [selectedTags, setSelectedTags] = useState<string[]>([]);

    const handleTagChange = (_event: React.SyntheticEvent, newValue: string[]) => {
        setSelectedTags(newValue);

        const selectedIndexes = newValue
            .map((tag: string) => TAGS.indexOf(tag))
            .filter((index) => index !== -1);

        onChange(selectedIndexes);
    };

    return (
        <div>
            <Autocomplete
                multiple
                freeSolo
                options={TAGS}
                value={selectedTags}
                onChange={handleTagChange}
                renderTags={() => null}
                renderInput={(params) => (
                    <TextField
                        className={styles.TagInput}
                        {...params}
                        placeholder="例: React, Prisma..."
                    />
                )}
            />
            <Box
                sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 1,
                    mt: 2,
                }}
            >
                {selectedTags.map((option) => (
                    <Chip
                        className={styles.TagChip}
                        label={option}
                        color="primary"
                        variant="filled"
                        key={option}
                        onDelete={() => {
                            const newTags = selectedTags.filter((tag) => tag !== option);
                            setSelectedTags(newTags);
                            onChange(newTags.map((tag: string) => TAGS.indexOf(tag))
                                .filter((index: number) => index !== -1));
                        }}
                    />
                ))}
            </Box>
        </div>
    );
}

