import React, { useState } from "react";
import styles from "../Profile.module.css";
import { useParams } from "next/navigation";
import { getPasswordScore, changePasswordSchema } from "@/schemas/passswordSchema";

type Props = {
    onClose: () => void;
};

const ChangePasswordModal: React.FC<Props> = ({ onClose }) => {
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const params = useParams();
    const userId = params.id as string;

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [passwordScore, setPasswordScore] = useState(0);

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("新しいパスワードが一致しません");
            return;
        }

        const result = changePasswordSchema.safeParse({
            currentPassword,
            newPassword,
            confirmPassword,
        });

        if (!result.success) {
            setError(result.error.errors[0].message);
            return;
        }

        try {
            const token = localStorage.getItem("token");
            const res = await fetch(`/api/users/${userId}/change-password`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                    confirmPassword,
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "パスワード変更に失敗しました");
            }

            setSuccess("パスワードを変更しました");
            setError("");
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (err) {
            setSuccess("");
            setError(err instanceof Error ? err.message : "エラーが発生しました");
        }
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className={styles.modalOverlay} onClick={handleOverlayClick}>
            <div className={styles.modalContent}>
                <h2>パスワード変更</h2>
                {error && <p className={styles.alert}>{error}</p>}
                {success && <p className={styles.success}>{success}</p>}
                <form onSubmit={handlePasswordSubmit}>
                    <label>
                        現在のパスワード
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                        />
                    </label>
                    <label>
                        新しいパスワード（スコア: {passwordScore}）
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => {
                                setNewPassword(e.target.value);
                                setPasswordScore(getPasswordScore(e.target.value));
                            }}
                            required
                        />
                    </label>
                    <label>
                        新しいパスワード（確認）
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                        />
                    </label>

                    <div className={styles.buttonGroup}>
                        <button type="button" onClick={handlePasswordSubmit}>変更する</button>
                        <button type="button" onClick={onClose}>キャンセル</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
