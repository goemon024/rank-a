// app/signup/page.tsx

"use client";
import { useState, FormEvent, useEffect } from "react";

import { useRouter } from "next/navigation";
import styles from "./signUp.module.css";
import Link from "next/link";
import {
  PasswordStrength,
  isPasswordStrong,
} from "../components/PasswordStrength";
import { EmailWarning, isValidEmail } from "../components/EmailWarning";
// import { signIn } from 'next-auth/react'

export default function SignUpPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const isConfirmPasswordValid =
    password === confirmPassword && confirmPassword !== "";
  const canSubmit =
    isValidEmail(email) && isPasswordStrong(password) && isConfirmPasswordValid;

  useEffect(() => {
    const getToken = async () => {
      if (window.grecaptcha && process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY) {
        const token = await window.grecaptcha.execute(
          process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY,
          { action: "submit" },
        );
        setRecaptchaToken(token);
      }
    };
    getToken();
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("パスワードが一致しません");
      return;
    }

    if (!recaptchaToken) {
      setMessage("reCAPTCHAを完了してください");
      return;
    }

    const res = await fetch("/api/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-recaptcha-token": recaptchaToken,
      },
      body: JSON.stringify({ username, email, password }),
    });

    const data = await res.json();

    if (data.success) {
      setMessage("登録成功！扉ページへ");
      setTimeout(() => {}, 2000);
      const usernameOrEmail = email;

      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      if (res?.ok) {
        localStorage.setItem("token", data.token);
        router.push("/"); // ログイン後のリダイレクト先
      } else {
        setMessage("ログインに失敗しました");
      }
    } else {
      setMessage(data.error ?? "登録に失敗しました");
    }
  };

  return (
    <div className={styles.signupContainer}>
      <h1 className={styles.signupHeader}>サインアップ</h1>

      <p className={styles.signupDescription}>
        既にアカウントをお持ちの方は
        <Link href="/signin" className={styles.signupLink}>
          ログインへ
        </Link>
      </p>
      <p className={styles.signupDescription}>
        パスワードは8文字以上で、大文字、小文字、数字、記号の2種類以上を使用してください
      </p>
      <form onSubmit={handleSubmit} className={styles.signupForm}>
        <div>
          <input
            type="text"
            placeholder="ユーザー名"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className={styles.formInput}
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="メールアドレス"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.formInput}
          />
          <EmailWarning email={email} />
        </div>
        <div>
          <input
            type="password"
            placeholder="パスワード"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className={styles.formInput}
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="パスワード確認"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={8}
            className={styles.formInput}
          />
        </div>
        <PasswordStrength password={password} />
        <button
          type="submit"
          className={`${styles.signupButton} ${canSubmit ? styles.disabled : ""}`}
          disabled={!canSubmit}
        >
          登録する
        </button>
      </form>
      {message && (
        <p
          className={`mt-4 text-center ${message.includes("成功") ? "text-green-600" : "text-red-600"}`}
        >
          {message}
        </p>
      )}
    </div>
  );
}
