import { between } from '@helpers/helper';

const getCurrTotalSalesAsPercentage = (currTotalAmountSales, totalSales) => {
    return Math.ceil((currTotalAmountSales * 100) / totalSales);
};

const getCurrSalesAsPercentage = (amountSale, monthlyRate) => {
    const monthlyRateVal = getMonthlyRate(amountSale, monthlyRate);
    const range = [monthlyRateVal - monthlyRate, monthlyRateVal];
    return Math.floor(((amountSale - range[0]) * 100) / (range[1] - range[0]));
};

const getCurrTotalSales = sales => {
    return sales.map(elem => elem.total_payments).reduce((a, b) => a + b, 0);
};

const getTotalSales = sales => {
    return sales.map(elem => getMonthlyRate(elem.total_payments, elem.monthly_rate)).reduce((a, b) => a + b, 0);
};

const getMonthlyRate = (amountSale, monthlyRate) => {
    // console.log(`amountSale: ${amountSale}\nmonthlyRate: ${monthlyRate}`);
    const monthlyRateVal = amountSale === 0 ? monthlyRate : Math.ceil(amountSale / monthlyRate) * monthlyRate;
    return monthlyRateVal;
    // console.log(`monthlyRateVal: ${monthlyRateVal}`);
    // return monthlyRateVal >= 8000000 ? 8000000 : monthlyRateVal;
};

const getColorStyle = (rating, monthlyRateVal, percents) => {
    let monthlyRate = monthlyRateVal >= 8000000 ? 8000000 : monthlyRateVal;
    let colorStyle = { backgroundColor: '#ffffff' };

    const indRate = rating.map(elem => elem.monthlyRate).indexOf(monthlyRate);
    // console.log(`percents: ${percents}\nindRate: ${indRate}\nmonthlyRate:${monthlyRate}`);

    rating[indRate]?.data.map(elem => {
        const percentsVal = percents > 100 ? 100 : percents;
        if (between(percentsVal, elem.range[0], elem.range[1]))
            colorStyle = { bcColor: elem.bcColor, color: elem.color };
    });

    // console.log(`colorStyle: ${JSON.stringify(colorStyle, null, 4)}`);

    return colorStyle;
};

const SalesService = {
    getCurrTotalSalesAsPercentage,
    getCurrSalesAsPercentage,
    getCurrTotalSales,
    getTotalSales,
    getMonthlyRate,
    getColorStyle
    // getMultiplier
};

export default SalesService;
