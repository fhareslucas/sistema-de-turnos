import { useCallback, useEffect, useState, useSyncExternalStore } from "react";

export const useTextToSpeech = () => {
  const [voice, setVoice] = useState<SpeechSynthesisVoice | null>(null);

  const supported = useSyncExternalStore(
    useCallback(() => () => {}, []),
    () => typeof window !== "undefined" && "speechSynthesis" in window,
    () => false
  );

  useEffect(() => {
    if (!supported) return;

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      const spanishVoices = voices.filter((v) => v.lang.includes("es"));

      if (spanishVoices.length === 0) {
        setVoice(null);
        return;
      }

      const isLikelyFemale = (name: string) => name.includes("Google");

      spanishVoices.sort((a, b) => {
        const aFemale = isLikelyFemale(a.name);
        const bFemale = isLikelyFemale(b.name);

        if (aFemale && !bFemale) return -1;
        if (!aFemale && bFemale) return 1;

        return 0;
      });

      setVoice(spanishVoices[0]);
    };

    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
    };
  }, [supported]);

  const speak = useCallback(
    (text: string) => {
      if (!supported) return;

      const cleanText = text.replace(/[-]/g, " ");

      const utterance = new SpeechSynthesisUtterance(cleanText);
      if (voice) {
        utterance.voice = voice;
      }

      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    },
    [voice, supported]
  );

  return { speak, supported };
};
