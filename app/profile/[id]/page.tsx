"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/app/components/Header/Header";
import { User } from "@prisma/client";
import { LINKS_HOME } from "@/constants";

// const items: NavLinks[] = [
//   { label: '投稿質問一覧', href: '/home' },
//   { label: '投稿回答一覧', href: '/home/popular' },
// ]

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<User | null>(null);

  // const [loading, setLoading] = useState(true)
  // const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          const data = await res.json();
          throw new Error(data.error || "ユーザー情報の取得に失敗しました");
        }

        const data = await res.json();
        setUser(data);
      } catch (err: unknown) {
        // eslint-disable-next-line no-console
        console.error("ユーザー情報の取得に失敗しました:", err);
        // setError(err.message)
      } finally {
        // setLoading(false)
      }
    };

    fetchUser();
  }, [userId]);

  return (
    <div>
      <Header links={LINKS_HOME} />
      <div style={{ padding: "1rem" }}>
        <h1>{user?.username} さんのプロフィール</h1>
        <p>Email: {user?.email}</p>
        {user?.imagePath && (
          <img
            src={user?.imagePath}
            alt={`${user?.username}のプロフィール画像`}
            style={{ width: "120px", borderRadius: "50%" }}
          />
        )}
        {user?.createdAt && (
          <p>登録日: {new Date(user.createdAt).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );
}
