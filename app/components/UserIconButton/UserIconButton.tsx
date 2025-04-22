import styles from "./UserIconButton.module.css";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface UserIconButtonProps {
  userId: string | undefined
}

export const UserIconButton = ({ userId }: UserIconButtonProps) => {
  const auth = useAuth();
  const router = useRouter();
  const imagePath = auth.user?.imagePath;

  const goToProfile = (userId: string | undefined) => {
    router.push(`/profile/${userId}`);
  };

  return (
    <button className={styles.userIconButton} onClick={() => goToProfile(userId)}>
      <Image
        className={styles.userIcon}
        src={imagePath || "/profile_default.jpg"}
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
