import React from "react";
import { twosComplement, unTwosComplement, binaryToDecimal, decimalToBinary } from "../../../utilites/convertDecBin";

class DivArithmetic extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            steps: [],
            currentStep: 0,
            registers: {
                A: [],
                ABin: [],
                Q: [],
                M: [],
                Count: 0,
                Thuong: [],
                Du: []
            },
            ReThuong: [],
            ReDu: [],
        };
    }

    componentDidMount() {
        this.calculateSteps();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.registerInputA_Bin !== this.props.registerInputA_Bin ||
            prevProps.registerInputB_Bin !== this.props.registerInputB_Bin ||
            prevProps.numBits !== this.props.numBits) {
            this.refreshStep();
            this.calculateSteps();
        }
    }

    refreshStep = () => {
        this.setState({ steps: [], currentStep: 0 });
    };

    calculateSteps = () => {
        const { registerInputA_Bin, registerInputB_Bin, numBits, signA, signB } = this.props;
        const binaryA = registerInputA_Bin.padStart(numBits, '0').split('').map(bit => parseInt(bit, 10));
        const binaryB = registerInputB_Bin.padStart(numBits, '0').split('').map(bit => parseInt(bit, 10));

        const steps = [];
        let registers = {
            A: Array(numBits).fill(0),
            ABin: [...binaryA],
            Q: [...binaryA],
            M: [...binaryB],
            Count: numBits + 1,
        };
        let ReDu = [];
        let ReThuong = [];

        if (!signA) {
            registers.Q = unTwosComplement(registers.Q);
        }
        if (!signB) {
            registers.M = unTwosComplement(registers.M);
        }

        for (let i = 0; i < numBits + 1; i++) {
            const step = {
                A: [...registers.A],
                Q: [...registers.Q],
                M: [...registers.M],
                ABin: [...registers.ABin],
                Adt: [],
                Qdt: [],
                Atm: [],
                subM: false,
                addM: false,
                dichT: false,
                Thuong: [],
                Du: [],
            };
            // Dịch trái A, Q
            registers.A = [...registers.A.slice(1), registers.Q[0]];
            registers.Q = [...registers.Q.slice(1), 0];
            step.Adt = registers.A;
            step.Qdt = registers.Q;

            step.dichT = true;

            // Lấy A = A - M
            registers.A = this.subtractBinary(registers.A, registers.M);
            step.Atm = registers.A;
            step.subM = true;

            //  A >= 0 ?
            if (this.isLessThanZero(registers.A)) {
                registers.Q[numBits - 1] = 0; //    Đặt Q[0] = 0
                registers.A = this.addBinary(registers.A, registers.M); // Lấy A = A + M
                step.addM = true;
            } else {
                registers.Q[numBits - 1] = 1; // Đặt Q[0] = 1
            }

            //Hiệu chỉnh dấu sau khi tính toán xong dựa trên dấu của A và B
            if (i === numBits - 1 && signA && signB) {
                ReThuong = [...registers.Q];
                ReDu = [...registers.A];
            }
            else if (i === numBits - 1 && signA && !signB) {

                ReThuong = [...twosComplement(registers.Q)];
                ReDu = [...registers.A]

            }
            else if (i === numBits - 1 && !signA && signB) {

                ReThuong = [...twosComplement(registers.Q)];
                ReDu = [...twosComplement(registers.A)]

            }
            else if (i === numBits - 1 && !signA && !signB) {
                ReThuong = [...registers.Q];
                ReDu = [...twosComplement(registers.A)]
            }
            // Lưu vào step
            steps.push(step);
        }

        this.setState({ steps, registers, ReDu, ReThuong });
    }

    isLessThanZero = (register) => {
        // Nếu bit đầu tiên là 1, thanh ghi là số âm
        if (register[0] === 1) {
            return true;
        } else {
            return false;
        }
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
        const complementB = twosComplement(b); // Lấy bù hai của b
        return this.addBinary(a, complementB); // Thực hiện phép cộng a với bù hai của b
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


    render() {
        const { currentStep, steps, registers } = this.state;
        const { numBits, numA_Dec, numB_Dec } = this.props;
        const currentStepData = steps[currentStep] || {};
        const currentRegisters = currentStepData || registers;

        return (
            <div className="md-simulate">
                <h2>Các bước mô phỏng tính toán</h2>
                <div>
                    <button onClick={this.handlePreviousStep} disabled={currentStep === 0}>Trước</button>
                    <button onClick={this.handleNextStep} disabled={currentStep === steps.length - 1}>Sau</button>
                </div>
                <div>
                    <h3>Phép chia: {this.props.numA_Dec} / {this.props.numB_Dec} = {registers.ABin.join('')} / {registers.M.join('')}</h3>
                    <h4>Thanh ghi M: {registers.M.join('')}</h4>
                    <table className="arithmetic-table">
                        <thead>
                            <tr>
                                <th colSpan={numBits}>A</th>
                                <th colSpan={numBits}>Q</th>
                                <th>Tính</th>
                                <th>Bộ đếm</th>
                            </tr>
                        </thead>
                        <tbody>
                            {steps.map((step, index) => (
                                <React.Fragment key={index}>
                                    <tr key={`row-${index}`} style={{ display: index <= currentStep ? 'table-row' : 'none' }}>
                                        {/* registers A */}
                                        {step.A && step.A.map((bit, index) => (
                                            <td key={`A-${index}`}>
                                                {bit}
                                            </td>
                                        ))}
                                        {/* registers Q */}
                                        {step.Q && step.Q.map((bit, index) => (
                                            <td key={`Q-${index}`}>
                                                {bit}
                                            </td>
                                        ))}
                                        {/* Add or Sub */}
                                        <td>
                                            {index === 0 ? 'Khởi tạo' : ''}
                                        </td>
                                        {/* Step */}
                                        <td>{- index + numBits}</td>
                                    </tr>
                                    {(index < numBits && step.dichT) && (
                                        <tr key={`row-${index}-dichT`} style={{ display: index <= currentStep ? 'table-row' : 'none' }}>
                                            {step.Adt && step.Adt.map((bit, index) => (
                                                <td key={`A-${index}`}>
                                                    {bit}
                                                </td>
                                            ))}
                                            {step.Qdt && step.Qdt.map((bit, index) => (
                                                <td key={`Q-${index}`}>
                                                    {bit}
                                                </td>
                                            ))}
                                            <td>Dịch trái</td>
                                            <td></td>
                                        </tr>
                                    )}
                                    {(index < numBits && step.subM) && (
                                        <tr key={`row-${index}-subM`} style={{ display: index <= currentStep ? 'table-row' : 'none' }}>
                                            {step.Atm && step.Atm.map((bit, index) => (
                                                <td key={`A-${index}`}>
                                                    {bit}
                                                </td>
                                            ))}
                                            {step.Qdt && step.Qdt.map((bit, index) => (
                                                <td key={`Q-${index}`}>
                                                    {bit}
                                                </td>
                                            ))}
                                            <td>A = A - M</td>
                                            <td></td>
                                        </tr>
                                    )}

                                    {(index === numBits) && (
                                        <tr key={`row-${index}-result`}  style={{ display: index <= currentStep ? 'table-row' : 'none' }}>
                                            {this.state.ReDu && this.state.ReDu.map((bit, index) => (
                                                <td key={`A-${index}`}>
                                                    -
                                                </td>
                                            ))}
                                            {this.state.ReThuong && this.state.ReThuong.map((bit, index) => (
                                                <td key={`Q-${index}`}>
                                                    -
                                                </td>
                                            ))}
                                            <td>-----------------------</td>
                                            <td>---</td>
                                        </tr>
                                    )}

                                    {(index === numBits) && (
                                        <tr key={`row-${index}-result`} style={{ display: index <= currentStep ? 'table-row' : 'none' }}>
                                            {this.state.ReDu && this.state.ReDu.map((bit, index) => (
                                                <td key={`A-${index}`}>
                                                    {bit}
                                                </td>
                                            ))}
                                            {this.state.ReThuong && this.state.ReThuong.map((bit, index) => (
                                                <td key={`Q-${index}`}>
                                                    {bit}
                                                </td>
                                            ))}
                                            <td>A = Dư, Q = Thương</td>
                                            <td></td>
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

export default DivArithmetic;