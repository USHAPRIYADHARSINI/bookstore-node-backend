import { client } from '../index.js';

export async function AddToCart({modifycart},{userid}) {                 //✔️
    return await client.db('bookstore').collection('users').findOneAndUpdate({userId:userid},{$set:{cart:modifycart}});
}

export async function getAllFromCart(id) {                 //✔️
    return await client.db('bookstore').collection('users').findOne({userId:id});
}

// export async function AddMoreToCart({userid},{cart}) {                 //✔️
//     return await client.db('bookstore').collection('users').findOneAndUpdate({userId:userid},{cart:cart});
// }