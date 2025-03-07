import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Newspaper, Settings, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Course {
  id: string;
  title: string;
  description: string;
  duration: string;
  image_url: string;
  student_count: number;
}

interface NewsItem {
  id: string;
  title: string;
  content: string;
  image_url: string;
}

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [news, setNews] = useState<NewsItem[]>([]);

  useEffect(() => {
    fetchCourses();
    fetchNews();
  }, []);

  const fetchCourses = async () => {
    const { data } = await supabase
      .from('courses')
      .select('*')
      .limit(3);
    if (data) setCourses(data);
  };

  const fetchNews = async () => {
    const { data } = await supabase
      .from('news')
      .select('*')
      .limit(3);
    if (data) setNews(data);
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-16 bg-[#151b2c] flex flex-col items-center py-8 space-y-8">
        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg"></div>
        <nav className="flex flex-col space-y-6">
          <Link to="/news" className="p-3 text-gray-400 hover:text-blue-500 rounded-lg">
            <Newspaper size={20} />
          </Link>
          <Link to="/books" className="p-3 text-gray-400 hover:text-blue-500 rounded-lg">
            <BookOpen size={20} />
          </Link>
          <Link to="/settings" className="p-3 text-gray-400 hover:text-blue-500 rounded-lg">
            <Settings size={20} />
          </Link>
        </nav>
        <button
          onClick={() => signOut()}
          className="mt-auto p-3 text-gray-400 hover:text-red-500 rounded-lg"
        >
          <LogOut size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div className="ml-16 p-8 w-full">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.email}</h1>
          <p className="text-gray-400">Continue your journey to becoming an inventor</p>
        </header>

        {/* Latest News */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Latest IT News</h2>
            <Link to="/news" className="text-blue-500 hover:text-blue-400">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item) => (
              <div key={item.id} className="bg-[#151b2c] rounded-xl overflow-hidden">
                <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  <p className="text-gray-400">{item.content.substring(0, 100)}...</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Courses */}
        <section>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Your Courses</h2>
            <Link to="/courses" className="text-blue-500 hover:text-blue-400">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-[#151b2c] rounded-xl overflow-hidden">
                <img src={course.image_url} alt={course.title} className="w-full h-48 object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{course.title}</h3>
                  <p className="text-gray-400 mb-4">{course.description}</p>
                  <div className="flex justify-between items-center text-sm text-gray-400">
                    <span>{course.student_count} students</span>
                    <span>{course.duration}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;