import React, { useState, useEffect } from "react";
import ClassApiService from "../services/ClassService";
import StudentApiService from "../services/StudentService";
import { Multiselect } from 'multiselect-react-dropdown';
import Notifications, {notify} from 'react-notify-toast';

const Class = props => {
  const initialClassState = {
    id: null,
    class_name: "",
    department: "",
  };
  const [currentClass, setCurrentClass] = useState(initialClassState);
  const [studentsAttending, setStudentsAttending] = useState("");
  const [openStudents, setOpenStudents] = useState([]);

  const getClass = id => {
    ClassApiService.get(id)
      .then(response => {
        setCurrentClass(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const getClassStudents = id => {
    ClassApiService.getAttendingStudents(id)
      .then(response => {
        setStudentsAttending(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const getAllOpenStudents = id => {
    StudentApiService.getAllOpenStudents()
      .then(response => {
        setOpenStudents(response.data);
      })
      .catch(e => {
        console.log(e);
      });
  };

  useEffect(() => {
    getAllOpenStudents(props.match.params.id)
    getClassStudents(props.match.params.id)
    getClass(props.match.params.id)
  }, [props.match.params.id]);

  const handleInputChange = event => {
    const { name, value } = event.target;
    setCurrentClass({ ...currentClass, [name]: value });
  };

  const updateClass = () => {
    ClassApiService.update(currentClass.id, currentClass)
      .then(response => {
        console.log(response.data);
        notify.show('The class was updated successfully!', 'success', 2000);
      })
      .catch(e => {
        console.log(e);
      });
  };

  const deleteClass = () => {
    if (window.confirm('Are you sure? If you delete a class, all class enrolments will also be removed!')) {
        ClassApiService.remove(currentClass.id)
        .then(() => {
            props.history.push("/classes");
        })
        .catch(e => {
            console.log(e);
        });
      }
  };

  const onRemove = (selectedList, removedItem) =>{
    setStudentsAttending(selectedList);
    ClassApiService.removeAttendee(props.match.params.id, removedItem.id)
    .then(response => {
        notify.show('The student was removed successfully!', 'warning', 2000);
        getAllOpenStudents(props.match.params.id);
    })
    .catch(e => {
        console.log(e);
    });
  };

  const onSelect = (selectedList, selectedItem) =>{
    setStudentsAttending(selectedList);
    ClassApiService.addAttendee(props.match.params.id, selectedItem.id)
    .then(response => {
        notify.show('The student was enrolled successfully!', 'success', 2000);
    })
    .catch(e => {
        console.log(e);
    });
  };

  return (
    <div>
    <h3>Class Record - {currentClass.class_name} - Total Enrolled: {Object.keys(studentsAttending).length}</h3>
    <div className="form">
      {currentClass ? (
        <div className="edit-form">
          <div className="main_record">
            <form>
                <div className="form-group">
                <label htmlFor="class_name">Class Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="class_name"
                    name="class_name"
                    value={currentClass.class_name}
                    onChange={handleInputChange}
                />
                </div>
                <div className="form-group">
                <label htmlFor="department">Department</label>
                <input
                    type="text"
                    className="form-control"
                    id="department"
                    name="department"
                    value={currentClass.department}
                    onChange={handleInputChange}
                />
                </div>
            </form>

            <button onClick={deleteClass}>
                Delete
            </button>

            <button
                type="submit"
                onClick={updateClass}
            >
                Update
            </button>
          </div>
          <div className="relationship_record">
            <Notifications />
            <Multiselect
                options={openStudents}
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
          <p>Class not found!</p>
        </div>
      )}
    </div>
    </div>
  );
};

export default Class;
