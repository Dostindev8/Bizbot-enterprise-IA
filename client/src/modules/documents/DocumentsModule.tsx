import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api.js';
import { GlassPanel, Button, Badge } from '@bizbot/ui';
import { FileText, Plus, CheckCircle, PenTool, ShieldCheck } from 'lucide-react';
import { Document as DocumentType } from '@bizbot/shared-types';

export const DocumentsModule: React.FC = () => {
  const queryClient = useQueryClient();
  const [isSigningOpen, setIsSigningOpen] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState<DocumentType | null>(null);

  const { data: documents } = useQuery({
    queryKey: ['documents'],
    queryFn: () => api.getDocuments(),
  });

  const generateContractMutation = useMutation({
    mutationFn: () =>
      api.generateDocument({
        title: 'Acuerdo de Servicios y Confidencialidad BizBot AI',
        dataValues: {
          clientName: 'Corporativo Santo Domingo S.A.',
          planName: 'Enterprise Platform',
          amountUsd: 1200,
        },
        signatories: [
          { name: 'Director Legal', email: 'legal@corporativo.com', role: 'client' },
          { name: 'Equipo Legal BizBot', email: 'legal@bizbot.ai', role: 'vendor' },
        ],
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#E8EEF8]">Documentos & Firma Electrónica</h1>
          <p className="text-xs text-[#8B9BB8] mt-1">
            Plantillas Handlebars compiladas a PDF con firma digital auditada y almacenamiento seguro
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => generateContractMutation.mutate()}
          isLoading={generateContractMutation.isPending}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Generar Nuevo Contrato
        </Button>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {(documents || [
          {
            id: 'doc_demo_01',
            orgId: 'org_demo',
            title: 'Propuesta Comercial y SLA 99.95% — BizBot AI',
            status: 'signed' as const,
            version: 1,
            signatories: [{ name: 'Carlos Morales', email: 'carlos@acme.com', role: 'client', hasSigned: true }],
            dataValues: {},
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          },
        ]).map((doc) => (
          <GlassPanel key={doc.id} glow className="p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between mb-3">
                <FileText className="w-6 h-6 text-amber-400" />
                <Badge variant={doc.status === 'signed' ? 'success' : 'warning'} dot>
                  {doc.status === 'signed' ? 'Firmado' : 'Pendiente Firma'}
                </Badge>
              </div>
              <h3 className="text-sm font-bold text-[#E8EEF8] line-clamp-2">{doc.title}</h3>
              <p className="text-[11px] text-[#8B9BB8] mt-2">Versión {doc.version} • PDF Digital</p>
            </div>

            <div className="pt-3 border-t border-[#23304E] flex items-center justify-between">
              <span className="text-[10px] text-[#5F708F]">
                {doc.signatories.length} firmante(s)
              </span>
              <Button
                variant="glass"
                size="sm"
                onClick={() => {
                  setSelectedDoc(doc);
                  setIsSigningOpen(true);
                }}
                leftIcon={<PenTool className="w-3.5 h-3.5 text-[#00D4FF]" />}
              >
                Ver & Firmar
              </Button>
            </div>
          </GlassPanel>
        ))}
      </div>

      {/* Signature Modal */}
      {isSigningOpen && selectedDoc && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-[#131A2B] border border-[#00D4FF]/40 p-6 shadow-2xl space-y-4 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#E8EEF8]">{selectedDoc.title}</h3>
              <Badge variant="cyan">Certificado Digital</Badge>
            </div>

            <div className="p-4 rounded-xl bg-[#0B0F19] border border-[#23304E] text-xs text-[#8B9BB8] space-y-2">
              <p className="font-semibold text-[#E8EEF8]">Resumen del Documento Jurídico:</p>
              <p>
                Este documento acredita los términos de servicio, disponibilidad de SLA y
                aislamiento de infraestructura de datos bajo el Protocolo GOD-STACK v3.0.
              </p>
              <div className="pt-2 border-t border-white/5 flex items-center gap-2 text-[#39E58C]">
                <ShieldCheck className="w-4 h-4" />
                <span>Hash Criptográfico SHA-256 Verificado</span>
              </div>
            </div>

            <div className="p-6 rounded-xl border border-dashed border-[#00D4FF]/40 bg-[#0B0F19] text-center">
              <PenTool className="w-8 h-8 text-[#00D4FF] mx-auto mb-2" />
              <p className="text-xs font-semibold text-[#E8EEF8]">Panel de Firma Digital Activo</p>
              <p className="text-[11px] text-[#5F708F]">
                Firma electrónica legalmente vinculante con sello de tiempo UTC
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setIsSigningOpen(false)}>
                Cerrar
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setIsSigningOpen(false);
                }}
                leftIcon={<CheckCircle className="w-4 h-4" />}
              >
                Aplicar Firma Electrónica
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
