# Real-Time Collaborative Text Editor

## Overview

The **Real-Time Collaborative Text Editor** is a web-based application that allows multiple users to collaboratively edit the same document in real-time. Users can see each other's edits instantly and track cursor positions to ensure a smooth collaborative experience. The application includes features like user identification, real-time synchronization of text changes, and live cursor movement visibility.

This project is built using **React**, **Quill**, **Socket.IO**, and **Node.js**. It supports basic collaborative editing, and real-time syncing ensures a seamless experience for multiple users editing the document at once.

---

## Features

### 1. **Real-Time Collaboration**
   - Multiple users can edit the same document simultaneously.
   - Changes made by one user are instantly reflected to others.
   - ![image](https://github.com/user-attachments/assets/99755b0b-726b-43bf-b068-6c458683cce4)


### 2. **Visible Cursors for All Users**
   - Each user has a unique cursor that is visible to all other users in the document.
   - Users can identify each other's actions based on the color and cursor position.
![image](https://github.com/user-attachments/assets/2331ac4e-2340-42f5-a390-8a189b0969ed)

### 3. **User Identification**
   - Each user is identified by a unique **UUID**, which is used to distinguish between different users' edits and cursor positions.
   - A color is assigned to each user, making it easier to track who is editing what section.

### 4. **Real-Time Cursor Movement**
   - Users can see each other's cursor movements, making the collaboration feel like a shared document space.

### 5. **Dark Mode**
   - Users can toggle dark mode for a more comfortable viewing experience during extended editing sessions.
   - ![image](https://github.com/user-attachments/assets/640badf5-f1e9-44a6-aa13-f462dd115c9f)


### 6. **Automatic Document Saving**
   - Document changes are saved automatically to the backend server every 2 seconds, ensuring no progress is lost in case of a refresh or disconnect.

---

## Technologies Used

- **Frontend**:
  - **React**: For building the user interface of the text editor.
  - **Quill**: A powerful rich-text editor used to handle text formatting and editing.
  - **Socket.IO**: For establishing a real-time, bi-directional communication channel between the frontend and backend.
  - **Quill Cursors**: A module that allows multiple cursors to be displayed in Quill, indicating where other users are typing.

- **Backend**:
  - **Node.js**: Backend server running on Express, handling requests and socket connections.
  - **Socket.IO**: Real-time communication between the frontend and backend.
  - **UUID**: Used to generate unique user IDs for distinguishing different users in the system.
  - **Express**: Web framework for Node.js, used to handle HTTP requests.

---

## Installation

### Prerequisites

1. **Node.js** (version 14 or higher)
2. **npm** (Node Package Manager)

### Clone the Repository

Clone the repository to your local machine using:

```bash
git clone https://github.com/yourusername/Collaborative-Text-Editor.git
