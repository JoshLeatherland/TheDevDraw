import { useEffect, useState } from "react";

export const usePasswordGenerator = () => {
  const [length, setLength] = useState<number>(15);
  const [hasUppercase, setHasUppercase] = useState<boolean>(true);
  const [hasLowercase, setHasLowercase] = useState<boolean>(true);
  const [hasNumbers, setHasNumbers] = useState<boolean>(true);
  const [hasSymbols, setHasSymbols] = useState<boolean>(true);
  const [password, setPassword] = useState<string>("");
  const [strength, setStrength] = useState<string>("");

  const generatePassword = () => {
    const uppercaseLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercaseLetters = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let characters = "";
    if (hasUppercase) characters += uppercaseLetters;
    if (hasLowercase) characters += lowercaseLetters;
    if (hasNumbers) characters += numbers;
    if (hasSymbols) characters += symbols;

    if (!characters) {
      setPassword("");
      return;
    }

    let generatedPassword = "";
    for (let i = 0; i < length; i++) {
      const randomChar = characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
      generatedPassword += randomChar;
    }

    setPassword(generatedPassword);
    assessStrength(generatedPassword);
  };

  const assessStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[!@#$%^&*()_+\-=[\]{}|;:'",.<>?/]/.test(password)) score++;

    if (score <= 2) {
      setStrength("Weak");
    } else if (score <= 4) {
      setStrength("Moderate");
    } else {
      setStrength("Strong");
    }
  };

  useEffect(() => {
    generatePassword();
  }, [length, hasUppercase, hasLowercase, hasNumbers, hasSymbols]);

  return {
    password,
    strength,
    length,
    setLength,
    hasUppercase,
    setHasUppercase,
    hasLowercase,
    setHasLowercase,
    hasNumbers,
    setHasNumbers,
    hasSymbols,
    setHasSymbols,
    generatePassword,
  };
};
