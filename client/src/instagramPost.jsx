import React, { useState } from 'react';

function InstagramFacebookPost() {
  const [accessToken, setAccessToken] = useState('EAAFLqS6PKXsBO2JBHRxmPZCadqJGZClZArp6ZAif1nnlwVs7oDlKqrwJT7FxgEMnRaEcbRoocirRu5fCxC9bXc0TKNmzqW02yNMhcRy9p7kqBPTdZBqlTL1HZAaecpb30ETx3BFnW6l08euLIlsFzhBTpgZBO4dceQSuSJPPsKyET9u7MGXf5ZATun7cv37ojsvo');
  const [igUserId] = useState('17841461169630863');
  const [imageUrl, setImageUrl] = useState('https://images.pexels.com/photos/799443/pexels-photo-799443.jpeg?auto=compress&cs=tinysrgb&w=600'); 
  const [caption, setCaption] = useState('Bu test amaçlıdır'); 
  const [pageId, setPageId] = useState('122106642020003010'); 
  const [postResponse, setPostResponse] = useState('');

  const uploadMedia = async () => {
    if (!accessToken) {
      alert('Please enter the Facebook token.');
      return;
    }

    const instagramUploadUrl = `https://graph.facebook.com/v18.0/${igUserId}/media`;
    const payload = {
      'image_url': imageUrl,
      'caption': caption,
      'access_token': accessToken
    };

    try {
      const igResponse = await fetch(instagramUploadUrl, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const igData = await igResponse.json();
      if (igData.id) {
        await publishMedia(igData.id);
      } else {
        console.error('Instagram media upload failed:', igData);
      }
    } catch (error) {
      console.error('Error:', error);
    }

    
    await postToFacebook();
  };

  
  const publishMedia = async (creationId) => {
    const publishUrl = `https://graph.facebook.com/v18.0/${igUserId}/media_publish`;
    const payload = {
      'creation_id': creationId,
      'access_token': accessToken
    };

    try {
      const response = await fetch(publishUrl, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error('Publishing failed: ' + data.error.message);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error: ' + error.message);
    }
  };

  
  const postToFacebook = async () => {
    if (!pageId) {
      console.error('Facebook Page ID is required');
      return;
    }

    
    const fbUrl = `https://graph.facebook.com/v18.0/${pageId}/feed?message=${caption}&link=${imageUrl}&access_token=${accessToken}`;
    
    try {
      const response = await fetch(fbUrl, {
        method: 'POST',
      });

      const fbData = await response.json();
      if (response.ok) {
        setPostResponse(`Image published to Facebook successfully with post ID: ${fbData.id}`);
      } else {
        console.error('Facebook post failed:', fbData);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };
  

  return (
    <div>
      <input
        type="text"
        placeholder="Enter the Facebook token"
        value={accessToken}
        onChange={(e) => setAccessToken(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter the Page ID"
        value={pageId}
        onChange={(e) => setPageId(e.target.value)}
      />
      <input
        type="text"
        placeholder="Enter the Photo URL"
        value={imageUrl}
        onChange={(e) => setImageUrl(e.target.value)}
      />
      <textarea
        placeholder="Enter the caption"
        value={caption}
        onChange={(e) => setCaption(e.target.value)}
      />
      <button onClick={uploadMedia}>Publish to Instagram and Facebook</button>
      {postResponse && <p>Response: {postResponse}</p>}
    </div>
  );
}

export default InstagramFacebookPost;
