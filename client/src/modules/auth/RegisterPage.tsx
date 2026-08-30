import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { RegisterRequestSchema, RegisterRequest } from '@bizbot/shared-types';
import { api } from '../../lib/api.js';
import { useAppStore } from '../../lib/store.js';
import {
  AuthCard,
  AuthInput,
  PasswordStrength,
  Button,
} from '@bizbot/ui';
import { Building2, User, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { setAuth, setCurrentModule } = useAppStore();
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterRequest>({
    resolver: zodResolver(RegisterRequestSchema),
    defaultValues: {
      organizationName: '',
      adminName: '',
      email: '',
      password: '',
      industry: 'Servicios Profesionales',
    },
  });

  const passwordValue = watch('password');

  const onSubmit = async (data: RegisterRequest) => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const response = await api.register(data);
      setAuth(response.user, undefined, response.accessToken, response.refreshToken);
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : 'Error al registrar organización');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] flex items-center justify-center p-4 sm:p-6 relative">
      {/* Background glow orb */}
      <div className="absolute w-[650px] h-[650px] bg-gradient-to-tr from-[#7C3AED]/20 to-[#00D4FF]/15 blur-[140px] rounded-full pointer-events-none" />

      <AuthCard glowColor="dual" className="w-full max-w-lg my-8">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 rounded-2xl p-0.5 bg-gradient-to-tr from-[#00D4FF] via-[#7C3AED] to-[#39E58C] shadow-[0_0_30px_rgba(0,212,255,0.4)] mx-auto mb-3">
            <img
              src="/bizbot-logo.png"
              alt="BizBot Logo"
              className="w-full h-full object-contain rounded-[14px] bg-[#0B0F19]"
            />
          </div>
          <h2 className="text-2xl font-black tracking-tight text-[#E8EEF8]">
            Crear Cuenta <span className="text-[#00D4FF]">Empresarial</span>
          </h2>
          <p className="text-xs text-[#8B9BB8] mt-1 font-medium">
            14 días de prueba con todas las funciones • Sin tarjeta requerida
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs font-medium flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3.5">
          <AuthInput
            label="Nombre de Empresa"
            placeholder="Ej. Acme Dominicana S.R.L."
            icon={<Building2 className="w-4 h-4" />}
            error={errors.organizationName?.message}
            {...register('organizationName')}
          />

          <AuthInput
            label="Nombre Completo del Administrador"
            placeholder="Ej. Dostin Santana"
            icon={<User className="w-4 h-4" />}
            error={errors.adminName?.message}
            {...register('adminName')}
          />

          <AuthInput
            label="Correo Corporativo"
            type="email"
            placeholder="admin@tuempresa.com"
            icon={<Mail className="w-4 h-4" />}
            error={errors.email?.message}
            {...register('email')}
          />

          <div className="flex flex-col gap-1 text-left">
            <label className="text-xs font-semibold uppercase tracking-wider text-[#8B9BB8]">
              Industria / Sector
            </label>
            <select
              {...register('industry')}
              className="w-full h-12 rounded-xl bg-[#0B0F19] border border-[#23304E] text-[#E8EEF8] px-4 text-sm font-medium focus:outline-none focus:border-[#00D4FF]"
            >
              <option value="Servicios Profesionales">Servicios Profesionales & Consultoría</option>
              <option value="Clínica / Salud">Clínica, Médicos & Salud</option>
              <option value="Inmobiliaria">Inmobiliaria & Bienes Raíces</option>
              <option value="Agencia / Marketing">Agencia de Marketing & Software</option>
              <option value="Retail / E-Commerce">Comercio, Retail & Tiendas</option>
              <option value="Educación">Educación & Formación</option>
              <option value="Fintech / Legal">Fintech, Legal & Finanzas</option>
            </select>
          </div>

          <div>
            <AuthInput
              label="Contraseña de Acceso"
              type="password"
              placeholder="Mínimo 8 caracteres, números y símbolos"
              icon={<Lock className="w-4 h-4" />}
              error={errors.password?.message}
              {...register('password')}
            />
            <PasswordStrength password={passwordValue} />
          </div>

          <Button
            type="submit"
            variant="primary"
            size="md"
            isLoading={isLoading}
            rightIcon={<ArrowRight className="w-4 h-4" />}
            className="w-full mt-3 h-12"
          >
            Activar Cuenta Enterprise
          </Button>
        </form>

        <div className="mt-6 text-center text-xs text-[#8B9BB8]">
          ¿Ya tienes cuenta empresarial?{' '}
          <button
            onClick={() => setCurrentModule('login')}
            className="text-[#00D4FF] font-bold hover:underline"
          >
            Iniciar sesión
          </button>
        </div>
      </AuthCard>
    </div>
  );
};
