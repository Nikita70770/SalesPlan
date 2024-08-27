const getCurrTotalSalesAsPercentage = (currTotalAmountSales, totalSales) => {
    return Math.ceil((currTotalAmountSales * 100) / totalSales);
};

const getCurrSalesAsPercentage = (amountSale, monthlyRate) => {
    const monthlyRateVal = getMonthlyRate(amountSale, monthlyRate);
    const range = [monthlyRateVal - monthlyRate, monthlyRateVal];
    return Math.floor(((amountSale - range[0]) * 100) / (range[1] - range[0]));
};

const getCurrTotalSales = sales => {
    return sales.map(elem => elem.amountSale).reduce((a, b) => a + b, 0);
};

const getTotalSales = sales => {
    return sales.map(elem => elem.monthlyRate).reduce((a, b) => a + b, 0);
};

const between = (x, min, max) => {
    return x >= min && x <= max;
};

const getMonthlyRate = (amountSale, monthlyRate) => {
    return Math.ceil(amountSale / monthlyRate) * monthlyRate;
};

const getColorStyle = (rating, monthlyRate, percents) => {
    let colorStyle = { backgroundColor: '#ffffff' };
    // console.log(`percents: ${percents}`);

    console.log(`rating: ${JSON.stringify(rating, null, 4)}`);
    const indRate = rating.map(elem => elem.monthlyRate).indexOf(monthlyRate);

    rating[indRate]?.data.map(elem => {
        if (between(percents, elem.range[0], elem.range[1])) colorStyle = elem.bcColor;
    });

    return colorStyle;
};

const SalesService = {
    getCurrTotalSalesAsPercentage,
    getCurrSalesAsPercentage,
    getCurrTotalSales,
    getTotalSales,
    getMonthlyRate,
    getColorStyle
};

export default SalesService;

// if (amountSale < 2000000) {
//     if (percents <= 50) colorStyle = { backgroundColor: '#D71920' };
//     else if (percents > 50 && percents <= 90) colorStyle = { backgroundColor: '#666666' };
//     else if (percents > 90 && percents <= 100)
//         colorStyle = { background: 'linear-gradient(90deg, #AEBC5B 0%, #A5B452 100%)' };
// } else if (amountSale > 2000000 && amountSale <= 4000000) {
//     if (percents <= 50) colorStyle = { background: 'linear-gradient(284.38deg, #CE8257 34.67%, #ECAC88 66.73%)' };
//     else if (percents > 50 && percents <= 90)
//         colorStyle = { background: 'linear-gradient(275.69deg, #B0B0B0 14.75%, #E7E7E7 51.62%, #B0B0B0 88.49%)' };
//     else if (percents > 90 && percents <= 100)
//         colorStyle = { background: 'linear-gradient(284.38deg, #CEAB57 34.67%, #D2B05E 38.83%, #EACF8F 66.73%)' };
// } else if (amountSale > 4000000 && amountSale <= 6000000) {
//     if (percents <= 50)
//         colorStyle = { background: 'linear-gradient(278.41deg, #BFDADA 21.94%, #D9F2F2 49.43%, #CCD9D9 76.92%)' };
//     else if (percents > 50 && percents <= 90)
//         colorStyle = { background: 'linear-gradient(284.38deg, #CE5782 34.67%, #EA7BA3 66.73%)' };
//     else if (percents > 90 && percents <= 100)
//         colorStyle = { background: 'linear-gradient(284.38deg, #52BFD8 34.67%, #49A1B5 66.73%)' };
// } else if (amountSale > 6000000) colorStyle = { backgroundColor: '#000000' };
