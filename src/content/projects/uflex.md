---
title: "uFlex"
year: 2026
tags: ["IoT", "Edge Computing", "Wearable"]
summary: "Sistema de telerehabilitación con un wearable de 3 sensores IMU que mide la movilidad del paciente, con edge computing para funcionar sin conexión."
externalLink: "https://github.com/KinIoT"
category: "Proyecto académico"
role: "Diseño y firmware del wearable, backend y cadena IoT–edge–app"
teamSize: "Equipo de 5 personas"
duration: "16 semanas"
stack: ["ESP32", "Flask", "Spring Boot", "PostgreSQL", "Angular", "Kotlin", "Docker"]
gallery:
  - title: "Wearable uFlex"
    gradientFallback: "from-cyan/40 via-violet/30 to-transparent"
    badge: "Hardware"
    caption: "Wearable — vista general"
  - title: "Interfaz app paciente"
    gradientFallback: "from-violet/45 via-pink/25 to-transparent"
    badge: "App"
    caption: "App paciente (Kotlin)"
  - title: "Sensores IMU"
    gradientFallback: "from-pink/40 via-amber/20 to-transparent"
    badge: "Sensor"
    caption: "Detalle sensores IMU (ESP32)"
  - title: "Dashboard clínico"
    gradientFallback: "from-amber/35 via-cyan/25 to-transparent"
    badge: "Web"
    caption: "Dashboard clínico (Angular)"
  - title: "Gateway edge computing"
    gradientFallback: "from-cyan/35 via-violet/25 to-transparent"
    badge: "Edge"
    caption: "Gateway edge computing (Flask)"
metrics:
  - label: "Sensores IMU"
    value: "3"
  - label: "Repositorios"
    value: "7"
  - label: "Semanas de desarrollo"
    value: "16"
---

uFlex es un sistema de telerehabilitación desarrollado por KinIoT, un equipo de estudiantes de Ingeniería de Software de la UPC. Combina un wearable con 3 sensores IMU para medir la movilidad del paciente con una arquitectura IoT–edge–app: el gateway de edge computing preprocesa los datos localmente para que la terapia funcione incluso sin conexión, sincronizando después con el backend y las apps de paciente y clínica.
