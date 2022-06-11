import React, { useState, useEffect } from 'react'

export default function JimWendler() {
    const [weightState, setWeightState] = useState("");
    const [repState, setRepState] = useState("");
    const [estimate, setEstimate] = useState([]);
    let temp = []; //Used to store the estimation calculations

    function resetFields(){
        temp = [];
        setWeightState("");
        setRepState("");
    }

    useEffect(() => {
        let orm = Math.round((weightState * repState * 0.0333) + weightState);
        for(let i = 0; i < 10; ++i){
            temp.push(orm * (100 - 3 * i)/ 100);
        }
        setEstimate(temp)
    }, [weightState, repState])

    return(
        // https://stackoverflow.com/questions/52409837/how-can-i-use-a-placeholder-with-a-number-input-in-react
        <div className="calculator-container">
            <h1>DEBUG OUTPUT:    {weightState} {repState}</h1>
            <h2>One rep max calculator</h2>
            <div className="calculator-interaction">
                <div className="input-container">
                    <div>
                        <input
                        type="number"
                        value={weightState}
                        placeholder="Weight (in lbs)"
                        onChange={(e) => {
                            setWeightState(Number(e.target.value));
                        }}
                        />
                    </div>

                    <div>
                        <input
                        type="number"
                        value={repState}
                        placeholder="Reps (amount)"
                        onChange={(e) => {
                            setRepState(Number(e.target.value));
                        }}/>
                    </div>
                </div>

                <div className="reset-container">
                    <button className="reset-button" onClick={resetFields}>Reset</button>
                </div>
            </div>

            <div className="calculator-estimate-container">
                {estimate.map((out, index) => {
                    if( repState > 0 && weightState > 0){
                        return(
                            <div className ="output-container">
                                <p className="rep-text">
                                    {100 - 3 * index} % of 1RM: {index+1} rep(s): <b className="weight">{out} lbs</b>
                                </p>
                            </div>)
                    }
                })} 
            </div>
        </div>
    );
}