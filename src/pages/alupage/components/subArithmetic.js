import React from "react";
import { toast } from 'react-toastify';
import './asArithmetic.scss';

class SubArithmetic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            steps: [],
            binaryResult_Array: [],
            currentStep: 0,
            flagOverflow: false,
            currentStepIndex: 0,
            complementBin: [],

        };
    }

    refreshStep = () => {
        this.setState({ flagOverflow: false, currentStep: 0 });
    };

    componentDidMount() {
        this.calculateSteps();
    }

    componentDidUpdate(prevProps) {
        if (prevProps.registerInputA_Bin !== this.props.registerInputA_Bin ||
            prevProps.registerInputB_Bin !== this.props.registerInputB_Bin) {
            this.calculateSteps();
        }
    }

    calculateSteps() {
        const { registerInputA_Bin, registerInputB_Bin, numBits } = this.props;
        const { complementBin } = this.state;
        const binaryA = registerInputA_Bin.padStart(numBits, '0').split('').map(bit => parseInt(bit, 10));
        const binaryB = registerInputB_Bin.padStart(numBits, '0').split('').map(bit => parseInt(bit, 10));

        // Thực hiện phép đảo bit (complement) của binaryB
        let complementB = binaryB.map(bit => (bit === 0 ? 1 : 0));

        // Thực hiện phép cộng 1 để có số bù 2 của binaryB
        let carry = 1;
        for (let i = numBits - 1; i >= 0; i--) {
            let sum = complementB[i] + carry;
            complementB[i] = sum % 2;
            carry = Math.floor(sum / 2);
        }
        let spot = [...complementB]
        // Hiển thị binaryB dưới dạng số bù hai
        for (let i = 0; i < numBits; i++) {
            spot[i] = spot[i] === 0 ? 1 : 0;
        }

        this.setState({ complementBin: spot });

        // Thực hiện phép cộng của binaryA với số bù 2 của binaryB
        let result = [];
        let steps = [];
        let binaryResult_Array = [];
        carry = 0;

        for (let i = 0; i < numBits; i++) {
            const sum = binaryA[numBits - i - 1] + complementB[numBits - i - 1] + carry;
            result.unshift(sum % 2);
            let currentSumResult = [...result];
            steps.push({
                step: i + 1,
                binaryA: binaryA.slice(numBits - i - 1).join(''),
                binaryB: complementB.slice(numBits - i - 1).join(''),
                sum: sum % 2,
                carry: Math.floor(sum / 2),
                sumResult: currentSumResult.join('')
            });
            carry = Math.floor(sum / 2);
            binaryResult_Array.unshift(sum % 2);
        }
        this.setState({ steps: steps, binaryResult_Array: binaryResult_Array, complementBin: spot });
    }

    handleNextStep = () => {
        const { currentStep, steps } = this.state;
        if (currentStep < steps.length - 1) {
            this.setState({ currentStep: currentStep + 1 });
        }

        if (currentStep === steps.length - 2) {
            const lastStepCarry = steps[currentStep + 1].carry;
            if (lastStepCarry === 1) {
                this.setState({ flagOverflow: true });
                toast.warn(`Register Overflow`);
            }
        }
    }

    handlePreviousStep = () => {
        const { currentStep } = this.state;
        this.setState({ flagOverflow: false });
        if (currentStep > 0) {
            this.setState({ currentStep: currentStep - 1 });
        }
    }

    render() {
        const { steps, binaryResult_Array, currentStep, flagOverflow, complementBin } = this.state;
        const { registerInputA_Bin, registerInputB_Bin, numBits } = this.props;

        const binaryA_Array = registerInputA_Bin.split('').map(bit => parseInt(bit, 10));
        const binaryB_Array = registerInputB_Bin.split('').map(bit => parseInt(bit, 10));

        return (
            <div className="simulate">
                <div>
                    <table className="process-table">
                        <thead>
                            <tr>
                                <th>Thứ tự bit</th>
                                {Array(numBits)
                                    .fill()
                                    .map((_, index) => (
                                        <th key={index}>
                                            {numBits - index - 1}
                                        </th>
                                    ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Thanh ghi A</td>
                                {binaryA_Array.map((bit, index) => (
                                    <td key={index}>{bit}</td>
                                ))}
                            </tr>
                            <tr>
                                <td>Thanh ghi B</td>
                                {binaryB_Array.map((bit, index) => (
                                    <td key={index}>{bit}</td>
                                ))}
                            </tr>
                            <tr>
                                <td>Kết quả</td>
                                {binaryResult_Array.map((bit, index) => (
                                    <td key={index}>{bit}</td>
                                ))}
                            </tr>
                        </tbody>
                    </table>
                </div>
                <h2>Các bước mô phỏng tính toán</h2>
                <div>
                    <button onClick={this.handlePreviousStep} disabled={currentStep === 0}>Prev</button>
                    <button onClick={this.handleNextStep} disabled={currentStep === steps.length - 1}>Next</button>
                </div>
                <div>
                    <h3>Bước hiện tại: {currentStep + 1}</h3>
                    <table className="arithmetic-table">
                        <thead>
                            <tr>
                                <th>Thứ tự bit</th>
                                {Array(numBits)
                                    .fill()
                                    .map((_, index) => (
                                        <th key={index}>
                                            {numBits - index - 1}
                                        </th>
                                    ))}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Thanh ghi A</td>
                                {binaryA_Array.map((bit, index) => (
                                    <td key={index} className={currentStep === numBits - index - 1 ? "highlight-column" : ""}>
                                        {bit}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td>Thanh ghi B </td>
                                {complementBin.map((bit, index) => (
                                    <td key={index} className={currentStep === numBits - index - 1 ? "highlight-column" : ""}>
                                        {bit === 0 ? 1 : 0}
                                    </td>
                                ))}
                            </tr>
                            <tr>
                                <td>Thanh ghi Result</td>
                                {Array(numBits)
                                    .fill()
                                    .map((_, index) => (
                                        <td key={index} className={currentStep === numBits - index - 1 ? "highlight-column" : ""}>
                                            {steps[currentStep]?.sumResult.split('').reverse()[numBits - index - 1] || '0'}
                                        </td>
                                    ))}
                            </tr>
                        </tbody>
                    </table>
                    <table className="flag-table">
                        <tbody>
                            <tr>
                                <td>Cờ Tổng </td>
                                <td >{steps[currentStep]?.sum}</td>
                            </tr>
                            <tr>
                                <td>Cờ Nhớ </td>
                                <td >{steps[currentStep]?.carry}</td>
                            </tr>
                            <tr>
                                <td>Cờ Tràn </td>
                                <td >{flagOverflow ? '1' : '0'}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default SubArithmetic;
