import React from 'react';
import { useState } from 'react';

export function Product({ product_name}) {
    const [isVisible, setIsVisible] = useState(true);
    function visibilityNone(e) {
        // Make a DELETE request to delete the product
        const isConfirmed = window.confirm('Are you sure you want to delete this product?');
        if(isConfirmed){
            e.stopPropagation();
            fetch("/Products-Delete", {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify( {product_name} )
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete product');
                }
                setIsVisible(false); // Set isVisible to false when request is successful
            })
            .catch(error => {
                console.error('Error making DELETE request:', error);
                // Handle error
            });
    }
    
}
    // async function handleProductClick() {
    //     try {
    //         const response = await fetch(`/filteredProduct?product_name=${encodeURIComponent(product_name)}`, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json'
    //             }
    //         });
            
    //         if (!response.ok) {
    //             throw new Error('Failed to fetch data');
    //         }
        
    //     } catch (error) {
    //         console.error('Error making GET request:', error);
    //         // Handle error
    //     }
    // }     onClick={handleProductClick}         

    return isVisible ? (
        <div className="products">
            <div className="cross inline relative pointer">
                <img onClick={visibilityNone} id="img1" src="../Images/cross.svg" alt="cancel" />
            </div>
            <div className="text flex align-center center">
                <h4><b><a href={`/filteredProduct?product_name=${product_name}`}>{product_name}</a></b></h4>
            </div>
        </div>
    ) : null;    
}
