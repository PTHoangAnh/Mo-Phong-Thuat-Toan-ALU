import React from "react";

class MulArithmetic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            steps: [],
            currentStep: 0,
            registers: {
                A: [],
                Q: [],
                M: [],
                C: 0,
                Q_1: 0,
                Count: 0,
            },
            isUnsigned: true
        };
    }

    componentDidMount() {
        this.calculateSteps();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.registerInputA_Bin !== this.props.registerInputA_Bin ||
            prevProps.registerInputB_Bin !== this.props.registerInputB_Bin ||
            prevProps.numBits !== this.props.numBits ||
            prevState.isUnsigned !== this.state.isUnsigned) {
            this.refreshStep();
            this.calculateSteps();
        }
    }

    refreshStep = () => {
        this.setState({ steps: [], currentStep: 0 });
    };

    calculateSteps = () => {
        const { registerInputA_Bin, registerInputB_Bin, numBits } = this.props;
        const { isUnsigned } = this.state;
        const binaryA = registerInputA_Bin.padStart(numBits, '0').split('').map(bit => parseInt(bit, 10));
        const binaryB = registerInputB_Bin.padStart(numBits, '0').split('').map(bit => parseInt(bit, 10));

        const steps = [];
        let registers = {
            A: Array(numBits).fill(0),
            Q: [...binaryA],
            M: [...binaryB],
            C: 0,
            Q_1: 0,
            Count: numBits + 1,
        };

        for (let i = 0; i < numBits + 1; i++) {
            // Step để tính toán
            const step = { A: [...registers.A], Q: [...registers.Q], M: [...registers.M], C: registers.C, addM: false, subM: false, dichP: false };

            // Kiểm tra bit cuối của Q
            if (isUnsigned) {
                // Nếu là nhân không dấu
                if (registers.Q[numBits - 1] === 1) {
                    // A = A + M
                    registers.A = this.addBinary(registers.A, registers.M);
                    step.addM = true;
                }
            } else {
                // Nếu là nhân có dấu
                if (registers.Q[numBits - 1] === 1 && registers.C === 0) {
                    // A = A + M
                    registers.A = this.addBinary(registers.A, registers.M);
                    step.addM = true;
                } else if (registers.Q[numBits - 1] === 0 && registers.C === 1) {
                    // A = A - M
                    registers.A = this.subtractBinary(registers.A, registers.M);
                    step.subM = true;
                }
            }
            // Lưu giá trị của Q[numBits - 1] trước khi dịch phải
            registers.C = registers.Q[numBits - 1];

            // Shift right A, Q
            registers.Q = [registers.A[numBits - 1], ...registers.Q.slice(0, numBits - 1)];
            registers.A = [registers.A[0], ...registers.A.slice(0, numBits - 1)];

            step.dichP = true;
            // Lưu bước tính toán
            steps.push(step);
        }

        this.setState({ steps, registers });
    }



    addBinary = (a, b) => {
        let result = [];
        let carry = 0;

        for (let i = a.length - 1; i >= 0; i--) {
            let sum = a[i] + b[i] + carry;
            result.unshift(sum % 2);
            carry = Math.floor(sum / 2);
        }

        return result;
    }

    subtractBinary = (a, b) => {
        let result = [];
        let borrow = 0;

        for (let i = a.length - 1; i >= 0; i--) {
            let diff = a[i] - b[i] - borrow;
            if (diff < 0) {
                diff += 2;
                borrow = 1;
            } else {
                borrow = 0;
            }
            result.unshift(diff);
        }

        return result;
    }


    handleNextStep = () => {
        const { currentStep, steps } = this.state;
        if (currentStep < steps.length - 1) {
            this.setState({ currentStep: currentStep + 1 });
        }
    }

    handlePreviousStep = () => {
        const { currentStep } = this.state;
        if (currentStep > 0) {
            this.setState({ currentStep: currentStep - 1 });
        }
    }

    handleUnsigned = () => {
        // Thiết lập trạng thái để tính toán nhân không dấu
        this.setState({ isUnsigned: true }, () => {
            const { registerInputA_Bin, registerInputB_Bin, numBits } = this.props;
            this.calculateSteps(registerInputA_Bin, registerInputB_Bin, numBits, true);
            this.setState({ isSignedDisabled: false });
        });
    }

    handleSigned = () => {
        // Thiết lập trạng thái để tính toán nhân có dấu
        this.setState({ isUnsigned: false }, () => {
            const { registerInputA_Bin, registerInputB_Bin, numBits } = this.props;
            this.calculateSteps(registerInputA_Bin, registerInputB_Bin, numBits, false);
            this.setState({ isSignedDisabled: true });
        });
    }


    render() {
        const { currentStep, steps, registers, isUnsigned } = this.state;
        const { numBits } = this.props;

        const currentStepData = steps[currentStep] || {};
        const currentRegisters = currentStepData || registers;


        return (
            <div className="mul-arithmetic">
                <h2>Steps:</h2>
                <div>
                    <button onClick={this.handleUnsigned} disabled={isUnsigned}>Unsigned</button>
                    <button onClick={this.handleSigned} disabled={!isUnsigned}>Signed</button>
                    <button onClick={this.handlePreviousStep} disabled={currentStep === 0}>Prev</button>
                    <button onClick={this.handleNextStep} disabled={currentStep === steps.length - 1}>Next</button>
                </div>
                <div>
                    <h3>Current Step: {- currentStep + numBits}</h3>
                    <table className="arithmetic-table">
                        <thead>
                            <tr>
                                <th colSpan={numBits}>A</th>
                                <th colSpan={numBits}>Q</th>
                                <th>Tính</th>
                                <th>Step</th>
                            </tr>
                        </thead>
                        <tbody>
                            {steps.map((step, index) => (
                                <tr key={index} style={{ display: index <= currentStep ? 'table-row' : 'none' }}>
                                    {/* registers A */}
                                    {step.A && step.A.map((bit, index) => (
                                        <td key={'A' + index}>
                                            {bit}
                                        </td>
                                    ))}
                                    {/* registers Q */}
                                    {step.Q && step.Q.map((bit, index) => (
                                        <td key={'Q' + index}>
                                            {bit}
                                        </td>
                                    ))}
                                    {/* Add or Sub */}
                                    <td>
                                        {index === 0 ? 'Khởi tạo' : step.addM ? 'Dịch phải, A + M' : step.subM ? 'Dịch phải, A - M' : step.dichP ? 'Dịch phải' : ''}                 
                                    </td>
                                    {/* Step */}
                                    <td>{index}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default MulArithmetic;
