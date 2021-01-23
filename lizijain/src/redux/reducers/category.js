let init = [];
export default function product(pre = init,action){
    const {type,data} = action;
    let newdata;
    switch (type) {
        case 'savecate':
            newdata = [...data]
            return newdata
        default:
            return pre
        
    }
}