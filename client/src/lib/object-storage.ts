
// A utility for handling file uploads using the server as a proxy to Replit Object Storage
export async function uploadToObjectStorage(file: File): Promise<string> {
  try {
    console.log('Starting file upload, file size:', file.size, 'bytes');
    
    // Validate file size before uploading (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      throw new Error('File size exceeds the 5MB limit');
    }
    
    // Create a FormData object to send the file
    const formData = new FormData();
    formData.append('file', file);
    
    console.log('Sending file to server...');
    // Send the file to the server
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    });
    
    const responseText = await response.text();
    console.log('Server response:', response.status, responseText);
    
    if (!response.ok) {
      throw new Error(`Server responded with ${response.status}: ${responseText}`);
    }
    
    // Parse the response JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse server response:', e);
      throw new Error('Invalid response from server');
    }
    
    console.log('Upload successful, URL:', data.url);
    return data.url;
  } catch (error) {
    console.error('Error uploading to object storage:', error);
    throw error;
  }
}
