"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/app/components/Header/Header";
import { User } from "@prisma/client";
import { getLinksProfile } from "@/constants";
import styles from "../Profile.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
    const params = useParams();
    const userId = params.id as string;
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const links = getLinksProfile(userId);
    const { isAuthenticated, user: authUser, setUser: setAuthUser } = useAuth();
    const [isLoading, setIsLoading] = useState(true);
    //   const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>("");

    // const [loading, setLoading] = useState(true)
    // const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        // アラートが出ているが正常。
        if (!authUser || authUser?.userId !== parseInt(userId, 10)) {
            router.push("/home");
        }
    }, [isAuthenticated, router, userId]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setIsLoading(true);
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
                setIsLoading(false);
            } catch (err: unknown) {
                // eslint-disable-next-line no-console
                console.error("ユーザー情報の取得に失敗しました:", err);
                // setError(err.message)
            }
        };
        fetchUser();
    }, [userId, authUser]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData(event.target as HTMLFormElement);

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                if (res.status === 409) {
                    setErrorMessage(data.error || "プロフィールの更新に失敗しました");
                }
                throw new Error(data.error || "プロフィールの更新に失敗しました");
            }

            const data = await res.json();
            setUser(data);
            setErrorMessage("");
            setAuthUser(data);
        } catch (err: unknown) {
            // eslint-disable-next-line no-console
            console.error("プロフィールの更新に失敗しました:", err);
        }
    };

    const ProfileContent = (
        <form
            className={styles.ProfileContainer}
            onSubmit={handleSubmit}
            encType="multipart/form-data"
        >
            <div className={styles.ImageContainer}>
                <label>
                    <p>プロフィール画像</p>
                    <img
                        className={styles.ProfileImage}
                        src={user?.imagePath || "/profile_default.jpg"}
                        alt="User Icon"
                        loading="eager"
                        sizes="30px"
                    />
                    <input type="file" name="imagePath" accept="image/*" hidden />
                </label>
            </div>

            <div className={styles.ProfileSection}>
                <h3>プロフィール編集</h3>
                {errorMessage && <div className={styles.alert}>{errorMessage}</div>}
                <label>
                    ユーザー名:
                    <input
                        type="text"
                        name="username"
                        defaultValue={user?.username || ""}
                    />
                </label>
                <label>
                    Email:
                    <input type="email" name="email" defaultValue={user?.email || ""} />
                </label>
                <label>
                    自己紹介:
                    <textarea name="introduce" defaultValue={user?.introduce || ""} />
                </label>
                {user?.createdAt && (
                    <p>登録日: {new Date(user.createdAt).toLocaleDateString()}</p>
                )}

                <div className={styles.ButtonGroup}>
                    <button type="submit" className={styles.updateButton}>
                        プロフィールを更新する
                    </button>
                    <button
                        type="button"
                        // onClick={() => setShowPasswordModal(true)}
                        className={styles.passwordButton}
                    >
                        パスワードを変更する
                    </button>
                </div>
            </div>
        </form>
    );

    return (
        <div>
            <Header links={links} />
            {isLoading ? (
                <div className={styles.LoadingContainer}>
                    <p className={styles.Blink}>Loading...</p>
                </div>
            ) : (
                ProfileContent
            )}
        </div>
    );
}
