---
title: "ReStock"
year: 2026
tags: ["Mobile", "IA", "Arquitectura"]
summary: "App móvil de seguimiento de compras personales que aprende tus hábitos de consumo y avisa proactivamente cuándo toca reponer un producto."
category: "Diseño de arquitectura de software"
stack: ["React Native", "NestJS", "PostgreSQL", "Amazon S3", "Document Intelligence", "DeepSeek", "Firebase Cloud Messaging"]
gallery:
  - title: "App móvil ReStock"
    gradientFallback: "from-violet/40 via-cyan/25 to-transparent"
    badge: "App"
    caption: "App móvil (React Native)"
  - title: "Escaneo de boletas"
    gradientFallback: "from-cyan/40 via-pink/25 to-transparent"
    badge: "OCR"
    caption: "Escaneo de boletas (Document Intelligence)"
  - title: "Pipeline de resolución de alias"
    gradientFallback: "from-pink/40 via-amber/20 to-transparent"
    badge: "Backend"
    caption: "Pipeline de resolución de alias de producto"
  - title: "Diagrama de contenedores C4"
    gradientFallback: "from-amber/35 via-violet/25 to-transparent"
    badge: "Arquitectura"
    caption: "Diagrama de contenedores (C4)"
  - title: "Sugerencias de reposición"
    gradientFallback: "from-violet/35 via-pink/20 to-transparent"
    badge: "IA"
    caption: "Sugerencias de reposición y comparación de precios"
metrics:
  - label: "Niveles del pipeline de alias"
    value: "4"
  - label: "Servicios externos integrados"
    value: "4"
  - label: "Tecnologías core"
    value: "7"
---

ReStock registra tus compras a partir de boletas y facturas escaneadas —o ingresadas manualmente—, construye un catálogo privado por usuario y aprende a reconocer tus productos aunque el nombre en el ticket sea críptico o abreviado. Con ese historial calcula patrones de consumo, sugiere cuándo es probable que necesites reponer algo y permite comparar precios entre tiendas usando el propio historial de compras del usuario. No existe panel de administrador ni catálogo global precargado: todo el catálogo, los precios y los alias de producto nacen de la información que cada usuario ingresa.

La arquitectura es un monolito modular en NestJS con la app móvil (React Native + Gluestack UI) como único cliente, sin backend administrativo. El módulo de identidad y acceso se modela como un bounded context interno, separado lógicamente aunque desplegado como parte del mismo monolito. Cuando una línea de una boleta no coincide de forma obvia con un producto conocido, el backend resuelve el alias por niveles: normalización de texto, match exacto contra alias guardados, similitud con `pg_trgm` y, solo como último recurso, una sugerencia de DeepSeek que el usuario debe confirmar antes de persistirse — así el costo del LLM se mantiene bajo control a medida que crece el catálogo de cada usuario.

El proyecto está en fase de diseño de arquitectura: el diagrama de contenedores C4 ya está definido, pero aún no hay código fuente. Quedan por definir la infraestructura de despliegue, el diagrama de componentes (C4 nivel 3) del pipeline de resolución de alias, y la evaluación de un catálogo normalizado global y opcional que preserve la privacidad por usuario como palanca futura para reducir el uso del LLM.
