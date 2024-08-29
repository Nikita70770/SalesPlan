export const WEEK_DAYS = {
    Monday: 'Понедельник',
    Tuesday: 'Вторник',
    Wednesday: 'Среда',
    Thursday: 'Четверг',
    Friday: 'Пятница',
    Saturday: 'Суббота',
    Sunday: 'Воскресенье'
};
export const MONTHS = [
    'Январь',
    'Февраль',
    'Март',
    'Апрель',
    'Май',
    'Июнь',
    'Июль',
    'Август',
    'Сентябрь',
    'Октябрь',
    'Ноябрь',
    'Декабрь'
];
export const TEST_MONTHS = ['Январь', 'Февраль', 'Март'];
// export const TEST_MONTHS = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь'];
export const YEARS = [2022, 2023, 2024, 2025, 2026];

export function getDateInFormatDDMMYY(year, month, day) {
    return new Date(year, month, day).toLocaleDateString('pl', { day: 'numeric', month: 'numeric', year: '2-digit' });
}

export function getDateFromString(date) {
    let parts = date.split('.');
    return new Date(Number('20' + parts[2]), Number(parts[1] - 1), Number(parts[0]));
}
