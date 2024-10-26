// Home.js
import React, { useState, useEffect } from 'react';
import { db } from './utils/Firebase';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';

function Home() {
  const [posts, setPosts] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [expandedPostId, setExpandedPostId] = useState(null);

  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, 'posts')); // Fetch from 'posts'
      const postsList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsList);
      setFilteredPosts(postsList);
    };
    fetchPosts();
  }, []);

 
  const handleFilter = () => {
    let filtered = posts;

    if (searchQuery) {
      filtered = filtered.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedTags) {
      filtered = filtered.filter((post) =>
        post.tags.some((tag) =>
          tag.toLowerCase().includes(selectedTags.toLowerCase())
        )
      );
    }

    if (dateFilter) {
      filtered = filtered.filter(
        (post) =>
          new Date(post.createdAt.seconds * 1000).toDateString() ===
          new Date(dateFilter).toDateString()
      );
    }

    setFilteredPosts(filtered);
  };

  // Handle delete
  const handleDelete = async (id) => {
    await deleteDoc(doc(db, 'posts', id));
    setPosts(posts.filter((post) => post.id !== id));
    setFilteredPosts(filteredPosts.filter((post) => post.id !== id));
  };

  // Handle expand post card
  const handleExpand = (id) => {
    setExpandedPostId(expandedPostId === id ? null : id);
  };

  return (
    <div>
      <h1>Find Posts</h1>
      <div className="filter-section">
        <input
          type="text"
          placeholder="Search by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <input
          type="text"
          placeholder="Search by tag..."
          value={selectedTags}
          onChange={(e) => setSelectedTags(e.target.value)}
        />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
        />
        <button onClick={handleFilter}>Filter</button>
      </div>
      <div className="post-list">
        {filteredPosts.map((post) => (
          <div key={post.id} className="post-card">
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <p>Tags: {post.tags.join(', ')}</p>
            <p>Date: {new Date(post.createdAt.seconds * 1000).toDateString()}</p>

            {post.imageUrl && (
              <img src={post.imageUrl} alt="Uploaded" style={{ maxWidth: '100%' }} />
            )}

            <button onClick={() => handleExpand(post.id)}>
              {expandedPostId === post.id ? 'Hide Details' : 'Show Details'}
            </button>
            {expandedPostId === post.id && (
              <div className="post-details">
                <p>{post.description}</p>
              </div>
            )}

            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
