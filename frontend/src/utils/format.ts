const nf = new Intl.NumberFormat('it-IT', { maximumFractionDigits: 0 })
const cf = new Intl.NumberFormat('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 })
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

export const fmtNum = (n: number) => (n ? nf.format(Math.round(n)) : '-')
export const fmtEur = (n: number) => cf.format(n)
export const signed = (n: number, text: string) => `${n >= 0 ? '+' : ''}${text}`
export const parseNum = (s: string) => Number(s.replace(/\./g, '').replace(',', '.'))
export const monthLabel = (period: string) => MONTHS[Number(period.slice(5, 7)) - 1]
export const fmtPrice = (n: number) => n.toLocaleString('it-IT', { minimumFractionDigits: 2, maximumFractionDigits: 2 })