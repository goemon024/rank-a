"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./signin.module.css";
import Link from "next/link";
import { GetStrength } from "../components/PasswordStrength";
import { useAuth } from "@/contexts/AuthContext";
import { jwtDecode } from "jwt-decode";
import { UserPayload } from "@/types/auth";
import { signinSchema } from "@/schemas/signinSchema";

export default function LoginPage() {
  // const [identifier, setIdentifier] = useState('')
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const { setUser } = useAuth();
  const passwordStrength = GetStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const usernameOrEmail = username || email;

    const validationResult = signinSchema.safeParse({
      usernameOrEmail,
      password,
    });
    if (!validationResult.success) {
      setError(validationResult.error.errors[0].message);
      return;
    }

    try {
      const res = await fetch("/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usernameOrEmail, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "ログインに失敗しました");
        return;
      }

      localStorage.setItem("token", data.token);
      // ログイン時のユーザー情報反映
      const decoded = jwtDecode<UserPayload>(data.token);
      setUser(decoded);
      router.push("/");
    } catch (error: unknown) {
      console.error("ログインエラー:", error);
      setError("エラーが発生しました");
    }
  };

  return (
    <div className={styles.signinContainer}>
      <h1 className={styles.signinHeader}>sign in</h1>
      <form className={styles.signinForm} onSubmit={handleSubmit}>
        <p className={styles.signinDescription}>
          アカウントをお持ちでない方は
          <Link href="/signup" className={styles.signinLink}>
            新規登録
          </Link>
          へ
        </p>
        <p className={styles.signinDescription}>
          ログインは、ユーザ名又はEmailとパスワードを入力ください
        </p>
        <div className={styles.formGroup}>
          <p className={styles.formLabel}>ユーザー名</p>
          <input
            className={styles.formInput}
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ユーザー名"
            disabled={email.length > 0}
          />
        </div>
        <div className={styles.formGroup}>
          <p className={styles.formLabel}>Email</p>
          <input
            className={styles.formInput}
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            disabled={username.length > 0}
          />
        </div>

        <div className={styles.formGroup}>
          <div>
            <p className={styles.formLabel}>
              パスワード
              <span>{passwordStrength}</span>
            </p>
          </div>
          <input
            className={styles.formInput}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="パスワード"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button className={styles.signinButton} type="submit">
          ログイン
        </button>
      </form>
    </div>
  );
}
