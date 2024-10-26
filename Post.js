
import React, { useState } from 'react';
import { db, storage } from './utils/Firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function NewPost() {
  const [postType, setPostType] = useState('question');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [abstract, setAbstract] = useState('');
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handlePostTypeChange = (event) => {
    setPostType(event.target.value);
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleImageUpload = () => {
    return new Promise((resolve, reject) => {
      if (image) {
        const storageRef = ref(storage, `images/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
            console.log(`Upload is ${progress}% done`);
          },
          (error) => {
            console.error("Image upload failed:", error);
            reject(error);
          },
          async () => {
            const url = await getDownloadURL(uploadTask.snapshot.ref);
            setImageUrl(url);
            resolve(url);
          }
        );
      } else {
        resolve(""); 
      }
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const uploadedImageUrl = await handleImageUpload();

      const post = {
        title,
        description: postType === 'question' ? description : abstract, 
        tags: tags.split(',').map(tag => tag.trim()), 
        postType,
        imageUrl: uploadedImageUrl,  
        createdAt: new Date(),
      };

      await addDoc(collection(db, "posts"), post); 
      setSuccessMessage('Post submitted successfully!');
    } catch (error) {
      console.error("Error adding post: ", error);
    }
  };

  return (
    <div className="App">
      <h1>Create a New Post</h1>
      <form onSubmit={handleSubmit}>
        <div className="post-type">
          <label>Select Post Type: </label>
          <input
            type="radio"
            value="question"
            checked={postType === 'question'}
            onChange={handlePostTypeChange}
          />
          <label>Question</label>
          <input
            type="radio"
            value="article"
            checked={postType === 'article'}
            onChange={handlePostTypeChange}
          />
          <label>Article</label>
        </div>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            placeholder="Enter a title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        {postType === 'question' ? (
          <div className="form-group">
            <label>Description</label>
            <textarea
              placeholder="Describe your problem"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
        ) : (
          <div className="form-group">
            <label>Abstract</label>
            <textarea
              placeholder="Write an abstract for the article"
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label>Tags</label>
          <input
            type="text"
            placeholder="Enter tags (comma-separated)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Add an Image (Optional):</label>
          <input type="file" onChange={handleImageChange} />
        </div>

        <button type="submit">Submit</button>
      </form>

      {successMessage && <p>{successMessage}</p>}
    </div>
  );
}

export default NewPost;
