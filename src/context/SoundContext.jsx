import { createContext, useContext } from "react";
import { useSound } from "../hooks/useSound";

const SoundContext = createContext(null);

export function SoundProvider({ children }) {
  const sound = useSound();
  return <SoundContext.Provider value={sound}>{children}</SoundContext.Provider>;
}

export function useSoundContext() {
  const ctx = useContext(SoundContext);
  if (!ctx) throw new Error("useSoundContext must be used within a SoundProvider");
  return ctx;
}
