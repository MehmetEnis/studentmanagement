import React, { useState, useEffect } from "react";
import CourseApiService from "../services/CourseService";
import StudentApiService from "../services/StudentService";
import { Multiselect } from 'multiselect-react-dropdown';
import Notifications, {notify} from 'react-notify-toast';

const Course = props => {
  const initialCourseState = {
    id: null,
    course_name: "",
    credits: "",
  };
  const [currentCourse, setCurrentCourse] = useState(initialCourseState);
  const [studentsAttending, setStudentsAttending] = useState("");
  const [studentList, setStudentsList] = useState([]);

  const getCourse = id => {
    CourseApiService.get(id)
      .then(response => {
        setCurrentCourse(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const getCourseStudents = id => {
    CourseApiService.getAttendingStudents(id)
      .then(response => {
        setStudentsAttending(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const getAllStudents = id => {
    StudentApiService.getAllStudents()
      .then(response => {
        setStudentsList(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getAllStudents(props.match.params.id)
    getCourseStudents(props.match.params.id)
    getCourse(props.match.params.id)
  }, [props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentCourse({ ...currentCourse, [name]: value });
  };

  const updateCourse = () => {
    CourseApiService.update(currentCourse.id, currentCourse)
      .then(response => {
        notify.show('The course was updated successfully!', 'success', 2000);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const deleteCourse = () => {
    if (window.confirm('Are you sure? If you delete a course, all course enrolments will also be removed!')) {
        CourseApiService.remove(currentCourse.id)
        .then(() => {
            props.history.push("/courses");
        })
        .catch(e => {
            console.log(e);
        });
      }
  };

  const onRemove = (selectedList, removedItem) =>{
    setStudentsAttending(selectedList);
    CourseApiService.removeAttendee(props.match.params.id, removedItem.id)
    .then(response => {
        notify.show('The student was removed successfully!', 'warning', 2000);
    })
    .catch(e => {
        console.log(e);
    });
  };

  const onSelect = (selectedList, selectedItem) =>{
    setStudentsAttending(selectedList);
    CourseApiService.addAttendee(props.match.params.id, selectedItem.id)
    .then(response => {
        notify.show('The student was enrolled successfully!', 'success', 2000);
    })
    .catch(e => {
        console.log(e);
    });
  };

  return (
    <div>
    <h3>Course Record - {currentCourse.course_name} - Total Enrolled: {Object.keys(studentsAttending).length}</h3>
    <div className="form">
      {currentCourse ? (
        <div className="edit-form">
          <div className="main_record">
            <form>
                <div className="form-group">
                <label htmlFor="course_name">Course Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="course_name"
                    name="course_name"
                    value={currentCourse.course_name}
                    onChange={handleInputChange}
                />
                </div>
                <div className="form-group">
                <label htmlFor="credits">Credits</label>
                <input
                    type="text"
                    className="form-control"
                    id="credits"
                    name="credits"
                    value={currentCourse.credits}
                    onChange={handleInputChange}
                />
                </div>
            </form>

            <button onClick={deleteCourse}>
                Delete
            </button>

            <button
                type="submit"
                onClick={updateCourse}
            >
                Update
            </button>
          </div>
          <div className="relationship_record">
          <Notifications />
            <Multiselect
                options={studentList}
                displayValue="displayName"
                selectedValues={studentsAttending}
                onRemove={onRemove}
                onSelect={onSelect}
            />
          </div>

        </div>
      ) : (
        <div>
          <br />
          <p>Course not found!</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default Course;
