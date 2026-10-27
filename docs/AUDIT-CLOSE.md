# Matriz Audit+Cierre — BizBot AI Enterprise v3.0.1

Fecha: 2026-10-26  
Norma: ISO/IEC 25010 · 12207 · 29119 · 27001 · NIST SSDF (PW/RV) · OWASP Top 10 · CMMI-2  
Playbook: GOD-STACK-ING v8.3.1 `references/audit-cierre-playbook.md`

> Spec/PDF ≠ evidencia. Este documento refleja **código verificado** + gaps honestos.

| # | Área | Estado | Evidencia / gap | Riesgo de lanzamiento |
|---|---|---|---|---|
| 1 | Auth | ⚠️ | Register/login Zod + JWT 15m + refresh 7d con hash y rotación. MFA demo `123456` **solo fuera de production**. Demo 1-click y social login son **sandbox local**, no IdP. | Medio si se vende como SSO live |
| 2 | RBAC | ✅ | 6 roles + `authorizeRole` / `authorizePermission`. `super_admin` y `all:manage` bypass explícito. | Bajo |
| 3 | Money$ | ⚠️ | Catálogo en **centavos enteros** + `previewHash` SHA-256 + 409 si el hash no coincide (`server/src/lib/money.ts`). Checkout Stripe es mock. | Alto en cobro real |
| 4 | Fiscal | 🔒 | No hay e-CF / NCF / DGII. Copy de “compliance” es producto, no implementación fiscal. | N/A hasta mercado RD fiscal |
| 5 | Security | ✅ | Plugin `orgId` **inyecta tenant desde AsyncLocalStorage** (ya no es no-op). Helmet, trust proxy, rate-limit global + auth + widget. JWT_SECRET ≥32 y no-default en production. Feedback chat exige JWT. Logs no imprimen URI con secretos. | Residual: tokens en `localStorage` (SPA XSS) |
| 6 | Responsive / a11y | ✅ | Breakpoint `xs:375`. Sidebar drawer + overlay + Escape. Widget `min(24rem, 100vw-1.5rem)`. Skip-link, `:focus-visible`, `sr-only`, guard de rutas privadas. | E2E/axe en CI aún ⚠️ |
| 7 | Notifs | 🔒 | Magic link se genera en Redis; **no hay envío SMTP/Twilio live**. | Canal no “terminado” |
| 8 | AuditLog | ✅ | Append en register/login/billing. TTL 365d. PII limitada a email de actor. | Bajo |
| 9 | CI | ⚠️ | GitHub Actions: typecheck + unit + build client. Sin Playwright/axe/`npm audit` gate. | Medio |
| 10 | Deploy Vercel | ✅ | SPA Ready: https://bizbot-ai-enterprise.vercel.app — `dpl_CH3zQQzpF6G2hgFJggc5wn42PY9K`. Headers CSP/HSTS/XFO. Cero secretos en bundle. | Bajo (web) |
| 11 | API prod | 🔒 | Express no va en este proyecto Vercel. `/api/v1/*` → 404. Requiere host + `JWT_SECRET` + `MONGODB_URI` en dashboard (nunca en git). | Alto hasta binding |

## 🔒 Bloqueadores de tercero (no marcar terminados)

- Stripe Checkout live + webhooks
- Google Calendar OAuth2 + webhooks
- WhatsApp / Twilio
- Anthropic/OpenAI keys en producción (hoy el chat streamea respuesta contextual local + RAG in-memory)
- Qdrant / MinIO persistentes
- IdP Google/Microsoft OAuth
- Asesor fiscal DGII

## Comparación de barra vs Facilito (calidad, no clon)

Facilito es ERP Next+Fastify+Neon. BizBot es MERN + RAG. No se copia NCF/⌘K.  
La barra aplicada: **guardas de auth, dinero entero, tenant isolation real, mobile 375px, estados loading/error, CI verde, honestidad 🔒**.

## Trazabilidad ISO 12207 (1 línea)

Requisito multi-tenant (blueprint §07/§11) → diseño plugin + ALS → `orgIdPlugin.ts` + `tenantContext.ts` → prueba `orgIdIsolation.test.ts` + `rag.test.ts`.

## ISO 29119

Equivalence + branch: auth schemas, money cents, circuit breaker, RAG isolation.

## CMMI observado

Nivel 2 (gestionado): build/test repetible, matriz de cierre, gaps de tercero documentados. No Nivel 3 (aún no hay E2E/axe/perf en CI).
