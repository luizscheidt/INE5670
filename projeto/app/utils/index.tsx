export function validateCpf(cpf: string): number | null {
  // Remover pontos e traços do CPF
  const cleanCpf = cpf.replace(/[^\d]/g, "");

  // Verificar se o CPF tem 11 dígitos
  if (cleanCpf.length !== 11) {
    return null;
  }

  // Verificar se todos os dígitos são iguais
  if (/^(\d)\1+$/.test(cleanCpf)) {
    return null;
  }

  // Calcular o primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cleanCpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  const digito1 = resto >= 10 ? 0 : resto;

  // Calcular o segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cleanCpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  const digito2 = resto >= 10 ? 0 : resto;

  // Verificar se os dígitos verificadores são válidos
  if (
    parseInt(cleanCpf.charAt(9)) === digito1 &&
    parseInt(cleanCpf.charAt(10)) === digito2
  ) {
    // Retorna o CPF como número inteiro
    return parseInt(cleanCpf);
  }

  return null;
}
