import { useState, useEffect } from 'react';

import { dataLoader } from './helpers/helper';

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

// function SalesManager({ title }) {
//     return (
//         <li className="sales_manager">
//             <p>{title}</p>
//         </li>
//     );
// }

// function SalesCurrentAmount({ currAmount }) {
//     return (
//         <li className="currnet_sales">
//             <p>{currAmount}</p>
//         </li>
//     );
// }

// function SalesMaxAmount({ maxAmount }) {
//     return (
//         <li className="max_sales_amount">
//             <p>{maxAmount}</p>
//         </li>
//     );
// }

// function SalesGeneral({ currGeneralAmount, maxGeneralAmount }) {
//     return (
//         <li className="sales_general">
//             <ul className="sales_general_content">
//                 <SalesManager title={'Общий'} />
//                 <SalesCurrentAmount currAmount={currGeneralAmount} />
//                 <SalesMaxAmount maxAmount={maxGeneralAmount} />
//             </ul>
//         </li>
//     );
// }

// function SalesItem({ item }) {
//     const managerSales = {
//         'fullName': item.fullName,
//         'amountSale': item.amountSale,
//         'maxAmount': item.maxAmount
//     };

//     return (
//         <li className="sales_item">
//             <ul className="sales_general_content">
//                 <SalesManager title={managerSales.fullName} />
//                 <SalesCurrentAmount currAmount={managerSales.amountSale} />
//                 <SalesMaxAmount maxAmount={managerSales.maxAmount} />
//             </ul>
//         </li>
//     );
// }

function SalesPlan({ data }) {
    return (
        <main className="main">
            <div className="wrapper">
                <div className="main_content">
                    <table className="sales_table">
                        <thead className="sales_thead">
                            <tr>
                                <th>Общие</th>
                                <th>7500000</th>
                                <th>15000000</th>
                            </tr>
                        </thead>
                        <tbody className="sales_tbody">
                            {data.map(item => {
                                return (
                                    <tr>
                                        <td>{item.fullName}</td>
                                        <td className="amount_sale_cell">
                                            <td style={{ backgroundColor: 'red' }}>{item.amountSale}</td>
                                            <td style={{ backgroundColor: '#f1f1f1' }}></td>
                                            <td style={{ backgroundColor: 'blue' }}></td>
                                        </td>
                                        <td>{item.maxAmount}</td>
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
