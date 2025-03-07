import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  cover_url: string;
}

const Books = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const { data, error } = await supabase
        .from('books')
        .select('*');

      if (error) throw error;
      if (data) setBooks(data);
    } catch (error: any) {
      console.error('Error fetching books:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ml-16 p-8 flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-400">Loading books...</div>
      </div>
    );
  }

  return (
    <div className="ml-16 p-8">
      <h1 className="text-3xl font-bold mb-8">Educational Books</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {books.map((book) => (
          <div key={book.id} className="bg-[#151b2c] rounded-xl overflow-hidden">
            <img
              src={book.cover_url || 'https://images.unsplash.com/photo-1589998059171-988d887df646?auto=format&fit=crop&q=80&w=1776&ixlib=rb-4.0.3'}
              alt={book.title}
              className="w-full h-64 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{book.title}</h3>
              <p className="text-gray-400 text-sm mb-4">by {book.author}</p>
              <p className="text-gray-400">{book.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Books;