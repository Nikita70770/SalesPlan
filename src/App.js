import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import Calendar from 'react-calendar';

import { numberWithSpaces, between, dataLoader } from './helpers/helper';
import SalesService from './services/sales.service';

import rating from './data/rating.json';

import './App.css';

function Header({ date, setDate }) {
    const [calendar, setCalendar] = useState(false);

    return (
        <header className="app_header">
            <div className="wrapper">
                <ul className="app_header_items">
                    <li className="header_item logo">
                        <img src="/img/logo.svg" alt="Logo" />
                    </li>
                    <li className="header_item header_title">План продаж</li>
                    <li className="header_item date">Август 2024</li>
                </ul>
            </div>
        </header>
    );
}

function SalesPlan({ data }) {
    // console.log(`sales: ${JSON.stringify(data, null, 4)}`);

    const currTotalSales = SalesService.getCurrTotalSales(data);
    const totalSales = SalesService.getTotalSales(data);

    const totalSalesAsPercentage = SalesService.getCurrTotalSalesAsPercentage(currTotalSales, totalSales);
    // const totalMonthlyRate = SalesService.getMonthlyRate(currTotalSales, totalSales);

    return (
        <main className="main">
            <div className="wrapper">
                <div className="main_content">
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
                                        <th style={{ gridColumn: `1/${totalSalesAsPercentage} span` }}>&shy;</th>
                                        <th className="separator _50"></th>
                                        <th className="separator _90"></th>
                                    </th>
                                </th>
                                <th className="total_sales">{numberWithSpaces(totalSales)}&nbsp;&#8381;</th>
                            </tr>
                        </thead>
                        <tbody className="sales_tbody">
                            {data.map((item, indItem) => {
                                const currSalesAsPercentage = SalesService.getCurrSalesAsPercentage(
                                    item.total_payments,
                                    item.monthly_rate
                                );

                                const classNameProgress = SalesService.getMultiplier(
                                    rating,
                                    SalesService.getMonthlyRate(item.total_payments, item.monthly_rate),
                                    currSalesAsPercentage
                                );

                                const indRate = rating
                                    .map(elem => elem.monthlyRate)
                                    .indexOf(SalesService.getMonthlyRate(item.total_payments, item.monthly_rate));
                                let arrIcons = [];

                                // console.log(`classMultiplier: ${JSON.stringify(classMultiplier, null, 4)}`);

                                return (
                                    <tr key={indItem} className="row_sales">
                                        <td className="manager_cell">
                                            {item.manager_name}
                                            <div className="image_wrapper">
                                                {rating[indRate]?.data.map(elem => {
                                                    if (rating[indRate]?.data.length > 1) {
                                                        if (
                                                            between(currSalesAsPercentage, elem.range[0], elem.range[1])
                                                        ) {
                                                            arrIcons.push(elem.imgIcon);
                                                        }
                                                    } else arrIcons.push(rating[indRate]?.data[0].imgIcon);
                                                })}
                                                {item.total_payments > item.monthly_rate ? (
                                                    <img className="img_icon" src={arrIcons[0]} alt="" />
                                                ) : null}
                                            </div>
                                        </td>
                                        <td className="curr_amount_cell">
                                            <td className="curr_amount_sale">
                                                {numberWithSpaces(item.total_payments)}&nbsp;&#8381;
                                            </td>
                                            <td className="curr_amount_progress">
                                                <td
                                                    className={classNameProgress}
                                                    style={{
                                                        gridColumn: `1/${
                                                            currSalesAsPercentage === 0 ? 2 : currSalesAsPercentage
                                                        } span`
                                                    }}
                                                >
                                                    &shy;
                                                </td>
                                                <td className="separator _50"></td>
                                                <td className="separator _90"></td>
                                            </td>
                                        </td>
                                        <td className="monthly_rate_cell">
                                            {item.total_payments > item.monthly_rate ? (
                                                <span className={classNames('multiplier', classNameProgress)}>
                                                    {rating[indRate]?.multiplier}
                                                </span>
                                            ) : (
                                                String.fromCharCode('&shy;')
                                            )}
                                            <p className="monthly_rate_text">
                                                {numberWithSpaces(item.monthly_rate)}&nbsp;&#8381;
                                            </p>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}

function App() {
    const [sales, setSales] = useState([]);
    const [date, setDate] = useState({ month: 8, year: 2024 });
    const ref = useRef(null);

    useEffect(() => {
        const path = `http://10.199.2.111/successManagers?month=${date.month}&year=${date.year}`;

        let interval = setInterval(async () => {
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
                setSales(sales);
            });
        }, 5 * 60 * 1000);

        return () => {
            clearInterval(interval);
        };
    }, []);

    // useEffect(() => {
    //     async function loadData(path) {
    //         await dataLoader(path).then(response => {
    //             const sales = Array.from(response);
    //             // Дополняем данные
    //             for (let i = 0; i < sales.length; i++) {
    //                 sales[i]['total_payments'] = Math.ceil(sales[i]['total_payments']);
    //                 sales[i]['monthly_rate'] = 2000000;
    //             }
    //             // Сортируем данные по убыванию
    //             sales.sort(function (a, b) {
    //                 return b.total_payments - a.total_payments;
    //             });
    //             setSales(sales);
    //         });
    //     }
    //     loadData(`http://10.199.2.111/successManagers?month=${date.month}&year=${date.year}`);
    // }, []);

    return (
        <div className="app">
            <Header date={date} setDate={setDate} />
            <SalesPlan data={sales} />
        </div>
    );
}

export default App;
