import React from "react";
import { Switch, Route, Link, BrowserRouter as Router} from "react-router-dom";

import Student from "./components/Student";
import StudentList from "./components/StudentList";
import CourseList from "./components/CourseList";
import ClassList from "./components/ClassList";
import Class from "./components/Class";
import Course from "./components/Course";
import Header from "./components/Header";

import './App.scss';
import logo from './logo.png';

function App() {
  return (
    <Router>
      <div className="container">
        <aside className="sidebar border">
          <img src={logo} className="logo" />
            <nav>
              <li className="nav-item">
                <Link to={"/classes"}>
                  Classes
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/courses"}>
                  Courses
                </Link>
              </li>
              <li className="nav-item">
                <Link to={"/students"}>
                  Students
                </Link>
              </li>
            </nav>
        </aside>
        <main className="main">
          <header className="border">
            <Header />
          </header>
          <article className="border">
            <Switch>
              <Route exact path={["/", "/students"]} component={StudentList} />
              <Route path="/students/:id" component={Student} />
              <Route exact path={"/classes"} component={ClassList} />
              <Route exact path={"/classes/:id"} component={Class} />
              <Route exact path={"/courses"} component={CourseList} />
              <Route exact path={"/courses/:id"} component={Course} />
            </Switch>
          </article>
          <footer className="border">
              Footer
          </footer>
        </main>
      </div>
      </Router>
  );
}

export default App;
