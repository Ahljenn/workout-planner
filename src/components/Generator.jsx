import React, { useTransition } from 'react';
import { ReactSession } from 'react-client-session';
import * as data from '../data/workout-data';
import * as ajax from '../helpers/ajax';
import * as util from '../helpers/util';
import { useAlert } from 'react-alert';

ReactSession.setStoreType('localStorage');

function builder(data, time, count) {
    util.durstenfeldShuffle(data); //Shuffle the data

    /* Remove elements depending on the count
    10-30 minutes: 3 workouts
    30-40 minutes: 4 workouts
    40-60 minutes: 5 workouts
    60-90 minutes: 6-7 workouts
    120 minutes: 8-10 workouts
    120-160 minutes: 12 workouts
    160-180 minutes: 12 workouts, added reps
    180-240 minutes: 12 workouts, added reps x2
    */

    //Trim array depending on user selection
    if (util.inRange(time, 20, 30)) {
        data.splice(0, data.length - 3 - count + 1);
    } else if (util.inRange(time, 31, 40)) {
        data.splice(0, data.length - 4 - count + 1);
    } else if (util.inRange(time, 41, 60)) {
        data.splice(0, data.length - 6 - count + 1);
    } else if (util.inRange(time, 61, 90)) {
        data.splice(0, data.length - 7 - count + 1);
    } else if (util.inRange(time, 91, 120)) {
        data.splice(0, data.length - 9 - count + 1);
    } else if (util.inRange(time, 121, 160)) {
        data.splice(0, data.length - 12 - count + 1);
    } else if (util.inRange(time, 161, 180)) {
        data.splice(0, data.length - 12 - count + 1);
    } else if (util.inRange(time, 181, 240)) {
        data.splice(0, data.length - 12 - count + 1);
    }

    //Build reps and sets
    data.forEach((item, index) => {
        let type = item.split('/')[1][1]; //Get string if it is weighted or not - single char
        data[index] = { title: item.split('/')[0] }; //Get name of workout
        let reps, difficulty, randDiff, randReps, randSets, randMin, minutes;
        switch (type) {
            case 'w': //weighted
                reps = [8, 10, 12, 14];
                difficulty = ['Light', 'Medium', 'Heavy'];
                randDiff =
                    difficulty[Math.floor(Math.random() * difficulty.length)];
                randReps = reps[Math.floor(Math.random() * reps.length)];
                randSets = Math.floor(Math.random() * (5 - 2) + 2);
                data[index] = {
                    ...data[index],
                    reps: `${randReps} reps x ${randSets} sets - ${randDiff}`,
                }; //Add object to same index with title
                break;
            case 'n': //nonweighted
                reps = [10, 30, 60];
                randReps = reps[Math.floor(Math.random() * reps.length)];
                randSets = Math.floor(Math.random() * (4 - 2) + 2);
                data[index] = {
                    ...data[index],
                    reps: `${randReps} reps x ${randSets} sets`,
                };
                break;
            case 'c': //cardio
                minutes = [10, 15, 20, 30]; //Should add up to provided user minutes
                randMin = minutes[Math.floor(Math.random() * minutes.length)];
                data[index] = { ...data[index], minutes: `${randMin} minutes` };
                break;
            default:
                console.error('Unexpected parsing failure');
        }
    });
    return data;
}

export default function Generator(props) {
    const [isPending, startTransition] = useTransition();
    const alert = useAlert();

    let tempData = [];

    //Go through each workout, accessing them based on their key, then push them to temp data
    //Info is pushed with their workout and if its weighted or nonweighted
    props.groups.forEach((item) => {
        if (item !== 'Random') {
            Object.entries(data.workouts[item.toLowerCase()]).forEach(
                (wkoutObj) => {
                    // console.log(wkoutObj[0]);
                    wkoutObj[1].forEach((wkoutItem) => {
                        tempData.push(`${wkoutItem} / ${wkoutObj[0]}`);
                    });
                }
            );
        } else {
            let keys = Object.keys(data.workouts);
            let randomWorkout = keys[(keys.length * Math.random()) << 0];
            for (const key in data.workouts[randomWorkout]) {
                for (const i in data.workouts[randomWorkout][key]) {
                    tempData.push(
                        `${data.workouts[randomWorkout][key][i]} / ${key}`
                    );
                }
            }
        }
    });
    builder(tempData, props.minute, props.count);

    // console.log(tempData);
    return (
        <div className="main-generator-display">
            <div className="todays-workout-container">
                <h2 className="today">Today's workout</h2>
                {isPending ? (
                    <div className="loading-container">
                        <i className="fas fa-spinner fa-spin"></i>
                    </div>
                ) : (
                    tempData.map((item) => {
                        return (
                            <div
                                className="set-container"
                                key={item.reps + item.title + util.getTimeShort}
                            >
                                <h2
                                    className={
                                        item.reps === undefined
                                            ? 'set-title-text-none'
                                            : 'set-title-text'
                                    }
                                >
                                    {item.title}
                                </h2>
                                <p className="set-text">{item.reps}</p>
                                <p className="set-text-minutes">
                                    {item.minutes}
                                </p>
                            </div>
                        );
                    })
                )}
            </div>

            <div>
                <p className="date">{util.getTimeShort()}</p>
                <p className="minute-text-estimate">
                    <span>Estimated time of completion: </span>
                    {props.minute >= 60
                        ? Math.floor(props.minute / 60)
                        : props.minute}
                    {props.minute >= 60
                        ? ` hours and ${props.minute % 60} minutes`
                        : ' minutes'}
                </p>
            </div>

            <div className="store-container">
                <button
                    className="store-button"
                    onClick={() => {
                        ReactSession.set('MostRecentWorkout', tempData); //Store recent workout in session

                        ajax.sendPostRequest('/query/insertWorkout', tempData)
                            .then((result) => {
                                startTransition(() => {
                                    console.log(
                                        'Stored into database...',
                                        result
                                    );

                                    //reset the parameters
                                    props.setGroupSelected([]);
                                    props.setGroupCount(0);
                                    props.setMinutes(60);
                                    props.setDisplayState('selecting'); //Rerenders display in other component

                                    alert.success('Stored workout success!'); //Show only after the re-render
                                });
                            })
                            .catch((err) => {
                                alert.error(err);
                            });
                    }}
                >
                    <i className="fas fa-database"></i> Store
                </button>
            </div>
        </div>
    );
}
