import React,{useState} from "react";

export function AddProduct(url){
    const [showForm, setShowForm] = useState(false);
    function show () {
        setShowForm(true);
    };
    function hide(){
        setShowForm(false)
    }
    return(
        <>
            <div  id="add" className="products flex align-center center">
                <div onClick={show} className=" add">
                    <img src="../Images/add.svg" alt="addProduct"/>
                </div>
            </div>
            {showForm && (
                <div className="product-container">
                    <div className="product-name">
                        <h2>Add Product</h2>
                    </div>
                    <form id="addProduct" action={url.url} method="post">
                        <div className="product-cross">
                            <img onClick={hide} className="product-cross" src="../Images/cross.svg" alt="cancel"/>
                        </div>
                        <label htmlFor="productName">Product Name:</label>
                        <input type="text" id="productName" name="productName" autoComplete="off" required/>
                        <button className="product-button" type="submit">Add Product</button>
                    </form>
                </div>
            )}
        </>
    )
}