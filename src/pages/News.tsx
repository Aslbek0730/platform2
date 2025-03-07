import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image_url: string;
  created_at: string;
}

const News = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) setNews(data);
    } catch (error: any) {
      console.error('Error fetching news:', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="ml-16 p-8 flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-400">Loading news...</div>
      </div>
    );
  }

  return (
    <div className="ml-16 p-8">
      <h1 className="text-3xl font-bold mb-8">Latest IT News</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {news.map((item) => (
          <div key={item.id} className="bg-[#151b2c] rounded-xl overflow-hidden">
            <img
              src={item.image_url || 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=1774&ixlib=rb-4.0.3'}
              alt={item.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-400">{item.content}</p>
              <p className="text-sm text-gray-500 mt-4">
                {new Date(item.created_at).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;