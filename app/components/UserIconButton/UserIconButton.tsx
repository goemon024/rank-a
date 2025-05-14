"use client";

import styles from "./UserIconButton.module.css";
import Image from "next/image";
// import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";


interface UserIconButtonProps {
  userId: number | undefined;
  imagePath: string | null;
}

export const UserIconButton = ({ userId, imagePath }: UserIconButtonProps) => {
  // const auth = useAuth();
  const router = useRouter();
  const src = imagePath ? imagePath.replace("https://https://", "https://")
    : "/profile_default.jpg";
  console.log("imagePath", imagePath);

  const goToProfile = (userId: number | undefined) => {
    if (userId === undefined || userId === null) {
      return;
    }
    router.push(`/profile/${userId}`);
  };

  return (
    <button
      className={styles.userIconButton}
      onClick={(e) => {
        e.preventDefault();
        goToProfile(userId);
      }}
    >
      <Image
        className={styles.userIcon}
        src={src}
        alt="User Icon"
        width={30}
        height={30}
        priority={true}
        loading="eager"
        sizes="30px"
      />
    </button>
  );
};

export default UserIconButton;
