import React, { useState, useEffect } from 'react';
import { ScrollMenu } from 'react-horizontal-scrolling-menu';

function EstimateCard(props) {
    return (
        <div className="display-card-calc">
            <div>
                <h2 className="group-text-calc">
                    {props.i === 0
                        ? `${props.i + 1} Repitition`
                        : `${props.i + 1} Repititions`}
                </h2>
            </div>

            <div className="group-card-calc">
                <p className="rep-text">
                    {100 - 3 * props.i} % of 1 rep max: {props.i + 1} rep(s):{' '}
                    <b className="weight">{props.out} lbs</b>
                </p>
            </div>
        </div>
    );
}

// Add these different calculation types:
// 1. Brzycki formula: Weight × (36 / (37 – number of reps))
// 2. Epley formula: Weight × (1 + (0.0333 × number of reps))
// 3. Lombardi formula: Weight × (number of reps ^ 0.1)
// 4. O’Conner formula: Weight × (1 + (0.025 × number of reps))

const calculationTypeList = [
    'Jim Wendler Formula',
    'Brzycki Formula',
    'Epley Formula',
    'Lombardi Formula',
    "O'Conner Formula",
    'Average All',
];

export default function Calculator() {
    const [weightState, setWeightState] = useState('');
    const [repState, setRepState] = useState('');
    const [estimate, setEstimate] = useState([]);
    const [calcType, setCalcType] = useState(calculationTypeList[0]);

    function resetFields() {
        setEstimate([]);
        setWeightState('');
        setRepState('');
    }

    useEffect(() => {
        let orm = Math.round(
            Number(weightState) * Number(repState) * 0.0333 +
                Number(weightState)
        );
        let temp = []; //Used to store the estimation calculations
        for (let i = 0; i < 10; ++i) {
            temp.push((orm * (100 - 3 * i)) / 100);
        }
        setEstimate(temp);
    }, [weightState, repState]);

    return (
        <>
            <div className="calculator-container">
                <h2 className="calc-title-text">One rep max calculator</h2>
                <div className="calculator-interaction">
                    <div className="input-container">
                        <div>
                            <input
                                type="number"
                                value={weightState}
                                placeholder="Weight (in lbs)"
                                onChange={(e) => {
                                    if (e.target.value <= 0) setWeightState('');
                                    else if (e.target.value <= 10000)
                                        setWeightState(e.target.value);
                                    else setWeightState(10000);
                                }}
                            />
                        </div>

                        <div>
                            <input
                                type="number"
                                value={repState}
                                placeholder="Reps (amount)"
                                onChange={(e) => {
                                    if (e.target.value <= 0) setRepState('');
                                    else if (
                                        e.target.value <= 1000 &&
                                        e.target.value >= 0
                                    )
                                        setRepState(e.target.value);
                                    else setRepState(1000);
                                }}
                            />
                        </div>
                    </div>

                    <div className="calculation-type-container">
                        Debug: {calcType}
                        <h2 className="calculation-type-text">
                            Calculation type:
                        </h2>
                        <select
                            value={calcType}
                            onChange={(e) => {
                                setCalcType(e.target.value);
                            }}
                        >
                            {calculationTypeList.map((item) => {
                                return <option value={item}> {item}</option>;
                            })}
                        </select>
                    </div>

                    <div className="reset-container">
                        <button className="reset-button" onClick={resetFields}>
                            <i className="fas fa-sync"></i> Reset
                        </button>
                    </div>
                </div>
            </div>
            <ScrollMenu>
                {estimate.map((out, index) => {
                    if (repState > 0 && weightState > 0) {
                        return (
                            <EstimateCard
                                out={out}
                                i={index}
                                key={index}
                                calcType={calcType}
                            />
                        );
                    } else {
                        return <p key={out}></p>; //Return nothing if user has not selected any options
                    }
                })}
            </ScrollMenu>
        </>
    );
}