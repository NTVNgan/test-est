export const addClass = (element: any, className: any) => {
    if (element.classList) element.classList.add(className);
    else element.className += ' ' + className;
}

export const removeClass = (element: any, className: any) => {
    if (element.classList) element.classList.remove(className);
    else
        element.className = element.className.replace(
            new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'),
            ' ',
        );
}
export const getHeight = (el: any) => {
    let height = el.offsetHeight;
    const style = getComputedStyle(el);

    height -=
        parseFloat(style.paddingTop) +
        parseFloat(style.paddingBottom) +
        parseFloat(style.borderTopWidth) +
        parseFloat(style.borderBottomWidth);

    return height;
}
