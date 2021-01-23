let init = '';
export default function jian(a = init,action){
    const {type,data} = action;
    let newdata='';
    switch (type) {
        case 'saveTitle':
            newdata = data
            return newdata
            case 'deletetitle':
            newdata = ''
            return newdata
        default:
            return a
    }
}