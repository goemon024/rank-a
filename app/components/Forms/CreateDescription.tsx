"use client";
import React, { useState } from "react";
import styles from "./Forms.module.css";

type CreateDescriptionProps = {
    description: string;
    setDescription: (value: string) => void;
};

const CreateDescription: React.FC<CreateDescriptionProps> = ({ description, setDescription }) => {
    const [overText, setOverText] = useState<boolean>(false);

    const handleInputContent = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const inputText = e.target.value;
        if (inputText.length > 2000) {
            setOverText(true);
            setDescription(inputText);
        } else {
            setOverText(false);
            setDescription(inputText);
        }
    };

    return (
        <div className={styles.container1}>
            {overText ? (
                <label className={styles.labelRed} htmlFor="DescriptionInput">
                    2000文字を超えています。
                </label>
            ) : (
                <label className={styles.label} htmlFor="DescriptionInput">
                    本文 :{" "}
                </label>
            )}

            <textarea
                className={styles.DescriptionInput}
                id="DescriptionInput"
                name="description"
                maxLength={2000}
                value={description}
                placeholder="質問の本文を入力してください"
                onChange={handleInputContent}
            />
        </div>
    );
};

export default CreateDescription;
