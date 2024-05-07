export const decimalToBinary = (decimal, numBits) => {
    let binary = Math.abs(decimal).toString(2);
    binary = binary.padStart(numBits, '0').slice(-numBits);

    // Nếu là số âm, thực hiện phép đảo bit và cộng 1
    if (decimal < 0) {
        let complement = '';
        for (let i = 0; i < binary.length; i++) {
            complement += binary[i] === '0' ? '1' : '0';
        }
        binary = (parseInt(complement, 2) + 1).toString(2);
    }

    // Đảm bảo số bit đúng
    binary = binary.padStart(numBits, '0').slice(-numBits);

    return binary;
}


export const binaryToDecimal = (binary) => {
    let decimal = parseInt(binary, 2);
    return decimal;
}

export const twosComplement = (binary) => {
    let complement = binary.map(bit => (bit === 0 ? 1 : 0));

    // Thực hiện phép cộng 1 để có số bù 2 của binaryB
    let carry = 1;
    for (let i = binary.length - 1; i >= 0; i--) {
        let sum = complement[i] + carry;
        complement[i] = sum % 2;
        carry = Math.floor(sum / 2);
    }
    let spot = [...complement]
    // Hiển thị binaryB dưới dạng số bù hai
    for (let i = 0; i < binary.length; i++) {
        spot[i] = spot[i] === 0 ? 1 : 0;
    }

    return complement;
}

export const unTwosComplement = (binary) => {
    let complement = [...binary];

    // Lấy bù đối của tất cả các bit
    for (let i = 0; i < complement.length; i++) {
        complement[i] = complement[i] === 0 ? 1 : 0;
    }

    // Thực hiện phép cộng 1
    let carry = 1;
    for (let i = complement.length - 1; i >= 0; i--) {
        let sum = complement[i] + carry;
        complement[i] = sum % 2;
        carry = Math.floor(sum / 2);
    }

    return complement;
};
