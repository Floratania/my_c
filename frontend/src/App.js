import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Dashboard from './components/Dashboard';
import FlashcardTrainer from "./components/FlashcardTrainer";
import OxfordImporter from './components/OxfordImporter';
import WordSetSelector from './components/WordSetSelector';
import LevelTest from './components/LevelTest';
import WordDragAndDrop from "./components/WordAndDrag";
import Translate from './components/Translate';
import TenseSelector from './components/TenseSelector';
import TensePage from './components/TensePage';
import PrivateRoute from './utils/PrivateRoute';
import React, { useContext } from "react";

import { AuthContext } from './context/AuthContext';



function App() {
  const { token, logoutUser } = useContext(AuthContext);

  return (
    <BrowserRouter>
      <nav>
        {!token ? (
          <>
            <Link to="/register">Реєстрація</Link> | <Link to="/login">Вхід</Link>
          </>
        ) : (
          <button onClick={logoutUser}>Вийти</button>
        )}
        {token && (
          <>
            <br />
            <Link to="/flashcards">Флеш-картки</Link><br />
            <Link to="/wordsets">Обрати набір слів</Link> | <Link to="/import">Імпорт словників</Link><br />
            <Link to="/level-test">Тест рівня</Link><br />
            <Link to="/wd">Речення</Link><br />
            <Link to="/translate">Перекладач</Link><br />
            <Link to="/tenses">Вивчити часи</Link><br />
          </>
        )}
      </nav>

      <Routes>
        <Route path="/" element={
          token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
        } />
        
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/flashcards" element={<PrivateRoute><FlashcardTrainer /></PrivateRoute>} />
        <Route path="/import" element={<PrivateRoute><OxfordImporter /></PrivateRoute>} />
        <Route path="/wordsets" element={<PrivateRoute><WordSetSelector onSubscribed={() => {}} /></PrivateRoute>} />
        <Route path="/wd" element={<PrivateRoute><WordDragAndDrop /></PrivateRoute>} />
        <Route path="/level-test" element={<PrivateRoute><LevelTest /></PrivateRoute>} />
        <Route path="/translate" element={<Translate />} />
        <Route path="/tenses" element={<TenseSelector />} />
        <Route path="/tense/:tenseName" element={<TensePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
