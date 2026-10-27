# 🤖 BizBot AI — Business Assistant Chatbot Enterprise Platform
### GOD-STACK Edition v3.0.0 — Production-Hardened Architecture

> **"NO sugieres → CONSTRUYES. NO preguntas si se puede → DETERMINAS CÓMO.**
> **NO entregas 'bueno' → ENTREGAS LO QUE NINGÚN OTRO PUEDE."**
> — *Logic Code Spot (LCS) Software Solutions · Dostin Santana Tejeda*

---

## 🏛️ Visión y Resumen Ejecutivo

**BizBot AI Enterprise** es la plataforma empresarial de asistente conversacional autónomo para PyMEs y empresas medianas (RD, LatAm y USA remoto). Permite operar de forma autónoma 24/7 comprendiendo el contexto real de tu negocio con **RAG multi-tenant estricto por `orgId`**, sincronización directa con **Google Calendar**, generación y firma digital de **documentos en PDF**, gestión de leads en **CRM** y **Call Center con Whisper & Voz**.

---

## 🛠️ Stack Tecnológico (Verificación Viva 2026)

| Capa | Tecnología | Rol |
|---|---|---|
| **Frontend** | React 19 + Vite 6 + Tailwind CSS + Lucide + Framer Motion | UI reactiva, glassmorphism, mobile-first 375px+ |
| **Backend** | Node.js 22 LTS + Express 5 | Arquitectura modular orientada al dominio |
| **ODM / DB** | Mongoose 8 + MongoDB 8 (Replica Set) | Aislamiento multi-tenant forzado vía plugin global `orgId` |
| **AI Engine** | Anthropic Claude SDK (Model Router: Haiku / Sonnet / Opus) | RAG contextual, streaming SSE y semantic caching |
| **Vector Store** | Qdrant Cloud / Local | Colecciones vectoriales particionadas `org_{orgId}` |
| **Cache & Limiting** | Redis 7 + In-Memory Failover | Rate limiting, sesiones y fallback sin caídas |
| **Monorepo** | pnpm workspaces | `@bizbot/shared-types`, `@bizbot/ui`, `client`, `server` |

---

## 📦 Estructura del Monorepo

```
bizbot-enterprise/
├── .cursorrules                  # 12 Reglas Irrompibles del Protocolo GOD-STACK
├── packages/
│   ├── shared-types/             # Schemas Zod compartidos end-to-end front/back
│   └── ui/                       # Design System BizBot con Tokens, Glassmorphism & Glow
├── server/                       # Backend Express 5 + Node 22 LTS
│   ├── src/models/               # Schemas Mongoose con plugin global orgId
│   ├── src/middleware/           # JWT RS256, RBAC 6 roles, Rate Limiting, Error Handler
│   ├── src/modules/              # Auth, AI/Chat, Agenda, CRM, Docs, Call Center, Workflows, Billing
│   └── tests/                    # Vitest unit & integration tests
├── client/                       # Frontend React 19 + Vite 6
│   ├── src/modules/              # Intro 3D, Login Elite, Register, Dashboard, Chat, Agenda, CRM...
│   └── src/components/           # Navbar, Sidebar, WidgetEmbed flotante
└── infra/
    ├── docker/                   # Docker Compose, Nginx Reverse Proxy, Dockerfiles
    └── .github/workflows/        # CI/CD Pipeline automatizado
```

---

## 🚀 Inicio Rápido (Desarrollo Local)

### 1. Instalar dependencias del monorepo
```bash
pnpm install
```

### 2. Compilar todos los paquetes
```bash
pnpm --recursive run build
```

### 3. Ejecutar pruebas automatizadas
```bash
pnpm test
```

### 4. Iniciar Frontend y Backend en paralelo
```bash
# Iniciar backend (Puerto 5000)
pnpm --filter @bizbot/server dev

# Iniciar frontend (Puerto 3000)
pnpm --filter @bizbot/client dev
```

---

## 🛡️ Seguridad, Compliance & OWASP Top 10

- **Aislamiento Multi-Tenant**: Cada consulta de base de datos aplica estrictamente `{ orgId }` previniendo fuga cross-tenant.
- **Autenticación Élite**: Tokens JWT con expiración de 15 minutos, rotación de refresh tokens y soporte para TOTP MFA (6 dígitos).
- **Rate Limiting**: Protección activa en endpoints públicos (100 req/min) y de autenticación (15 req/min).
- **Circuit Breaker**: Resiliencia automática ante fallas transitorias de proveedores de IA o APIs externas.
- **Formato Estándar de Errores**: Códigos de error estructurados con `correlationId` para trazabilidad sin exponer trazas internas.

---

## 🏆 Criterios de Aceptación y Calidad Cumplidos

✅ Monorepo `pnpm workspaces` completamente configurado y compilando al 100% en TypeScript strict.  
✅ Schemas Zod unificados en `@bizbot/shared-types` sin duplicación de lógica.  
✅ Suite de diseño `@bizbot/ui` con tokens Dark-first (`#00D4FF`, `#7C3AED`, `#39E58C`, `#0B0F19`, `#131A2B`).  
✅ Experiencia Intro 3D con logo metálico animado, sandbox interactivo y comparativa competitiva.  
✅ Login & Register nivel élite con soporte para Contraseña, Magic Link, Social Login y flujo MFA.  
✅ 8 Módulos funcionales completos: Chat IA (SSE), Agenda, CRM, Documentos, Call Center, Workflows, Analytics y Billing.  
✅ Widget web embebible flotante para integración inmediata en cualquier sitio web de clientes.  
✅ Pipeline de CI/CD en GitHub Actions y orquestación Docker Compose lista para producción.

---

## ☁️ Producción en Vercel (frontend SPA)

El cliente React/Vite se publica como estático. **Ningún secreto de servidor entra al bundle.**

| Ajuste | Valor |
|---|---|
| Install | `pnpm install --frozen-lockfile=false` |
| Build | `pnpm run build:web` |
| Output | `client/dist` |
| Env públicas | `VITE_PUBLIC_API_URL=/api/v1` · `VITE_PUBLIC_APP_NAME=BizBot AI Enterprise` |

El API Express (Mongo, JWT, Redis, LLM) **no** se despliega en este proyecto Vercel: requiere `JWT_SECRET` y `MONGODB_URI` en un host de backend, configurados solo en el dashboard del proveedor. Login/CRM/chat en producción quedan en modo degradado hasta ese binding (🔒).

```bash
npx vercel --prod --yes
```

---
**Logic Code Spot (LCS) Software Solutions — 2026**
