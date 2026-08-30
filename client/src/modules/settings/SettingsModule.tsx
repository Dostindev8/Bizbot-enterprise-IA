import React, { useState } from 'react';
import { GlassPanel, Button } from '@bizbot/ui';
import { Check } from 'lucide-react';

export const SettingsModule: React.FC = () => {
  const [theme, setTheme] = useState({
    botDisplayName: 'Acme Enterprise Assistant',
    welcomeMessage: '¡Hola! Soy tu asistente de negocios 24/7. ¿En qué puedo ayudarte hoy?',
    primaryColor: '#00D4FF',
    secondaryColor: '#7C3AED',
  });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-black text-[#E8EEF8]">Configuración & Personalización de Marca</h1>
        <p className="text-xs text-[#8B9BB8] mt-1">
          Personaliza la identidad de tu asistente conversacional y tokens de diseño multi-tenant
        </p>
      </div>

      {saved && (
        <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-[#39E58C] text-xs font-bold">
          Configuración de organización guardada con éxito
        </div>
      )}

      <GlassPanel glow className="p-6 space-y-4">
        <h3 className="text-base font-bold text-[#E8EEF8]">Identidad del Asistente</h3>

        <div className="space-y-3 text-xs text-left">
          <div>
            <label className="text-[#8B9BB8] font-semibold block mb-1">Nombre Público del Bot</label>
            <input
              type="text"
              value={theme.botDisplayName}
              onChange={(e) => setTheme({ ...theme, botDisplayName: e.target.value })}
              className="w-full h-11 px-3.5 rounded-xl bg-[#0B0F19] border border-[#23304E] text-[#E8EEF8] text-sm"
            />
          </div>

          <div>
            <label className="text-[#8B9BB8] font-semibold block mb-1">Mensaje de Bienvenida Inicial</label>
            <textarea
              rows={3}
              value={theme.welcomeMessage}
              onChange={(e) => setTheme({ ...theme, welcomeMessage: e.target.value })}
              className="w-full p-3.5 rounded-xl bg-[#0B0F19] border border-[#23304E] text-[#E8EEF8] text-sm"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-[#8B9BB8] font-semibold block mb-1">Color Primario (Hex)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.primaryColor}
                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={theme.primaryColor}
                  onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
                  className="flex-1 h-10 px-3 rounded-xl bg-[#0B0F19] border border-[#23304E] text-[#E8EEF8] font-mono text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-[#8B9BB8] font-semibold block mb-1">Color Secundario (Hex)</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={theme.secondaryColor}
                  onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <input
                  type="text"
                  value={theme.secondaryColor}
                  onChange={(e) => setTheme({ ...theme, secondaryColor: e.target.value })}
                  className="flex-1 h-10 px-3 rounded-xl bg-[#0B0F19] border border-[#23304E] text-[#E8EEF8] font-mono text-xs"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <Button variant="primary" size="md" onClick={handleSave} leftIcon={<Check className="w-4 h-4" />}>
            Guardar Cambios
          </Button>
        </div>
      </GlassPanel>
    </div>
  );
};
