export const decimalToBinary = (decimal, numBits) => {
    let binary = Math.abs(decimal).toString(2);
    binary = binary.padStart(numBits, '0').slice(-numBits);
    const BinResult = decimal < 0 ? '-' + binary : binary;

    return BinResult;
}


export const binaryToDecimal = (binary) => {
    let decimal = parseInt(binary, 2);
    return decimal;
}

