import React, { useState, useEffect } from "react";
import StudentApiService from "../services/StudentService";
import ClassApiService from "../services/ClassService";
import CourseApiService from "../services/CourseService";
import { Multiselect } from 'multiselect-react-dropdown';
import Notifications, {notify} from 'react-notify-toast';

const Student = props => {
  const initialStudentState = {
    id: null,
    name: "",
    surname: "",
    dateofbirth: ""
  };
  const [currentStudent, setCurrentStudent] = useState(initialStudentState);
  const [courseList, setCourseList] = useState([]);
  const [classList, setClassList] = useState([]);
  const [studentClass, setStudentClass] = useState([]);
  const [studentCourse, setStudentCourse] = useState([]);

  const getStudent = id => {
    StudentApiService.get(id)
      .then(response => {
        setCurrentStudent(response.data);
        console.log(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const getStudentCourses = id => {
    StudentApiService.getCourses(id)
      .then(response => {
        setStudentCourse(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const getAllCourses = id => {
    CourseApiService.getAll(id)
      .then(response => {
        setCourseList(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const getStudentClass = id => {
    StudentApiService.getClass(id)
      .then(response => {
        setStudentClass(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const getAllClass = id => {
    ClassApiService.getAll(id)
      .then(response => {
        setClassList(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getStudent(props.match.params.id);
    getStudentCourses(props.match.params.id);
    getStudentClass(props.match.params.id);
    getAllClass(props.match.params.id);
    getAllCourses(props.match.params.id)
  }, [props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentStudent({ ...currentStudent, [name]: value });
  };

  const updateStudent = () => {
    StudentApiService.update(currentStudent.id, currentStudent)
      .then(response => {
        notify.show('The student was successfully updated!', 'success', 2000);
      })
      .catch(e => {
        notify.show('There was an error. Please check and try again!', 'error', 2000);
        console.log(e);
      });
  };

  const deleteStudent = () => {
    if (window.confirm('Are you sure? If you delete a student, all class/course enrolments will also be removed!')) {
      StudentApiService.remove(currentStudent.id)
        .then(response => {
          props.history.push("/students");
        })
        .catch(e => {
          notify.show('There was an error. Please check and try again!', 'error', 2000);
          console.log(e);
        });
    }
  };

  const onSelectClass = (selectedList, selectedItem) =>{
    setStudentClass(selectedItem);
    ClassApiService.addAttendee(selectedItem.id, props.match.params.id)
    .then(() => {
        notify.show('The student was added to class successfully!', 'success', 2000);
    })
    .catch(e => {
        console.log(e);
    });
  };

  const onRemoveCourse = (selectedList, removedItem) =>{
    setStudentCourse(selectedList);
    CourseApiService.removeAttendee(removedItem.id, props.match.params.id)
    .then(response => {
        notify.show('The course was removed successfully!', 'warning', 2000);
    })
    .catch(e => {
        console.log(e);
    });
  };

  const onSelectCourse = (selectedList, selectedItem) =>{
    setStudentCourse(selectedList);
    CourseApiService.addAttendee(selectedItem.id, props.match.params.id)
    .then(response => {
        notify.show('The course was added successfully!', 'success', 2000);
    })
    .catch(e => {
        console.log(e);
    });
  };

  const getStudentAge = (dob) => {
    var today = new Date();
    var birthDate = new Date(dob);
    var age_now = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
    {
        age_now--;
    }
    return age_now;
  };

  return (
    <div>
    <h3>Student Record: {currentStudent.displayName } - Class: {studentClass ? (<span>{studentClass.class_name}</span>):(<span>Not enrolled</span>)} - Total Courses Enrolled: {Object.keys(studentCourse).length} - Age: {getStudentAge(currentStudent.dateofbirth)}</h3>
    <div className="form">
      {currentStudent ? (
        <div className="edit-form">
          <div className="main_record">
            <h4>Student Record</h4>
            <form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                  value={currentStudent.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="surname">Surname</label>
                <input
                  type="text"
                  className="form-control"
                  id="surname"
                  name="surname"
                  value={currentStudent.surname}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="dateofbirth">D.O.B</label>
                <input
                  type="text"
                  className="form-control"
                  id="dateofbirth"
                  name="dateofbirth"
                  value={currentStudent.dateofbirth}
                  onChange={handleInputChange}
                />
              </div>
            </form>

            <button onClick={deleteStudent}>
              Delete
            </button>

            <button
              type="submit"
              onClick={updateStudent}
          >
            Update
          </button>
          </div>
          
          <div className="relationship_record">
            <Notifications />
            <h4>Class:</h4>
            <Multiselect
                options={classList}
                displayValue="class_name"
                selectedValues={[studentClass]}
                onSelect={onSelectClass}
                singleSelect
                id="class"
            />
          </div>

          <div className="relationship_record">
          <h4>Courses:</h4>
            <Multiselect
                options={courseList}
                displayValue="course_name"
                selectedValues={studentCourse}
                onRemove={onRemoveCourse}
                onSelect={onSelectCourse}
                id="course"
            />
          </div>

        </div>
      ) : (
        <div>
          <br />
          <p>Student not found!</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default Student;
