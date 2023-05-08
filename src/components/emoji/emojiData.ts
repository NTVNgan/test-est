import emojis from './emojis.json';
import _ from 'lodash';

let arr:any = [];
const arr_emojis = _.groupBy(_.sortBy(emojis, ['category', 'sort_order']), 'category');
for (const key in arr_emojis) {
    arr.push({
        name: key,
        key: key.replace(' ', '_').toLowerCase(),
        img: arr_emojis[key][0].image,
        img_position_x: arr_emojis[key][0].sheet_x,
        img_position_y: arr_emojis[key][0].sheet_y,
        emojis: arr_emojis[key],
    });
}
arr = _.sortBy(arr, function(item) {
    return item.key === 'smileys_& people' ? 0 : 7;
});

const getEmojiByUID = (arr_ids: any) => {
    return arr_ids.reduce((acc: any, id: any) => {
        acc.push(emojis.find(o => o.unified === id));
        return acc;
    }, []);
    return emojis.filter(o => arr_ids.indexOf(o.unified) > -1)
}

export {
    getEmojiByUID,
}

export default arr
