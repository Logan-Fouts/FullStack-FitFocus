import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css'
import Cookies from 'universal-cookie'
import { Home } from './components/Home';
import { Register } from './components/Register';
import Navbar from './components/Navbar';
import AddExercise from './components/AddExercise';

const cookies = new Cookies();

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      username: "",
      password: "",
      error: "",
      isAuthenticated: false,
      isRegistering: false,
    }
  }

  componentDidMount = () => {
    this.getSession();
  }

  getSession = () => {
    fetch("/api/session/", {
      credentials: "same-origin",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        if (data.isAuthenticated) {
          this.setState({ isAuthenticated: true });
        } else {
          this.setState({ isAuthenticated: false });
        }
      })
      .catch((err) => {
        console.log(err);
      })
  }

  whoami = () => {
    fetch("/api/whoami/", {
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "same-origin",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("You are logged in as: " + data.username);
      })
      .catch((err) => {
        console.log(err);
      })
  }

  handleRegisterChange = (event) => {
    this.setState({ isRegistering: !this.state.isRegistering });
  }

  handlePasswordChange = (event) => {
    this.setState({ password: event.target.value });
  }


  handleUserNameChange = (event) => {
    this.setState({ username: event.target.value });
  }

  isResponseOk(response) {
    if (response.status >= 200 && response.status <= 299) {
      return response.json();
    } else {
      throw Error(response.statusText);
    }
  }


  login = (event) => {
    event.preventDefault();
    fetch("/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": cookies.get("csrftoken")
      },
      credentials: "same-origin",
      body: JSON.stringify(
        {
          username: this.state.username,
          password: this.state.password
        }
      )
    })
      .then(this.isResponseOk)
      .then((data) => {
        console.log(data);
        this.setState({ isAuthenticated: true, username: "", password: "", error: "" })
      })
      .catch((err) => {
        console.log(err);
        this.setState({ error: "Wrong username or password" })
      });
  }

  logout = () => {
    fetch("/api/logout", {
      credentials: "same-origin",
    })
      .then(this.isResponseOk)
      .then((data) => {
        console.log(data);
        this.setState({ isAuthenticated: false })
      })
      .catch((err) => {
        console.log(err);
      });
  }

  setIsAuthenticated = (value) => {
    this.setState({ isAuthenticated: value });
  }

  render() {
    if (!this.state.isAuthenticated && !this.state.isRegistering) {
      return (
        <Router>
          <div className="container mx-auto mt-8 max-w-md px-4">
            <h1 className="text-4xl font-bold text-center text-gray-100 mb-8">Fit Focus</h1>
            <form onSubmit={this.login} className="bg-gray-800 shadow-lg rounded-lg px-8 pt-6 pb-8 mb-4">
              <div className="mb-4">
                <label className="block text-gray-300 text-sm font-bold mb-2 text-left" htmlFor="username">
                  Username:
                </label>
                <input
                  type="text"
                  className="shadow appearance-none bg-gray-700 border border-gray-600 rounded w-full py-2 px-3 text-gray-100 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  id="username"
                  name="username"
                  value={this.state.username}
                  onChange={this.handleUserNameChange}
                  placeholder="Enter username"
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-300 text-sm font-bold mb-2 text-left" htmlFor="password">
                  Password:
                </label>
                <input
                  type="password"
                  className="shadow appearance-none bg-gray-700 border border-gray-600 rounded w-full py-2 px-3 text-gray-100 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  id="password"
                  name="password"
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
                  placeholder="Enter password"
                />
              </div>
              {this.state.error && (
                <p className="text-red-400 text-xs italic mb-4">{this.state.error}</p>
              )}
              <div className="flex items-center justify-center">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300"
                >
                  Login
                </button>
              </div>
            </form>
            <a onClick={this.handleRegisterChange}>Register</a>
          </div>
          <Routes>
            <Route path='/add-exercise' element={<AddExercise />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      );
    } else if (!this.state.isAuthenticated && this.state.isRegistering) {
      return (
        <Register
          isAuthenticated={this.state.isAuthenticated}
          setIsAuthenticated={this.setIsAuthenticated}
          onRegisterSuccess={() => this.setState({ isRegistering: false })}
        />
      )
    }
    return (
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/add-exercise' element={<AddExercise />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    )
  }
}


export default App;