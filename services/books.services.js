import { client } from '../index.js';

export async function getAllBooks() {                //✔️
    return await client.db('bookstore').collection('books').find({}).toArray();
}

export async function addNewBook(newbook) {                //✔️
    return await client.db('bookstore').collection('books').insertMany(newbook);
}

export async function getBookById(Id) {                //✔️
    return await client.db('bookstore').collection('books').findOne({isbn13:Id});
}
