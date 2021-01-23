let init = [];
export default function product(pre = init,action){
    const {type,data} = action;
    let newdata;
    switch (type) {
        case 'saveprod':
            newdata = [...data]
            return newdata
            break;
    
        default:
            return pre
        
    }
}