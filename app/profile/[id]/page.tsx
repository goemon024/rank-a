"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/app/components/Header/Header";
import { User } from "@prisma/client";
import { getLinksProfile } from "@/constants";
import styles from "./Profile.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const params = useParams();
  const userId = params.id as string;
  const [user, setUser] = useState<User | null>(null);
  const links = getLinksProfile(userId);
  const { isAuthenticated, user: authUser } = useAuth();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setIsLoading(true);
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
        setIsLoading(false);
        setUser(data);
      } catch (err: unknown) {
        // eslint-disable-next-line no-console
        console.error("ユーザー情報の取得に失敗しました:", err);
        router.push("/home");
      } finally {
      }
    };

    fetchUser();
    console.log(authUser?.imagePath);
  }, [userId, authUser]);

  const ProfileContent = (
    <div className={styles.ProfileContainer}>
      <div className={styles.ProfileImageContainer}>
        {user?.imagePath && (
          <img
            src={user?.imagePath}
            alt={`${user?.username}のプロフィール画像`}
            className={styles.ProfileImage}
          />
        )}
      </div>
      <div className={styles.ProfileSection}>
        <div className={styles.ProfileAndEmailAndBotton}>
          <div className={styles.ProfileAndEmail}>
            <h3>{user?.username} さんのプロフィール</h3>
            {isAuthenticated ? <p>Email: {user?.email}</p> : <p>Email: ******</p>}
          </div>
          {String(authUser?.userId) === userId ? (
            <button className={styles.editButton} onClick={() => {
              router.push(`/profile/${userId}/edit`);
            }}>編集</button>
          ) : (
            <button className={styles.disabledEditButton}>編集</button>
          )}
        </div>
        <p className={styles.Introduce}>infomation: {user?.introduce}</p>
        {user?.createdAt && (
          <p>登録日: {new Date(user.createdAt).toLocaleDateString()}</p>
        )}
      </div>
    </div>
  );

  return (
    <div>
      <Header links={links} />
      {isLoading ? (
        <div className={styles.LoadingContainer}>
          <p className={styles.Blink}>Loading...</p>
        </div>
      ) : (ProfileContent)

        // : String(authUser?.userId) === userId ? (
        //   <Link href={`/profile/${userId}/edit`}>{ProfileContent}</Link>
        // ) : (
        // //   ProfileContent
        // )
      }
    </div>
  );
}
