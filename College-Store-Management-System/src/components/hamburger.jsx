import React from "react";

export function Hamburger(){
    return(
        <div className="right">
        <div className="head flex align-center space-between">
            <div className="h-left flex align-center">
                <div className="hamburger relative pointer">
                    <img className="absolute" src="../Images/hamburger.svg" alt="hamburger"/>
                </div>
                <div className="T-name">
                    <h3>PRODUCTS</h3>
                </div>
            </div>
        </div>
    </div>
    )
}