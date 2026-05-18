import { useMemo } from 'react';

export const useNumeroOperacionDuplicado = (pagos = []) => {
  const numerosOperacionRegistrados = useMemo(() => {
    return new Set(pagos.map((p) => p.numero_operacion).filter(Boolean));
  }, [pagos]);

  const validarDuplicado = (numero) => {
    if (!numero || !numero.trim()) return false;
    return numerosOperacionRegistrados.has(numero.trim());
  };

  return { validarDuplicado, numerosRegistrados: numerosOperacionRegistrados };
};
