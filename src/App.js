import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid'; // Import uuidv4 function from uuid package
import './App.css'; // Import CSS file for styling

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get('http://localhost:5000/messages');
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const sendMessage = async () => {
    try {
      const id = uuidv4(); // Generate a UUID for the message
      setIsSending(true); // Set sending state to true
      await axios.post('http://localhost:5000/messages', { id, message: inputMessage }); // Include the generated id in the message object
      setIsSending(false); // Reset sending state to false after message is sent
      setInputMessage('');
      fetchMessages(); // Update the messages after sending a new message
    } catch (error) {
      setIsSending(false); // Reset sending state to false if an error occurs
      console.error('Error sending message:', error);
    }
  };

  const updateMessage = async (id, updatedMessage) => {
    try {
      await axios.put(`http://localhost:5000/messages/${id}`, { message: updatedMessage });
      fetchMessages();
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/messages/${id}`);
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  const toggleEditing = (id) => {
    setMessages(
      messages.map((message) =>
        message.id === id ? { ...message, editing: !message.editing } : message
      )
    );
  };

  const setMessageValue = (id, value) => {
    setMessages(
      messages.map((message) =>
        message.id === id ? { ...message, updatedMessage: value } : message
      )
    );
  };

  return (
    <div className="app-container">
      <div className="chat-container">
        {messages.map((message) => (
          <div key={message.id} className={`message-container ${message.sender === 'me' ? 'sent' : 'received'}`}>
            {message.editing ? (
              <div>
                <input
                  type="text"
                  value={message.updatedMessage}
                  onChange={(e) => setMessageValue(message.id, e.target.value)}
                  className="edit-input"
                />
                <button onClick={() => updateMessage(message.id, message.updatedMessage)} className='save-button'>Save</button>
              </div>
            ) : (
              <div>
                <p className="message-text">{message.message}</p>
                <button onClick={() => toggleEditing(message.id)}>Update</button>
                <button onClick={() => deleteMessage(message.id)}>Delete</button>
              </div>
            )}
          </div>
        ))}
        {isSending && <div className="sending-indicator">Sending...</div>} {/* Show sending indicator */}
      </div>
      <div className="input-container">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Enter your message"
          className="message-input"
        />
        <button onClick={sendMessage} className="send-button">Send</button>
      </div>
    </div>
  );
}

export default App;
