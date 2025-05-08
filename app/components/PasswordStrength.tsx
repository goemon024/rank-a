type Props = {
  password: string;
};

export const GetStrength = (password: string): "弱" | "中" | "強" | null => {
  if (password.length < 1) return null;
  if (password.length < 8) return "弱";

  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);

  const score = [hasLower, hasUpper, hasNumber, hasSymbol].filter(
    Boolean,
  ).length;
  if (score >= 3) return "強";
  if (score === 2) return "中";
  return "弱";
};

export const PasswordStrength = ({ password }: Props) => {
  if (!password) return null;

  const strength = GetStrength(password);
  const color =
    strength === "強" ? "green" : strength === "中" ? "orange" : "red";

  return (
    <p style={{ color, fontSize: "0.875rem" }}>パスワード強度：{strength}</p>
  );
};

export const isPasswordStrong = (password: string) => {
  return GetStrength(password) != "弱"; // if (password.length < 8) return false

  // const check = [
  //     /[a-z]/.test(password),
  //     /[A-Z]/.test(password),
  //     /[0-9]/.test(password),
  //     /[^a-zA-Z0-9]/.test(password)
  // ]

  // return check.filter(Boolean).length >= 2
};
