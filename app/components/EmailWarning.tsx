export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

type Props = {
  email: string;
};

export const EmailWarning = ({ email }: Props) => {
  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!email) return null;
  if (isValidEmail(email)) return null;

  return (
    <p style={{ color: "red", fontSize: "0.875rem" }}>
      メールアドレスの形式が不正です
    </p>
  );
};
