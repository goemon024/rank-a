"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/app/components/Header/Header";
import { User } from "@prisma/client";
import { getLinksProfile } from "@/constants";
import styles from "../Profile.module.css";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import ChangePasswordModal from "./ChangePasswordModal";

import { imageUploadSchema } from "@/schemas/imageUploadSchema";
import { profileSchema } from "@/schemas/profileSchema";

export default function ProfileEditPage() {
  const params = useParams();
  const userId = params.id as string;
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const { isAuthenticated, user: authUser, setUser: setAuthUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const links = getLinksProfile(
    userId,
    String(authUser?.userId) === userId
  );

  // const [loading, setLoading] = useState(true)
  // const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!authUser || String(authUser?.userId) !== userId) {
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

    const file = formData.get("imagePath") as File | null;
    if (file && file.size > 0) {
      // 画像バリデーションチェック
      const result = imageUploadSchema.safeParse(file);
      if (!result.success) {
        setErrorMessage(result.error.errors[0].message);
        return;
      }
    }

    const profileData = {
      username: formData.get("username") as string,
      email: formData.get("email") as string,
      introduce: formData.get("introduce") as string,
    };

    // プロフィールバリデーションチェック
    const result = profileSchema.safeParse(profileData);
    if (!result.success) {
      setErrorMessage(result.error.errors[0].message);
      return;
    }

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
          return;
        }
        throw new Error(data.error || "プロフィールの更新に失敗しました");
      }

      const data = await res.json();
      setUser(data);
      setErrorMessage("");
      setPreviewImage(null);

      // --- ここから exp を取得して setAuthUser ---
      let exp: number | undefined = undefined;
      if (token) {
        const decoded: { exp?: number } = jwtDecode(token);
        exp = decoded.exp;
      }

      // userPayloadと同一オブジェクトを作成
      setAuthUser({
        userId: String(userId),
        username: data.username,
        imagePath: data.imagePath,
        role: data.role,
        exp: exp ?? 0,
      });

      router.push(`/profile/${userId}`);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error("プロフィールの更新に失敗しました:", err);
      setErrorMessage("プロフィールの更新に失敗しました");
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setErrorMessage("画像を選択してください");
      return;
    }

    const result = imageUploadSchema.safeParse(file);
    if (!result.success) {
      setErrorMessage(result.error.errors[0].message);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(file);
    setErrorMessage("");
  };

  const ProfileContent = (
    <form
      className={styles.ProfileContainer}
      onSubmit={handleSubmit}
      encType="multipart/form-data"
    >
      <div className={styles.ProfileImageContainer}>
        <label>
          <img
            className={styles.ProfileImageEdit}
            src={previewImage || user?.imagePath || "/profile_default.jpg"}
            alt="User Icon"
            loading="eager"
            sizes="30px"
          />
          <input
            id="file-upload"
            type="file"
            name="imagePath"
            accept="image/*"
            onChange={handleImageChange}
            hidden
          />
        </label>
        <label htmlFor="file-upload" className={styles.fileUploadLabel}>
          ファイル選択
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
          <input type="text" name="email" defaultValue={user?.email || ""} />
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
            プロフィール更新
          </button>
          <button
            type="button"
            onClick={() => setShowPasswordModal(true)}
            className={styles.passwordButton}
          >
            パスワード変更
          </button>

          {showPasswordModal && (
            <ChangePasswordModal onClose={() => setShowPasswordModal(false)} />
          )}
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
