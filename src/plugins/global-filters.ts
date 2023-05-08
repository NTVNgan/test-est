import { format } from 'date-fns';

function toFixedNumberic(number: number, fixed: number) {
    const regex = new RegExp('^-?\\d+(?:.\\d{0,' + (fixed || -1) + '})?');
    const strinNum: any = number.toString();
    const numberFixed = strinNum.match(regex)[0];
    const result = new Intl.NumberFormat(undefined, { maximumSignificantDigits: 20 }).format(numberFixed);
    return result;
}

export default function registerGlobalFilters(app: any) {
    app.config.globalProperties.filters = {
        formatCurrency(value: number, { rounded = 5, currency }: any) {
            if (isNaN(value)) {
                return 0;
            }
            if (currency) {
                switch (currency.toLowerCase()) {
                    case 'vnd':
                        return new Intl.NumberFormat().format(value) + ' VND';
                    case 'dolar':
                        return '$' + toFixedNumberic(value, rounded);
                }
            }
            return new Intl.NumberFormat().format(value);
        },
        formatDate(value: any, formatType: string) {
            if (value) {
                return format(value, formatType);
            }
            return '';
        },
    };
}
