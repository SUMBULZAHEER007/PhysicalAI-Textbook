import React, { useState } from 'react';
import styles from './styles.module.css'; // Ab ye error nahi dega

export default function ChatWidget() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = async () => {
    if (!input) return;
    const newMessages = [...messages, { role: 'user', content: input }];
    setMessages(newMessages);
    const currentInput = input;
    setInput('');

    try {
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: '1', message: currentInput }),
      });
      const data = await response.json();
      setMessages([...newMessages, { role: 'ai', content: data.response }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([...newMessages, { role: 'ai', content: "Server se connect nahi ho pa raha." }]);
    }
  };

  return (
    <div className={styles.chatContainer}>
      <div className={styles.chatBox}>
        {messages.length === 0 && <p className="text--center">
          "Ask a question about the book..."</p>}
        {messages.map((msg, i) => (
          <div key={i} className={msg.role === 'user' ? styles.userMsg : styles.aiMsg}>
            {msg.content}
          </div>
        ))}
      </div>
      <div className={styles.inputArea}>
        <input 
          className={styles.chatInput}
          value={input} 
          onChange={(e) => setInput(e.target.value)} 
          placeholder="Type your question..."
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
        />
        <button className={styles.sendBtn} onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}