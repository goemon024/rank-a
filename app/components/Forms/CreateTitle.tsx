"use client";
import React, { useState } from "react";
import styles from "./Forms.module.css";

type CreateTitleProps = {
  title: string;
  setTitle: (value: string) => void;
};

const CreateTitle: React.FC<CreateTitleProps> = ({ title, setTitle }) => {
  const [overText, setOverText] = useState<boolean>(false);

  const handleInputTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputText = e.target.value;
    if (inputText.length > 50) {
      setOverText(true);
      setTitle(inputText);
    } else {
      setOverText(false);
      setTitle(inputText);
    }
  };

  return (
    <div>
      {overText ? (
        <label className={styles.labelRed} htmlFor="TitleInput">
          50文字を超えています
        </label>
      ) : (
        <label className={styles.label} htmlFor="TitleInput">
          タイトル :{" "}
        </label>
      )}
      <input
        id="TitleInput"
        className={styles.TitleInput}
        type="text"
        name="title"
        maxLength={100}
        value={title}
        placeholder="[タイトル]：問題の要点を1行で書いてください"
        onChange={handleInputTitle}
      ></input>
    </div>
  );
};
export default CreateTitle;
