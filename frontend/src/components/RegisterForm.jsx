// // import { useState } from "react";
// import React, { useState } from "react";


// export default function RegisterForm() {
//   const [form, setForm] = useState({ username: "", password: "" });
//   const [message, setMessage] = useState("");

//   const handleChange = e => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async e => {
//     e.preventDefault();
//     const response = await fetch("http://localhost:8000/api/register/", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify(form),
//     });
//     const data = await response.json();
//     if (response.ok) setMessage("Реєстрація успішна");
//     else setMessage(data.detail || "Помилка");
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <h2>Реєстрація</h2>
//       <input name="username" placeholder="Username" onChange={handleChange} />
//       <input name="password" type="password" placeholder="Password" onChange={handleChange} />
//       <button type="submit">Зареєструватися</button>
//       <p>{message}</p>
//     </form>
//   );
// }
import React, { useState } from "react";

export default function RegisterForm() {
  const [form, setForm] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    gender: "",
    birthdate: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8000/api/register/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("✅ Реєстрація успішна");
      } else {
        setMessage(data.error || "❌ Помилка при реєстрації");
      }
    } catch (err) {
      setMessage("❌ Сервер не відповідає");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Реєстрація</h2>
      <input name="username" placeholder="Імʼя користувача" onChange={handleChange} />
      <input name="password" type="password" placeholder="Пароль" onChange={handleChange} />
      <input name="first_name" type="first_name" placeholder="Ім'я" onChange={handleChange} />
      <input name="last_name" type="last_name" placeholder="Прізвище" onChange={handleChange} />
      <input name="email" type="email" placeholder="Email" onChange={handleChange} />
      <input name="phone" type="tel" placeholder="Телефон" onChange={handleChange} />
      <input name="birthdate" type="date" onChange={handleChange} />
      <select name="gender" onChange={handleChange}>
        <option value="">Стать</option>
        <option value="male">Чоловік</option>
        <option value="female">Жінка</option>
        <option value="other">Інше</option>
      </select>
      <button type="submit">Зареєструватися</button>
      <p>{message}</p>
    </form>
  );
}
