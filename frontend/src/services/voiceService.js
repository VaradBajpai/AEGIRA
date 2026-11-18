export const isVoiceSupported = () => {
  return Boolean(
    window.SpeechRecognition ||
      window.webkitSpeechRecognition
  );
};


export const createRecognition = ({
  onResult,
  onError,
  onEnd,
}) => {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    return null;
  }

  const recognition =
    new SpeechRecognition();

  recognition.continuous = false;
  recognition.interimResults = false;

  // Works well for Indian English
  recognition.lang = "en-IN";

  recognition.maxAlternatives = 1;


  recognition.onresult = (event) => {
    const transcript =
      event.results[0][0].transcript;

    if (onResult) {
      onResult(transcript);
    }
  };


  recognition.onerror = (event) => {
    if (onError) {
      onError(event);
    }
  };


  recognition.onend = () => {
    if (onEnd) {
      onEnd();
    }
  };


  return recognition;
};


export const speak = (text) => {
  if (
    !("speechSynthesis" in window)
  ) {
    return;
  }

  // Stop anything currently speaking
  window.speechSynthesis.cancel();

  const message =
    new SpeechSynthesisUtterance(
      text
    );

  message.lang = "en-IN";
  message.rate = 1;
  message.pitch = 1;

  window.speechSynthesis.speak(
    message
  );
};