export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('fr-CD', {
        style: 'currency',
        currency: 'CDF',
        minimumFractionDigits: 0
    }).format(amount);
}

export function formatNumber(number: number): string {
    return new Intl.NumberFormat('fr-FR').format(number);
}
