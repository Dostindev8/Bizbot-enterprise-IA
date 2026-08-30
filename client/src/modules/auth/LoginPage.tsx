import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { LoginRequestSchema, LoginRequest } from '@bizbot/shared-types';
import { api } from '../../lib/api.js';
import { useAppStore } from '../../lib/store.js';
import {
  AuthCard,
  AuthInput,
  OtpInput,
  SocialButtons,
  Button,
  Badge,
} from '@bizbot/ui';
import { Mail, Lock, KeyRound, ArrowRight, Sparkles, ShieldCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { setAuth, setCurrentModule } = useAppStore();
  const [activeTab, setActiveTab] = useState<'password' | 'magic'>('password');
  const [requiresMfa, setRequiresMfa] = useState(false);
  const [mfaToken, setMfaToken] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginRequest>({
    resolver: zodResolver(LoginRequestSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: true,
    },
  });

  const onSubmitPassword = async (data: LoginRequest) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await api.login(data);
      if (response.requiresMfa && response.mfaToken) {
        setRequiresMfa(true);
        setMfaToken(response.mfaToken);
      } else {
        setAuth(response.user, undefined, response.accessToken, response.refreshToken);
      }
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitMfa = async () => {
    if (otpCode.length !== 6) return;
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await api.verifyMfa({ mfaToken, code: otpCode });
      setAuth(response.user, undefined, response.accessToken, response.refreshToken);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Código MFA incorrecto (código demo: 123456)');
    } finally {
      setIsLoading(false);
    }
  };

  const onRequestMagicLink = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('magicEmail') as string;
    if (!email) return;

    setIsLoading(true);
    setErrorMessage('');
    try {
      await api.requestMagicLink({ email });
      setMagicLinkSent(true);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al solicitar Magic Link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoAdminLogin = () => {
    // Quick one-click Demo Administrator Fill
    const demoPayload = {
      id: 'usr_admin_demo',
      orgId: 'org_acme_demo',
      email: 'admin@bizbot.ai',
      name: 'Carlos Santana (Admin)',
      role: 'org_admin' as const,
      permissions: ['all:manage' as const],
      mfaEnabled: false,
    };
    const demoOrg = {
      id: 'org_acme_demo',
      name: 'Acme Enterprise Dominicana',
      slug: 'acme-enterprise',
      plan: 'business' as const,
      brandTheme: {
        primaryColor: '#00D4FF',
        secondaryColor: '#7C3AED',
        accentColor: '#39E58C',
        botDisplayName: 'Acme AI Assistant',
        welcomeMessage: '¡Hola! Soy el asistente oficial de Acme Enterprise.',
        fontFamily: 'Inter',
      },
      limits: {
        maxUsers: 25,
        maxConversationsPerMonth: 50000,
        maxDocumentsStorageMb: 5000,
        maxWorkflows: 20,
        allowedChannels: ['web' as const, 'whatsapp' as const, 'email' as const],
        customBrandingAllowed: true,
      },
      isActive: true,
    };
    setAuth(demoPayload, demoOrg, 'mock_access_token_demo_2026', 'mock_refresh_token_demo_2026');
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center p-4 sm:p-6 relative">
      {/* Background radial glow */}
      <div className="absolute w-[600px] h-[600px] bg-gradient-to-tr from-[#00D4FF]/15 to-[#7C3AED]/20 blur-[130px] rounded-full pointer-events-none" />

      <AuthCard glowColor="dual" className="w-full max-w-md my-8">
        {/* Header with 3D Logo */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl p-0.5 bg-gradient-to-tr from-[#00D4FF] to-[#7C3AED] shadow-[0_0_30px_rgba(0,212,255,0.4)] mx-auto mb-3">
            <img
              src="/bizbot-logo.png"
              alt="BizBot Logo"
              className="w-full h-full object-contain rounded-[14px] bg-[#0B0F19]"
            />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-[#E8EEF8]">
            Bienvenido a BizBot <span className="text-[#00D4FF]">AI</span>
          </h2>
          <p className="text-xs text-[#8B9BB8] mt-1 font-medium">
            Accede a la consola empresarial de asistente inteligente
          </p>
        </div>

        {/* Demo Fast Track Button */}
        <div className="mb-5">
          <button
            onClick={handleDemoAdminLogin}
            type="button"
            className="w-full p-2.5 rounded-xl bg-gradient-to-r from-[#00D4FF]/20 to-[#7C3AED]/20 border border-[#00D4FF]/40 text-xs font-bold text-[#00D4FF] hover:border-[#00D4FF] transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,212,255,0.15)] cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-[#00D4FF]" />
            <span>Acceso Inmediato Modo Demo (1-Click Admin)</span>
          </button>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-medium flex items-center gap-2 animate-shake">
            <ShieldCheck className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* MFA View */}
        {requiresMfa ? (
          <div className="text-center">
            <Badge variant="purple" className="mb-3">
              Autenticación en Dos Pasos (MFA)
            </Badge>
            <p className="text-xs text-[#8B9BB8] mb-4">
              Ingresa el código de 6 dígitos de tu aplicación autenticadora (Google Authenticator / Authy).
            </p>
            <OtpInput value={otpCode} onChange={setOtpCode} length={6} disabled={isLoading} />
            <p className="text-[11px] text-[#5F708F] mb-4">Código demo para pruebas: 123456</p>
            <Button
              variant="primary"
              size="md"
              onClick={onSubmitMfa}
              isLoading={isLoading}
              disabled={otpCode.length !== 6}
              className="w-full"
            >
              Verificar y Acceder
            </Button>
          </div>
        ) : (
          <>
            {/* Tabs (Password vs Magic Link) */}
            <div className="grid grid-cols-2 gap-1 p-1 rounded-xl bg-[#0B0F19] border border-[#23304E] mb-5 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setActiveTab('password')}
                className={`py-2 rounded-lg transition-all ${
                  activeTab === 'password'
                    ? 'bg-[#131A2B] text-[#00D4FF] shadow-sm'
                    : 'text-[#8B9BB8] hover:text-white'
                }`}
              >
                Contraseña
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('magic')}
                className={`py-2 rounded-lg transition-all ${
                  activeTab === 'magic'
                    ? 'bg-[#131A2B] text-[#00D4FF] shadow-sm'
                    : 'text-[#8B9BB8] hover:text-white'
                }`}
              >
                Magic Link
              </button>
            </div>

            {/* Social Login Buttons */}
            <SocialButtons
              isLoading={isLoading}
              onGoogleLogin={handleDemoAdminLogin}
              onMicrosoftLogin={handleDemoAdminLogin}
            />

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#23304E]" />
              </div>
              <div className="relative flex justify-center text-[11px] uppercase">
                <span className="bg-[#131A2B] px-3 text-[#5F708F] font-bold">O continúa con</span>
              </div>
            </div>

            {activeTab === 'password' ? (
              <form onSubmit={handleSubmit(onSubmitPassword)} className="space-y-4">
                <AuthInput
                  label="Correo Electrónico"
                  type="email"
                  placeholder="admin@tuempresa.com"
                  icon={<Mail className="w-4 h-4" />}
                  error={errors.email?.message}
                  {...register('email')}
                />

                <AuthInput
                  label="Contraseña"
                  type="password"
                  placeholder="••••••••••••"
                  icon={<Lock className="w-4 h-4" />}
                  error={errors.password?.message}
                  {...register('password')}
                />

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 text-[#8B9BB8] cursor-pointer">
                    <input
                      type="checkbox"
                      {...register('rememberMe')}
                      className="rounded border-[#23304E] bg-[#0B0F19] text-[#00D4FF] focus:ring-[#00D4FF]"
                    />
                    <span>Recordarme 30 días</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('magic')}
                    className="text-[#00D4FF] hover:underline font-semibold"
                  >
                    ¿Olvidaste tu clave?
                  </button>
                </div>

                <Button
                  type="submit"
                  variant="primary"
                  size="md"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                  className="w-full mt-2"
                >
                  Iniciar Sesión
                </Button>
              </form>
            ) : (
              <form onSubmit={onRequestMagicLink} className="space-y-4">
                {magicLinkSent ? (
                  <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-center text-xs text-[#39E58C]">
                    <Sparkles className="w-6 h-6 mx-auto mb-2 text-[#39E58C]" />
                    <p className="font-bold mb-1">¡Enlace Mágico Enviado!</p>
                    <p className="text-[#8B9BB8]">
                      Revisa tu bandeja de entrada para iniciar sesión sin contraseña con 1 solo clic.
                    </p>
                  </div>
                ) : (
                  <>
                    <AuthInput
                      label="Correo Electrónico"
                      name="magicEmail"
                      type="email"
                      placeholder="admin@tuempresa.com"
                      icon={<Mail className="w-4 h-4" />}
                    />
                    <Button
                      type="submit"
                      variant="primary"
                      size="md"
                      isLoading={isLoading}
                      leftIcon={<KeyRound className="w-4 h-4" />}
                      className="w-full"
                    >
                      Enviar Enlace de Acceso
                    </Button>
                  </>
                )}
              </form>
            )}

            {/* Footer switcher */}
            <div className="mt-6 text-center text-xs text-[#8B9BB8]">
              ¿Aún no tienes cuenta?{' '}
              <button
                onClick={() => setCurrentModule('register')}
                className="text-[#00D4FF] font-bold hover:underline"
              >
                Crear cuenta empresarial
              </button>
            </div>
          </>
        )}
      </AuthCard>
    </div>
  );
};
