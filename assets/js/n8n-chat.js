import { createChat } from "https://cdn.jsdelivr.net/npm/@n8n/chat/dist/chat.bundle.es.js";

createChat({
  webhookUrl: "https://species-threaded-thousands-comfort.trycloudflare.com",
  webhookConfig: { method: "POST", headers: {} },
  target: "#n8n-chat",
  mode: "window",
  chatInputKey: "chatInput",
  chatSessionKey: "sessionId",
  loadPreviousSession: true,
  metadata: {},
  showWelcomeScreen: false,
  defaultLanguage: "es",
  initialMessages: [
    "¡Hola! 👋",
    "Soy el asistente virtual del Instituto Fleming. ¿En qué te puedo ayudar?",
  ],
  i18n: {
    es: {
      title: "Asistente Fleming 👋",
      subtitle: "Resolvemos tus dudas 24/7.",
      footer: "",
      getStarted: "Nueva conversación",
      inputPlaceholder: "Escribe tu pregunta…",
    },
  },
  enableStreaming: false,

});
