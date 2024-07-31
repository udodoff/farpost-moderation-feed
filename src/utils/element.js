export const findElemetHigherParent = (event) => {
    let target = event.target,
        parent = target,
        outmost = event.currentTarget;
    while (parent) {
        if (parent.parentElement === outmost) {
            break;
        }
        parent = parent.parentElement;
    }

    return { outmost, parent };
};
