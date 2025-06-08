import React from 'react';
import BookList from '../components/BookList';

const sampleBooks = [
  { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald' },
  { id: 2, title: '1984', author: 'George Orwell' },
  { id: 3, title: 'To Kill a Mockingbird', author: 'Harper Lee' }
];

const Home: React.FC = () => (
  <main>
    <h1>Welcome to the Book Club!</h1>
    <BookList books={sampleBooks} />
  </main>
);

export default Home;