import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import Dashboard from './components/Dashboard';
import FlashcardTrainer from "./components/FlashcardTrainer";
import OxfordImporter from './components/OxfordImporter';
import WordSetSelector from './components/WordSetSelector';
// import DifficultySelector from "./components/DifficultySelector";
import PrivateRoute from './utils/PrivateRoute';
import React from "react";


// function App() {
//   return (
//     <BrowserRouter>
//       <nav>
//         <Link to="/register">Реєстрація</Link> | <Link to="/login">Вхід</Link>
//         <br></br>
//         <Link to="/flashcards">Флеш-картки</Link>
//         <br></br>
//         {/* <Link to="/select-difficulty">Вивчати слова</Link> */}

//       </nav>
//       <Routes>
//         <Route path="/register" element={<RegisterForm />} />
//         <Route path="/login" element={<LoginForm />} />
//         <Route
//           path="/dashboard"
//           element={
//             <PrivateRoute>
//               <Dashboard />
//             </PrivateRoute>
//           }
//         />
//         <Route
//           path="/flashcards"
//           element={
//             <PrivateRoute>
//               <Flashcards />
//             </PrivateRoute>
//           }
//         />
 
//       </Routes>
//     </BrowserRouter>
//   );
// }

// export default App;
import { useContext } from 'react';
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
        <br />
        <Link to="/flashcards">Флеш-картки</Link>
        <br></br>
        <Link to="/wordsets">Обрати набір слів</Link> |{' '}
        {/* <Link to="/import">Імпорт словників</Link> */}
        <Link to="/import">Імпорт словників</Link>
      </nav>

      <Routes>
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/flashcards"
          element={
            <PrivateRoute>
              <FlashcardTrainer />
            </PrivateRoute>
          }
        />
        <Route
          path="/import"
          element={
            <PrivateRoute>
              <OxfordImporter />
            </PrivateRoute>
          }
        />
         <Route
          path="/wordsets"
          element={
            <PrivateRoute>
              <WordSetSelector onSubscribed={() => {}} />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;