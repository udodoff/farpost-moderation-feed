export const setBriefState = (setCurrentState, previousStateSetters, value) => {
    previousStateSetters.map((setState) =>
        setState((previous) => {
            previous.delete(value);
            return new Set(previous);
        })
    );
    setCurrentState((previous) => new Set(previous.add(value)));
};

export const isAllBriefsViewed = (bulletinStates) =>
    bulletinStates.reduce((accumulator, bulletinList) => accumulator + bulletinList.size, 0) === 10;
