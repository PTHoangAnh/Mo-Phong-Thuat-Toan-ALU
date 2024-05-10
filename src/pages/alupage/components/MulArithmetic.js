import React from "react";
import { unTwosComplement } from "../../../utilites/convertDecBin";
import './mdArithmetic.scss'

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
        const { registerInputA_Bin, registerInputB_Bin, numBits, signA, signB } = this.props;
        const { isUnsigned } = this.state;
        const binaryA = registerInputA_Bin.padStart(numBits, '0').split('').map(bit => parseInt(bit, 10));
        const binaryB = registerInputB_Bin.padStart(numBits, '0').split('').map(bit => parseInt(bit, 10));

        const steps = [];
        let registers = {
            A: Array(numBits).fill(0),
            Q: [...binaryA],
            M: [...binaryB],
            C: 0,
            Count: numBits + 1,
        };

        if (isUnsigned) {
            if (!signA) {
                registers.Q = unTwosComplement(registers.Q);
            }
            if (!signB) {
                registers.M = unTwosComplement(registers.M);
            }
        }

        for (let i = 0; i < numBits + 1; i++) {
            // Lưu thông tin các thanh ghi của mỗi bước
            const step = {
                A: [...registers.A],
                Q: [...registers.Q],
                M: [...registers.M],
                C: 0,
                Q_1: 0,
                Atm: [],
                Acm: [],
                addM: false,
                subM: false,
                dichP: false
            };

            step.Q_1 = registers.C;
           
            // Nếu là nhân không dấu
            if (isUnsigned) {
                if (registers.Q[numBits - 1] === 1) {
                    // A = A + M
                    registers.A = this.addBinary(registers.A, registers.M);
                    step.Acm = registers.A;
                    step.addM = true;
                }

            } else {
                // Nếu là nhân có dấu
                if (registers.Q[numBits - 1] === 1 && registers.C === 0) {
                    // A = A - M
                    registers.A = this.subtractBinary(registers.A, registers.M);
                    step.Atm = registers.A;
                    step.subM = true;
                } else if (registers.Q[numBits - 1] === 0 && registers.C === 1) {
                    // A = A + M
                    registers.A = this.addBinary(registers.A, registers.M);
                    step.Acm = registers.A;
                    step.addM = true;
                }
            }

            // Lưu giá trị của Q_1 trước khi dịch phải
            registers.C = registers.Q[numBits - 1];
            step.C = registers.C;

            // Dịch phải A, Q
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
        const { numBits, numA_Dec, numB_Dec } = this.props;

        const currentStepData = steps[currentStep] || {};
        const currentRegisters = currentStepData || registers;


        return (
            <div className="md-simulate">
                <h2>Các bước mô phỏng tính toán</h2>
                <div>
                    <button onClick={this.handleUnsigned} disabled={isUnsigned}>Nhân không dấu</button>
                    <button onClick={this.handleSigned} disabled={!isUnsigned}>Nhân có dấu</button>
                    <br/>
                    <button onClick={this.handlePreviousStep} disabled={currentStep === 0}>Trước</button>
                    <button onClick={this.handleNextStep} disabled={currentStep === steps.length - 1}>Sau</button>
                </div>
                <div>
                    <h3>Bước hiện tại: {- currentStep + numBits}</h3>
                    <h3>Thanh ghi M: {registers.M.join('')}</h3>
                    <table className="arithmetic-table">
                        <thead>
                            <tr>
                                <th colSpan={numBits}>A</th>
                                <th colSpan={numBits}>Q</th>
                                <th>Q-1</th>
                                <th>Bộ đếm</th>
                                <th>Mô tả</th>
                            </tr>
                        </thead>
                        <tbody>
                            {steps.map((step, index) => (
                                <React.Fragment key={index}>
                                    <tr key={`row-${index}`} style={{ display: index <= currentStep ? 'table-row' : 'none' }}>
                                        {/* registers A */}
                                        {step.A && step.A.map((bit, index) => (
                                            <td className="registersA" key={'A' + index}>
                                                {bit}
                                            </td>
                                        ))}
                                        {/* registers Q */}
                                        {step.Q && step.Q.map((bit, index) => (
                                            <td className="registersQ" key={'Q' + index}>
                                                {bit}
                                            </td>
                                        ))}
                                        {step.Q_1 && (
                                            <td key={'Q-1'}>
                                                {step.Q_1}
                                            </td>
                                        )}

                                        {/* Bộ đếm */}
                                        <td>{- index + numBits}</td>

                                        {/* Mô tả */}
                                        <td>
                                            {index === 0 ? 'Khởi tạo' : 'Dịch phải, BĐ <- BĐ-1'}
                                        </td>
                                    </tr>
                                    {(index < numBits && step.subM) && (
                                        <tr key={`row-${index}-subM`} style={{ display: index <= currentStep ? 'table-row' : 'none' }}>
                                            {step.Atm && step.Atm.map((bit, index) => (
                                                <td className="registersA" key={`A-${index}`}>
                                                    {bit}
                                                </td>
                                            ))}
                                            {step.Q && step.Q.map((bit, index) => (
                                                <td className="registersQ" key={'Q' + index}>
                                                    {bit}
                                                </td>
                                            ))}
                                            {step.Q_1 && (
                                                <td key={'Q-1'}>
                                                    {step.Q_1}
                                                </td>
                                            )}
                                            <td>.</td>
                                            <td>A = A - M</td>
                                        </tr>
                                    )}
                                    {(index < numBits && step.addM) && (
                                        <tr key={`row-${index}-addM`} style={{ display: index <= currentStep ? 'table-row' : 'none' }}>
                                            {step.Acm && step.Acm.map((bit, index) => (
                                                <td className="registersA" key={`A-${index}`}>
                                                    {bit}
                                                </td>
                                            ))}
                                            {step.Q && step.Q.map((bit, index) => (
                                                <td className="registersQ" key={'Q' + index}>
                                                    {bit}
                                                </td>
                                            ))}
                                            {step.Q_1 && (
                                                <td key={'Q-1'}>
                                                    {step.Q_1}
                                                </td>
                                            )}
                                            <td>.</td>
                                            <td>A = A + M</td>
                                        </tr>
                                    )}
                                </React.Fragment>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

export default MulArithmetic;
