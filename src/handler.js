// import nanoid
const { nanoid } = require('nanoid');
// import bookd
const books = require('./books');

// add books
const addBooksHandler = (request, h) => {
    const {
        name, year, author, summary, publisher, pageCount, readPage, reading,
    } = request.payload;

    const id = nanoid(16);
    const finished = pageCount === readPage;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    const newBooks ={
        id, 
        name, 
        year, 
        author, 
        summary, 
        publisher, 
        pageCount, 
        readPage, 
        reading, 
        finished, 
        insertedAt,
        updatedAt,
    };

    books.push(newBooks);
    // response gagal code 400
    if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }); response.code(400);
        return response;
    } 
    if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }); response.code(400);
        return response;
    }

    // response status 201
    const isSuccess = books.filter((books) => books.id === id).length > 0;
    if (isSuccess) {
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        }); response.code(201);
        return response;   
        }

        // response status 500
        const response = h.response({
            status: 'fail',
            message: 'Buku gagal ditambahkan',
        }); response.code(500);
        return response;
    };

    // get all books
    const getAllBooksHandler = () => ({
        status: 'success',
        data: {
            books: [],
        },
    });
    
    // get books detail
    const getBooksByIdHandler = (request, h) => {
        const { id } = request.params;

        const book = books.filter((book) => book.id === id)[0];

        if (book !== undefined) {
            const response = h.response({ 
                status: 'success',
                data: {
                    book,
                },
            }); response.code(200);
            return response;
        }

        // response status 404
        const response = h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        }); response.code(404);
        return response;
    };

    // edit books
    const editBooksByIdHandler = (request, h) => {
        const { id } = request.params;

        const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
        // response status 400
        if (!name) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        }); response.code(400);
        return response;    
        }

        // response status 400
        if (readPage > pageCount) {
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }); response.code(400);
        return response;
        }

        const finished = pageCount === readPage;
        const updatedAt = new Date().toISOString();

        const index = books.findIndex((books) => books.id === id);


        if (index !== -1) {
            books[index] = {
                ...books[index],
                name, year, author, summary, publisher, pageCount, readPage, reading, finished, updatedAt,
            };
        
        // response status 200
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui',
        }); response.code(200);
        return response;
        }
    
        // response status 404
        const response = h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Id tidak ditemukan',
        }); response.code(404);
        return response;

    };

    // delete books
    const deleteBooksByIdHandler = (request, h) => {
        const { id } = request.params;

        const index = books.findIndex((books) => books.id === id);

        if (index !== -1) {
            books.splice(index, 1);
            // response status 200
            const response = h.response({
                status: 'success',
                message: 'Buku berhasil dihapus',
            }); response.code(200);
            return response;
            }
        
            // response status 404
            const response = h.response({
                status: 'fail',
                message: 'Buku gagal dihapus. Id tidak ditemukan',
            }); response.code(404);
            return response;
        };
        
module.exports = { addBooksHandler, getAllBooksHandler, getBooksByIdHandler, editBooksByIdHandler, deleteBooksByIdHandler };