export default function useState(initState) {
    let state = {...initState};

    function getState() {
        return {...state};
    }

    function setState(update) {
        if (typeof update === "function") state = {...state, ...update(state)}
        else if (typeof update === "object") state = {...state, ...update}
        else console.error("state must be function or Object.");
    }
    return [getState, setState];
}