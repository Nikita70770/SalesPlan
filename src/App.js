import { useState, useEffect } from 'react';

import { dataLoader } from './helpers/helper';
import SalesService from './services/sales.service';

import rating from './data/rating.json';

import './App.css';

function Header() {
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
    const currTotalSales = SalesService.getCurrTotalSales(data);
    const totalSales = SalesService.getTotalSales(data);
    const totalSalesAsPercentage = SalesService.getCurrTotalSalesAsPercentage(currTotalSales, totalSales);

    const styleGeneralSales = {
        ...SalesService.getColorStyle(rating, currTotalSales, totalSalesAsPercentage),
        gridColumn: `1/${totalSalesAsPercentage} span`
    };
    return (
        <main className="main">
            <div className="wrapper">
                <div className="main_content">
                    <table className="sales_table">
                        <thead className="sales_thead">
                            <tr>
                                <th>Общие</th>
                                <th className="curr_total_sales">
                                    <th style={styleGeneralSales}>{currTotalSales}</th>
                                    <th className="separator _50"></th>
                                    <th className="separator _90"></th>
                                </th>
                                <th>{SalesService.getTotalSales(data)}</th>
                            </tr>
                        </thead>
                        <tbody className="sales_tbody">
                            {data.map(item => {
                                const currSalesAsPercentage = SalesService.getCurrSalesAsPercentage(
                                    item.amountSale,
                                    item.monthlyRate
                                );
                                const styleColor = SalesService.getColorStyle(
                                    rating,
                                    SalesService.getMonthlyRate(item.amountSale, item.monthlyRate),
                                    currSalesAsPercentage
                                );
                                const styleSales = {
                                    ...styleColor,
                                    gridColumn: `1/${currSalesAsPercentage} span`
                                };
                                const indRate = rating
                                    .map(elem => elem.monthlyRate)
                                    .indexOf(SalesService.getMonthlyRate(item.amountSale, item.monthlyRate));
                                return (
                                    <tr>
                                        <td>{item.fullName}</td>
                                        <td className="curr_amount_sale">
                                            <td style={styleSales}>{item.amountSale}</td>
                                            <td className="separator _50"></td>
                                            <td className="separator _90"></td>
                                        </td>
                                        <td>
                                            <span className="multiplier">{rating[indRate]?.multiplier}</span>
                                            {item.monthlyRate}
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

    useEffect(() => {
        async function loadData(path) {
            await dataLoader(path).then(response => setSales(response));
        }
        loadData('http://10.199.2.118:3000/sales.json');
    }, []);

    return (
        <div className="app">
            <Header />
            <SalesPlan data={sales} />
        </div>
    );
}

export default App;
