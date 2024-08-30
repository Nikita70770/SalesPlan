import { useState, useEffect } from 'react';
import classNames from 'classnames';
import CalendarWindow from '@components/CalendarWindow';

import { MONTHS } from '@helpers/calendar';
import { numberWithSpaces, between, dataLoader } from '@helpers/helper';
import SalesService from '@services/sales.service';

import rating from '@data/rating.json';

import './App.css';
import 'react-calendar/dist/Calendar.css';

function AwardImage(props) {
    const { indRating, currSalesAsPerc, totalPayments, monthlyRate } = props;

    let arrIcons = rating[indRating]?.data
        .map(elem =>
            rating[indRating]?.data.length > 1
                ? between(currSalesAsPerc, elem.range[0], elem.range[1])
                    ? elem.imgIcon
                    : null
                : rating[indRating]?.data[0].imgIcon
        )
        .filter(elem => elem !== null);

    return (
        <div className="image_wrapper">
            {totalPayments > monthlyRate ? <img className="img_icon" src={arrIcons[0]} alt="" /> : null}
        </div>
    );
}

function Multiplier({ indRating, totalPayments, monthlyRate, styleColor }) {
    return totalPayments > monthlyRate ? (
        <span style={{ color: styleColor.color }} className="multiplier">
            {rating[indRating]?.multiplier}
        </span>
    ) : (
        String.fromCharCode('&shy;')
    );
}

function Header({ date, setDate, setSales }) {
    const [calendar, setCalendar] = useState(false);

    function onOpenCalendar() {
        setCalendar(true);
    }

    async function onChangeDate(dateVal) {
        const path = `http://10.199.2.111/successManagers?month=${
            dateVal.getMonth() + 1
        }&year=${dateVal.getFullYear()}`;

        await dataLoader(path).then(response => {
            const sales = Array.from(response);
            // Дополняем данные
            for (let i = 0; i < sales.length; i++) {
                sales[i]['total_payments'] = Math.ceil(sales[i]['total_payments']);
                sales[i]['monthly_rate'] = 2000000;
            }
            // Сортируем данные по убыванию
            sales.sort(function (a, b) {
                return b.total_payments - a.total_payments;
            });

            localStorage.setItem('date', new Date(dateVal).toString());

            setDate(dateVal);
            setSales(sales);
            setCalendar(!calendar);
        });
    }

    return (
        <header className="app_header">
            <div className="wrapper">
                <ul className="app_header_items">
                    <li className={classNames('header_item', 'logo')}>
                        <img src="/img/logo.svg" alt="Logo" />
                    </li>
                    <li className={classNames('header_item', 'header_title')}>План продаж</li>
                    <li className={classNames('header_item', 'date')}>
                        <button className="btn_select_date" onClick={onOpenCalendar}>
                            <p>
                                {MONTHS[date?.getMonth()]}&ensp;{date?.getFullYear()}
                            </p>
                            <img src="/img/arrow_down.svg" alt="" />
                        </button>
                        <CalendarWindow
                            stateCalendar={calendar}
                            setStateCalendar={setCalendar}
                            date={date}
                            setDate={onChangeDate}
                        />
                    </li>
                </ul>
            </div>
        </header>
    );
}

