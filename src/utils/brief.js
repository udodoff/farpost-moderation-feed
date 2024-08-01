export const isAllBriefsViewed = (bulletinStates) =>
    bulletinStates.reduce((accumulator, bulletinList) => accumulator + bulletinList.size, 0) === 10;
