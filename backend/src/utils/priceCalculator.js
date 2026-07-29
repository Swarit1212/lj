const priceCalculator=(product,ratePerGram)=>{
    const purityFactor=(product.material==="gold")? (product.purity/24) : (product.purity/1000);
    const metalPrice=product.weight*purityFactor*ratePerGram;
    
    const makingCharge=(product.makingChargeType==="perGram")? (product.makingCharge*product.weight) : product.makingCharge;

    const subTotal=metalPrice+makingCharge;

    const tax=subTotal*0.03;
    const totalPrice=subTotal+tax;

    return({
        rate:ratePerGram,
        purity:product.purity,
        metalPrice:Math.round(metalPrice),
        makingCharge:Math.round(makingCharge),
        subTotal:Math.round(subTotal),
        tax:Math.round(tax),
        totalPrice:Math.round(totalPrice)
    })
}
export default priceCalculator;