import { db } from './utils/Firebase'; 

const handleSubmit = async (event) => {
  event.preventDefault();

  try {
    
    const post = {
      title,
      description,
      tags: tags.split(',').map(tag => tag.trim()), 
      postType, 
      createdAt: firebase.firestore.FieldValue.serverTimestamp(), 
    };

    await db.collection('posts').add(post);
    setSuccessMessage('Post submitted successfully!');
  } catch (error) {
    console.error("Error adding post: ", error);
  }
};
