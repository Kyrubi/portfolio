---
title: "YachAI"
year: 2026
tags: ["IA", "Educación"]
summary: "Tutor de comprensión lectora con IA 100% local para estudiantes de primaria sin conectividad estable."
externalLink: "https://www.kaggle.com/competitions/build-with-gemma-gdg-lima-ai/writeups/yachai-spada"
category: "Competencia — Build with Gemma, GDG Lima AI"
stack: ["Flutter", "Gemma", "Speech-to-Text", "Text-to-Speech"]
gallery:
  - title: "Tutor de lectura"
    gradientFallback: "from-cyan/40 via-violet/25 to-transparent"
    badge: "App"
    caption: "Flujo de lectura y respuesta por voz (Flutter)"
  - title: "Evaluación con Gemma"
    gradientFallback: "from-violet/40 via-pink/25 to-transparent"
    badge: "IA"
    caption: "Evaluación local de respuestas con Gemma"
  - title: "Retroalimentación hablada"
    gradientFallback: "from-pink/40 via-amber/20 to-transparent"
    badge: "Voz"
    caption: "Retroalimentación adaptativa hablada"
  - title: "Modo sin conexión"
    gradientFallback: "from-amber/35 via-cyan/25 to-transparent"
    badge: "Edge"
    caption: "Funciona sin conectividad estable"
---

YachAI es un tutor educativo de comprensión lectora construido para la competencia Build with Gemma — GDG Lima AI Competition 2026. Acompaña a estudiantes de primaria en zonas con conectividad limitada, evaluando sus respuestas de lectura con Gemma y ofreciendo retroalimentación adaptativa sin depender de una conexión estable a internet.

La arquitectura es edge-first: Gemma corre localmente en una estación compartida — como la laptop del profesor — mientras la aplicación en Flutter gestiona la experiencia del estudiante, la transcripción de voz y el progreso guardado en el dispositivo. El resultado es un flujo completo de lectura, respuesta por voz y retroalimentación hablada que funciona incluso sin internet.
