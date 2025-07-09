import React from 'react';
export function Navbar(){
    return(
    <div className="left">
        <div className="filters flex space-between align-center ">
            <p>TABLES</p>
            <img className="cross1 pointer relative invert" src="../Images/cross.svg" alt="cancel"/>
        </div>
        <div className="table pointer">
            <a href="/Departments">DEPARTMENTS</a>
        </div>
        <div className="table pointer">
            <a href="/Products">PRODUCTS</a>
        </div>
        <div className="table pointer">
            <a href="/StaffInfo">STAFF</a>
        </div>
    </div> 
    )
}
 