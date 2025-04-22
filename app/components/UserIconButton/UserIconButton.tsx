import styles from "./UserIconButton.module.css";
import Image from "next/image";
import { useAuth } from "@/contexts/AuthContext";

// interface UserIconButtonProps {
//   imagePath: string | null;
//   // isLoading: boolean;
//   // onClick: () => void;
//   className?: string;
// }

export const UserIconButton = () => {
  const auth = useAuth();
  const imagePath = auth.user?.imagePath;

  return (
    <button className={styles.userIconButton}>
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