function SalesRowData({ item, indItem }) {
    const currSalesAsPercentage = SalesService.getCurrSalesAsPercentage(item.total_payments, item.monthly_rate);

    const styleColor = SalesService.getColorStyle(
        rating,
        SalesService.getMonthlyRate(item.total_payments, item.monthly_rate),
        currSalesAsPercentage
    );

    const styleSales = {
        background: styleColor.bcColor,
        gridColumn: `1/${currSalesAsPercentage === 0 ? 2 : currSalesAsPercentage} span`
    };

    const indRating = rating
        .map(elem => elem.monthlyRate)
        .indexOf(SalesService.getMonthlyRate(item.total_payments, item.monthly_rate));

    return (
        <tr key={indItem} className="row_sales">
            <td className="manager_cell">
                {item.manager_name}
                <AwardImage
                    indRating={indRating}
                    currSalesAsPerc={currSalesAsPercentage}
                    totalPayments={item.total_payments}
                    monthlyRate={item.monthly_rate}
                />
            </td>
            <td className="curr_amount_cell">
                <td className="curr_amount_sale">{numberWithSpaces(item.total_payments)}&nbsp;&#8381;</td>
                <td className="curr_amount_progress">
                    <td style={styleSales}>&shy;</td>
                    <td className={classNames('separator', '_50')}></td>
                    <td className={classNames('separator', '_90')}></td>
                </td>
            </td>
            <td className="monthly_rate_cell">
                <Multiplier
                    indRating={indRating}
                    totalPayments={item.total_payments}
                    monthlyRate={item.monthly_rate}
                    styleColor={styleColor}
                />
                <p className="monthly_rate_text">
                    {numberWithSpaces(SalesService.getMonthlyRate(item.total_payments, item.monthly_rate))}
                    &nbsp;&#8381;
                </p>
            </td>
        </tr>
    );
}

function SalesPlan({ data }) {
    // console.log(`sales: ${JSON.stringify(data, null, 4)}`);

    const currTotalSales = SalesService.getCurrTotalSales(data);
    const totalSales = SalesService.getTotalSales(data);
    const totalSalesAsPercentage = SalesService.getCurrTotalSalesAsPercentage(currTotalSales, totalSales);

    const styleGeneralSales = { backgroundColor: '#666666', gridColumn: `1/${totalSalesAsPercentage} span` };

    return (
        <main className="main">
            <div className="wrapper">
                <div className="main_content">
                    {data && data.length !== 0 ? (
                        <table className="sales_table">
                            <thead className="sales_thead">
                                <tr>
                                    <th align="left" className="total_title">
                                        Общий
                                    </th>
                                    <th className="curr_total_cell">
                                        <th className="curr_total_sales">
                                            {numberWithSpaces(currTotalSales)}&nbsp;&#8381;
                                        </th>
                                        <th className="curr_total_progress">
                                            <th style={styleGeneralSales}>&shy;</th>
                                            <th className={classNames('separator', '_50')}></th>
                                            <th className={classNames('separator', '_90')}></th>
                                        </th>
                                    </th>
                                    <th className="total_sales">{numberWithSpaces(totalSales)}&nbsp;&#8381;</th>
                                </tr>
                            </thead>
                            <tbody className="sales_tbody">
                                {data.map((item, indItem) => {
                                    return <SalesRowData indItem={indItem} item={item} />;
                                })}
                            </tbody>
                        </table>
                    ) : (
                        <p className="error_msg">Данные отсутствуют!</p>
                    )}
                </div>
            </div>
        </main>
    );
}

function App() {
    const [sales, setSales] = useState([]);
    const [date, setDate] = useState(new Date());

    useEffect(() => {
        localStorage.setItem('date', new Date().toString());

        let interval = setInterval(async () => {
            const month = new Date(localStorage.getItem('date')).getMonth() + 1;
            const year = new Date(localStorage.getItem('date')).getFullYear();
            const path = `http://10.199.2.111/successManagers?month=${month}&year=${year}`;

            await dataLoader(path).then(response => {
                const sales = Array.from(response);
                // Дополняем данные
                for (let i = 0; i < sales.length; i++) {
                    sales[i]['total_payments'] = Math.ceil(sales[i]['total_payments']);
                    sales[i]['monthly_rate'] = 2000000;
                }
                // Сортируем данные по убыванию
                sales.sort(function (a, b) {
                    return b.total_payments - a.total_payments;
                });
            });
        }, 5 * 60 * 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return (
        <div className="app">
            <Header date={date} setDate={setDate} setSales={setSales} />
            <SalesPlan data={sales} />
        </div>
    );
}

export default App;
