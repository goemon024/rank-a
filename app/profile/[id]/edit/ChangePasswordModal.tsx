import React, { useState } from "react";
import styles from "../Profile.module.css";
import { useParams } from "next/navigation";

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

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            setError("新しいパスワードが一致しません");
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
        } catch (err: unknown) {
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
                <form>
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
                        新しいパスワード
                        <input
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
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

                    {error && <p className="error">{error}</p>}
                    {success && <p className="success">{success}</p>}

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
