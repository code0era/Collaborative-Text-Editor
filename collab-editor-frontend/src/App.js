import React, { useEffect, useRef, useState } from 'react';
import Quill from 'quill';
import QuillCursors from 'quill-cursors';
import { io } from 'socket.io-client';
import { v4 as uuid } from 'uuid';
import 'quill/dist/quill.snow.css';
import './App.css';

Quill.register('modules/cursors', QuillCursors);

const SAVE_INTERVAL_MS = 2000;
const COLORS = ['red', 'blue', 'green', 'purple', 'orange', 'teal'];

function App() {
  const wrapperRef = useRef();
  const [socket, setSocket] = useState();
  const [quill, setQuill] = useState();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const userId = useRef(uuid());
  const color = useRef(COLORS[Math.floor(Math.random() * COLORS.length)]);
  const cursorsRef = useRef();
  const [hoveredUserId, setHoveredUserId] = useState(null);

  // Socket connection setup
  useEffect(() => {
    const s = io('http://localhost:3001');
    setSocket(s);
    return () => s.disconnect();
  }, []);

  // Quill setup
  useEffect(() => {
    if (!socket || !quill) return;

    socket.once('load-document', document => {
      quill.setContents(document);
      quill.enable();
    });

    socket.on('receive-changes', delta => {
      quill.updateContents(delta);
    });

    socket.on('receive-cursor', ({ userId: incomingId, range, color }) => {
      if (!cursorsRef.current || incomingId === userId.current) return;
      cursorsRef.current.createCursor(incomingId, `User ${incomingId.slice(0, 4)}`, color);
      cursorsRef.current.moveCursor(incomingId, range);
    });

    return () => {
      socket.off('receive-changes');
      socket.off('receive-cursor');
    };
  }, [socket, quill]);

  // Text change handler
  useEffect(() => {
    if (!socket || !quill) return;

    const handler = (delta, oldDelta, source) => {
      if (source !== 'user') return;
      socket.emit('send-changes', delta);
    };

    quill.on('text-change', handler);
    return () => quill.off('text-change', handler);
  }, [socket, quill]);

  // Cursor movement handler
  useEffect(() => {
    if (!socket || !quill) return;

    const handler = () => {
      const range = quill.getSelection();
      if (!range) return;
      socket.emit('send-cursor', {
        userId: userId.current,
        range,
        color: color.current,
      });
    };

    quill.on('selection-change', handler);
    return () => quill.off('selection-change', handler);
  }, [socket, quill]);

  // Auto save functionality
  useEffect(() => {
    if (!socket || !quill) return;

    const interval = setInterval(() => {
      socket.emit('save-document', quill.getContents());
    }, SAVE_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [socket, quill]);

  // Initialize Quill Editor
  useEffect(() => {
    const editor = document.createElement('div');
    wrapperRef.current.innerHTML = '';
    wrapperRef.current.append(editor);

    const q = new Quill(editor, {
      theme: 'snow',
      modules: {
        cursors: true,
        toolbar: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ['bold', 'italic', 'underline'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['clean'],
        ],
      },
    });

    cursorsRef.current = q.getModule('cursors');
    q.disable();
    q.setText('Loading...');
    setQuill(q);
  }, []);

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('dark-mode', !isDarkMode);
    const header = document.querySelector('.app-header');
    header.classList.toggle('dark-mode', !isDarkMode);
  };

  // Handle hover event on cursors
  const handleCursorHover = (userId) => {
    setHoveredUserId(userId);
  };

  const handleCursorLeave = () => {
    setHoveredUserId(null);
  };

  return (
    <>
      <header className="app-header">
        <h1>Collaborative Text Editor</h1>
      </header>
      <button className="dark-mode-button" onClick={toggleDarkMode}>
        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
      <div className="container" ref={wrapperRef}></div>

      {/* Tooltip for displaying UUID */}
      {hoveredUserId && (
        <div className="cursor-tooltip" style={{ position: 'absolute', top: '10px', left: '10px' }}>
          UUID: {hoveredUserId}
        </div>
      )}
    </>
  );
}

export default App;
