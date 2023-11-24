
import { dbConnection } from "../Reference/config/mongoConnection";

const getCollectionFn = (collection) => {
    let _col = undefined;


    return async () => {
        if (!_col) {
            const db = await dbConnection();
            _col = await db.collection(collection);
        }

        return _col;
    };
};

export const users = getCollectionFn('Users');
export const coffeeBlend = getCollectionFn('Coffee');
export const subscription = getCollectionFn('Subscription');



