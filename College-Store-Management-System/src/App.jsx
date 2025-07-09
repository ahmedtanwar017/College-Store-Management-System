import React from 'react';
import  { useState, useEffect } from 'react';
import { Product } from "./components/product";
// import { Navbar } from './components/navbar';
// import { Hamburger } from './components/hamburger';
import { AddProduct } from './components/addProduct';


function App() {
    let [productNames, setproductNames] = useState([]);

    useEffect(() => {
        async function fetchProductNames() {
            try {
                const response = await fetch('/ProductNamesId');
                if (!response.ok) {
                    throw new Error('Failed to fetch product names');
                }
                const data = await response.json();
                
                setproductNames(data);
            } catch (error) {
                console.error('Error fetching product names:', error);
                // Handle error
            }
        }
        fetchProductNames();
    }, []);
    let [ledgerNames, setledgerNames] = useState([]);

    useEffect(() => {
        async function fetchLedgerNames() {
            try {
                const response = await fetch('/LedgerNamesId');
                if (!response.ok) {
                    throw new Error('Failed to fetch product names');
                }
                const data = await response.json();
                
                setledgerNames(data);
            } catch (error) {
                console.error('Error fetching product names:', error);
                // Handle error
            }
        }
        fetchLedgerNames();
    }, []);
  return (
    
    <>
    <div className="app container grid">
        {productNames.map(product =>{
            return <Product key={product.Product_id} product_name={product.Product_name} />
        })}
        <AddProduct url={"/Products-Filter"}/>
    </div>
        <div className="separator"></div>
        <div className='T-name'>
            <h3>LEDGER</h3>
        </div>
    <div className="app container grid">
        {ledgerNames.map(ledger =>{
            return <Product key={ledger.Ledger_id} product_name={ledger.Ledger_name} />
        })}
        <AddProduct url={"/Ledger-Filter"}/>

    </div>
    </>
  );
}

export default App;
