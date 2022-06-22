import React, { useState, useEffect } from 'react';
import { ReactSession } from 'react-client-session';
import WorkoutSelector from './WorkoutSelector';
import GeneratedWorkout from './GeneratedWorkout';

export default function GeneratorDisplay() {
    const [displayState, setDisplayState] = useState('selecting');
    const [groupCount, setGroupCount] = useState(0);
    const [groupSelected, setGroupSelected] = useState([]);
    const [minutes, setMinutes] = useState(60);
    const [recent, setRecent] = useState([]);

    useEffect(() => {
        setRecent(ReactSession.get('MostRecentWorkout'));
    }, []);

    function handleVisibilityToggle() {
        setDisplayState(
            displayState === 'selecting' ? 'selected' : 'selecting'
        );
        setGroupSelected([]);
        setGroupCount(0);
    }

    function handleGenerateClick() {
        if (groupCount > 0) {
            setDisplayState('generated');
        } else {
            console.error('No group was selected');
        }
    }

    if (displayState === 'selecting') {
        //While using is selecting groups
        return (
            <WorkoutSelector
                minutes={minutes}
                setMinutes={setMinutes}
                handleGenerateClick={handleGenerateClick}
                handleVisibilityToggle={handleVisibilityToggle}
                groupCount={groupCount}
                setGroupCount={setGroupCount}
                groupSelected={groupSelected}
                setGroupSelected={setGroupSelected}
                recent={recent}
                setRecent={setRecent}
            />
        );
    } else if (displayState === 'generated') {
        //After user has selected all groups, and generates
        return (
            <GeneratedWorkout
                minutes={minutes}
                setMinutes={setMinutes}
                setDisplayState={setDisplayState}
                handleVisibilityToggle={handleVisibilityToggle}
                groupCount={groupCount}
                setGroupCount={setGroupCount}
                groupSelected={groupSelected}
                setGroupSelected={setGroupSelected}
            />
        );
    } else {
        //If user toggles see more/see less
        return (
            <>
                <div className="visibility-button-container">
                    <button
                        className="visibility-button"
                        onClick={handleVisibilityToggle}
                    >
                        <i className="far fa-eye"></i> See More
                    </button>
                </div>
            </>
        );
    }
}
