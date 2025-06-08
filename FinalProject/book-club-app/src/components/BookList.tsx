import React from 'react';

interface Book {
    id: number;
    title: string;
    author: string;
}

interface BookListProps {
    books: Book[];
}

const BookList: React.FC<BookListProps> = ({ books }) => {
    return (
        <div>
            <h2>Book List</h2>
            <ul>
                {books.map(book => (
                    <li key={book.id}>
                        <strong>{book.title}</strong> by {book.author}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default BookList;