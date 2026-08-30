import {
  AuthResponse,
  AuthUserPayload,
  LoginRequest,
  RegisterRequest,
  MfaVerifyRequest,
  MagicLinkRequest,
  DashboardSummary,
  Contact,
  Appointment,
  CreateAppointmentRequest,
  Document as DocumentType,
  GenerateDocumentRequest,
  CallRecord,
  Workflow,
  SubscriptionPlanDetails,
  ChatStreamChunk,
  RagCitation,
} from '@bizbot/shared-types';

const API_BASE = import.meta.env.VITE_PUBLIC_API_URL || '/api/v1';

class ApiClient {
  private getHeaders(auth = true): HeadersInit {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (auth) {
      const token = localStorage.getItem('bizbot_access_token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return headers;
  }

  async register(data: RegisterRequest): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Error en el registro');
    return json.data;
  }

  async login(data: LoginRequest): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Credenciales incorrectas');
    return json.data;
  }

  async verifyMfa(data: MfaVerifyRequest): Promise<AuthResponse> {
    const res = await fetch(`${API_BASE}/auth/mfa/verify`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Código MFA inválido');
    return json.data;
  }

  async requestMagicLink(data: MagicLinkRequest): Promise<{ success: boolean; message: string }> {
    const res = await fetch(`${API_BASE}/auth/magic-link`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Error al solicitar magic link');
    return json;
  }

  async getMe(): Promise<{ user: AuthUserPayload }> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: this.getHeaders(true),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Sesión inválida');
    return json.data;
  }

  async getAnalyticsSummary(): Promise<DashboardSummary> {
    const res = await fetch(`${API_BASE}/analytics/summary`, {
      headers: this.getHeaders(true),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Error al cargar analíticas');
    return json.data;
  }

  async getContacts(): Promise<Contact[]> {
    const res = await fetch(`${API_BASE}/crm/contacts`, {
      headers: this.getHeaders(true),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Error al cargar contactos');
    return json.data;
  }

  async createContact(data: Partial<Contact>): Promise<Contact> {
    const res = await fetch(`${API_BASE}/crm/contacts`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Error al crear contacto');
    return json.data;
  }

  async getAppointments(): Promise<Appointment[]> {
    const res = await fetch(`${API_BASE}/agenda/appointments`, {
      headers: this.getHeaders(true),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Error al cargar citas');
    return json.data;
  }

  async createAppointment(data: CreateAppointmentRequest): Promise<Appointment> {
    const res = await fetch(`${API_BASE}/agenda/appointments`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Error al agendar cita');
    return json.data;
  }

  async getDocuments(): Promise<DocumentType[]> {
    const res = await fetch(`${API_BASE}/documents`, {
      headers: this.getHeaders(true),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Error al cargar documentos');
    return json.data;
  }

  async generateDocument(data: GenerateDocumentRequest): Promise<DocumentType> {
    const res = await fetch(`${API_BASE}/documents/generate`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Error al generar documento');
    return json.data;
  }

  async getCallRecords(): Promise<CallRecord[]> {
    const res = await fetch(`${API_BASE}/call-center/records`, {
      headers: this.getHeaders(true),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Error al cargar llamadas');
    return json.data;
  }

  async getWorkflows(): Promise<Workflow[]> {
    const res = await fetch(`${API_BASE}/workflows`, {
      headers: this.getHeaders(true),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Error al cargar flujos');
    return json.data;
  }

  async getBillingPlans(): Promise<SubscriptionPlanDetails[]> {
    const res = await fetch(`${API_BASE}/billing/plans`, {
      headers: this.getHeaders(false),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Error al cargar planes');
    return json.data;
  }

  async selectPlan(plan: string): Promise<{ checkoutUrl?: string; success: boolean; message?: string }> {
    const res = await fetch(`${API_BASE}/billing/checkout`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify({ plan }),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error?.message || 'Error al procesar suscripción');
    return { ...json.data, message: 'Suscripción actualizada exitosamente' };
  }

  // Stream chat helper using SSE
  streamChat(
    message: string,
    options: {
      conversationId?: string;
      modelPreference?: 'fast' | 'standard' | 'deep';
      onMeta?: (meta: { conversationId?: string; model?: string; cached?: boolean; sources?: RagCitation[] }) => void;
      onSources?: (sources: RagCitation[]) => void;
      onToken?: (token: string) => void;
      onDone?: (doneData: { messageId?: string; conversationId?: string }) => void;
      onError?: (err: string) => void;
    }
  ): () => void {
    const controller = new AbortController();

    fetch(`${API_BASE}/ai/chat`, {
      method: 'POST',
      headers: this.getHeaders(false),
      body: JSON.stringify({
        message,
        conversationId: options.conversationId,
        modelPreference: options.modelPreference || 'standard',
        stream: true,
      }),
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok || !response.body) {
          throw new Error('Error al conectar con el asistente de IA');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split('\n\n');
          buffer = lines.pop() || '';

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const chunk = JSON.parse(line.slice(6)) as ChatStreamChunk;
                if (chunk.type === 'meta') {
                  options.onMeta?.({
                    conversationId: chunk.conversationId,
                    model: chunk.model,
                    cached: chunk.cached,
                    sources: chunk.sources,
                  });
                }
                if (chunk.type === 'sources' && chunk.sources) {
                  options.onSources?.(chunk.sources);
                }
                if (chunk.type === 'token' && chunk.token) {
                  options.onToken?.(chunk.token);
                }
                if (chunk.type === 'done') {
                  options.onDone?.({
                    messageId: chunk.messageId,
                    conversationId: chunk.conversationId,
                  });
                }
                if (chunk.type === 'error' && chunk.error) {
                  options.onError?.(chunk.error);
                }
              } catch {
                // ignore json chunk error
              }
            }
          }
        }
      })
      .catch((err: unknown) => {
        if (err instanceof Error && err.name !== 'AbortError') {
          options.onError?.(err.message || 'Error de conexión con el chat');
        }
      });

    return () => controller.abort();
  }
}

export const api = new ApiClient();
