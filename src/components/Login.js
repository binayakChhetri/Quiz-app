import { type } from "@testing-library/user-event/dist/type";
import { useState } from "react";

function Login({ dispatch, users }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  function validate() {
    if (!username) return alert("Username should not be blank");
    if (!password) return alert("Password should not be blank");
    let loginSuccess;
    users.map((user) => {
      if (user.username === username && user.password === password) {
        loginSuccess = true;
      }
    });
    loginSuccess || alert("Credientials did not matched");
    loginSuccess && dispatch({ type: "loginSuccess" });
  }
  return (
    <form>
      <p>Use this for login:- Username: kin_65 Password: it'sEuro@13</p>
      <div className="container">
        <h5>Login</h5>
        <div className="item">
          <input
            type="text"
            id="username"
            name="username"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="item">
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button
          className="btn btnLogin"
          onClick={(e) => {
            e.preventDefault();
            validate();
          }}
        >
          Login
        </button>
      </div>
    </form>
  );
}

export default Login;
