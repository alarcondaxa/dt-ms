export default function parseCurrencyFloat(value: string) {
  if (!value.includes('R$'))
    return parseFloat(
      value
        .replace(/\./g, '') // remove pontos de milhar
        .replace(',', '.') // troca vírgula por ponto.trim() // remove espaços em branco
        .trim()
    );

  return parseFloat(
    value
      .replace('R$', '') // remove "R$"
      .replace(/\./g, '') // remove pontos de milhar
      .replace(',', '.') // troca vírgula por ponto
      .trim() // remove espaços em branco
  );
}
