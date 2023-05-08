export const validateEmail = (value: any) => {
    if (value) {
        // value = value.toLowerCase();
        // const lastChar = value.split('@')[0].slice(-1);
        // let last = false;
        // if (lastChar === '-' || lastChar === '.' || lastChar === '_') {
        //     last = false;
        // } else last = true;
        // console.log(lastChar, 1)
        // backup last code
        // const re = new RegExp(/^(?!_)(?!_$)\w+([a-zA-Z0-9.!#$%&'*+=?^_`{|}~-])*@\w+([.-]?\w+)*(\.\w{2,})+$/); 
        // const re = new RegExp(/^(?!_)(?!_$)\w+([a-zA-Z0-9.!#$%&'*+=?^_`{|}~-])*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,}[a-zA-Z0-9])*(\.\w{2,})+$/);
        // const re = new RegExp(/^(?!_)(?!_$)\w+([a-zA-Z0-9._-])*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,}[a-zA-Z0-9])*(\.\w{2,})+$/);
        // const re = new RegExp(/^(?!_)(?!_$)\w+(?:[a-zA-Z0-9._-]{0,1}[a-zA-Z0-9])*@[a-zA-Z0-9](?:[a-zA-Z0-9.-]{0,1}[a-zA-Z0-9])*(\.[a-zA-Z0-9]{2,})+$/);
        const regex = new RegExp(/(^[a-zA-Z0-9]+(?:[._-][a-zA-Z0-9]+)*)@([a-zA-Z0-9]+(?:[.-][a-zA-Z0-9]+)*[.][a-zA-Z]{2,})+$/);
        return regex.test(value);
        // const requiedEmail = re.test(value);
        // return requiedEmail && last;
    }
    return false;
};

export const validatePhoneNumber = (value: any) => {
    if (value) {
        const regex = new RegExp(/^[0-9+()\s-]{8,20}$/gm);
        return regex.test(value)
    }
    return false;
};
