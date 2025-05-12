"use client";
import React, { useState, useRef } from "react";
import styles from "./Forms.module.css";
import { MarkdownToolbar } from "../Button/MarkdownToolbar";

type CreateDescriptionProps = {
  description: string;
  setDescription: (value: string) => void;
};

const CreateDescription: React.FC<CreateDescriptionProps> = ({
  description,
  setDescription,
}) => {
  const [overText, setOverText] = useState<boolean>(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

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
      <div className={styles.container2}>
        {overText ? (
          <label className={styles.labelRed} htmlFor="DescriptionInput">
            2000文字を超えています。
          </label>
        ) : (
          <label className={styles.label} htmlFor="DescriptionInput">
            本文 :{" "}
          </label>
        )}
        <MarkdownToolbar
          content={description}
          setContent={setDescription}
          textareaRef={textareaRef}
        />
      </div>
      <div></div>
      <textarea
        className={styles.DescriptionInput}
        id="DescriptionInput"
        name="description"
        maxLength={2000}
        value={description}
        placeholder="質問の本文を入力してください"
        onChange={handleInputContent}
        ref={textareaRef}
      />
    </div>
  );
};

export default CreateDescription;
