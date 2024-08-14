import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
    const [baseCurrency, setBaseCurrency] = useState('USD');
    const [targetCurrency, setTargetCurrency] = useState('EUR');
    const [amount, setAmount] = useState(1);
    const [exchangeRate, setExchangeRate] = useState(null);
    const [convertedAmount, setConvertedAmount] = useState(null);
    const [currencies, setCurrencies] = useState([]);

    useEffect(() => {
        const fetchCurrencies = async () => {
            try {
                const response = await axios.get('https://open.er-api.com/v6/latest/USD');
                setCurrencies(Object.keys(response.data.rates));
                setExchangeRate(response.data.rates[targetCurrency]);
            } catch (error) {
                console.error("Error fetching currency data", error);
            }
        };

        fetchCurrencies();
    }, []);

    useEffect(() => {
        const calculateConversion = () => {
            if (exchangeRate) {
                setConvertedAmount((amount * exchangeRate).toFixed(2));
            }
        };

        calculateConversion();
    }, [amount, exchangeRate]);

    const handleBaseCurrencyChange = (e) => {
        setBaseCurrency(e.target.value);
    };

    const handleTargetCurrencyChange = (e) => {
        setTargetCurrency(e.target.value);
        fetchExchangeRate(e.target.value);
    };

    const handleAmountChange = (e) => {
        setAmount(e.target.value);
    };

    const fetchExchangeRate = async (currency) => {
        try {
            const response = await axios.get(`https://open.er-api.com/v6/latest/${baseCurrency}`);
            setExchangeRate(response.data.rates[currency]);
        } catch (error) {
            console.error("Error fetching exchange rate", error);
        }
    };

    return (
        <div className="container">
            <h1>Калькулятор курса валют</h1>
            <div className="calculator">
                <input
                    type="number"
                    value={amount}
                    onChange={handleAmountChange}
                />
                <select value={baseCurrency} onChange={handleBaseCurrencyChange}>
                    {currencies.map((currency) => (
                        <option key={currency} value={currency}>{currency}</option>
                    ))}
                </select>
                <span> = </span>
                <input
                    type="text"
                    value={convertedAmount || ''}
                    readOnly
                />
                <select value={targetCurrency} onChange={handleTargetCurrencyChange}>
                    {currencies.map((currency) => (
                        <option key={currency} value={currency}>{currency}</option>
                    ))}
                </select>
            </div>
            {convertedAmount && <h2>Эквивалент: {convertedAmount} {targetCurrency}</h2>}
        </div>
    );
};

export default App;