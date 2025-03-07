import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { PlusCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'news' | 'books' | 'courses'>('news');
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '',
    description: '',
    duration: '',
    image_url: '',
  });

  useEffect(() => {
    fetchItems();
  }, [activeTab]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(activeTab)
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase
        .from(activeTab)
        .insert([formData]);

      if (error) throw error;

      toast.success('Item added successfully!');
      setShowAddForm(false);
      setFormData({
        title: '',
        content: '',
        author: '',
        description: '',
        duration: '',
        image_url: '',
      });
      fetchItems();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="ml-16 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <button
            onClick={() => setActiveTab('news')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'news' ? 'bg-blue-600' : 'bg-[#151b2c]'
            }`}
          >
            News
          </button>
          <button
            onClick={() => setActiveTab('books')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'books' ? 'bg-blue-600' : 'bg-[#151b2c]'
            }`}
          >
            Books
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`px-4 py-2 rounded-lg ${
              activeTab === 'courses' ? 'bg-blue-600' : 'bg-[#151b2c]'
            }`}
          >
            Courses
          </button>
        </div>

        {/* Add Button */}
        <button
          onClick={() => setShowAddForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg mb-6"
        >
          <PlusCircle size={20} />
          <span>Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</span>
        </button>

        {/* Add Form */}
        {showAddForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-[#151b2c] rounded-xl p-6 max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">
                Add New {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a0f1c] rounded-lg"
                    required
                  />
                </div>

                {activeTab === 'books' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Author</label>
                    <input
                      type="text"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                      className="w-full px-4 py-2 bg-[#0a0f1c] rounded-lg"
                      required
                    />
                  </div>
                )}

                {activeTab === 'courses' && (
                  <div>
                    <label className="block text-sm font-medium mb-2">Duration</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      className="w-full px-4 py-2 bg-[#0a0f1c] rounded-lg"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    {activeTab === 'news' ? 'Content' : 'Description'}
                  </label>
                  <textarea
                    value={activeTab === 'news' ? formData.content : formData.description}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        [activeTab === 'news' ? 'content' : 'description']: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 bg-[#0a0f1c] rounded-lg"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <input
                    type="url"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    className="w-full px-4 py-2 bg-[#0a0f1c] rounded-lg"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                  >
                    Add Item
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Content List */}
        {loading ? (
          <div className="text-center text-gray-400">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-[#151b2c] rounded-xl overflow-hidden">
                <img
                  src={item.image_url || 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&q=80&w=1774&ixlib=rb-4.0.3'}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                  {activeTab === 'books' && (
                    <p className="text-gray-400 text-sm mb-2">by {item.author}</p>
                  )}
                  <p className="text-gray-400">
                    {item.content || item.description}
                  </p>
                  {activeTab === 'courses' && (
                    <p className="text-gray-400 text-sm mt-2">
                      Duration: {item.duration}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;