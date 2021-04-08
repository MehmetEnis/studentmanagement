import React, { useState, useEffect, useMemo, useRef } from "react";
import CourseApiService from "../services/CourseService";
import { useTable, useFilters, usePagination  } from "react-table";
import Notifications, {notify} from 'react-notify-toast';
import Popup from 'reactjs-popup';

const CourseList = (props) => {
  const [courses, setCourses] = useState([]);
  const [filterInput, setFilterInput] = useState("");
  const coursesRef = useRef();

  coursesRef.current = courses;

  useEffect(() => {
    retrieveCourses();
  }, []);

  const handleFilterChange = e => {
    const value = e.target.value || undefined;
    setFilter("course_name", value);
    setFilterInput(value);
  };

  const retrieveCourses = () => {
    CourseApiService.getAll()
      .then((response) => {
        setCourses(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const openCourse = (rowIndex) => {
    const id = coursesRef.current[rowIndex].id;
    props.history.push("/courses/" + id);
  };

  const deleteCourse = (rowIndex) => {
    const id = coursesRef.current[rowIndex].id;
    
    if (window.confirm('Are you sure? If you delete a course, all course enrolments will also be removed!')) {
      CourseApiService.remove(id)
      .then(() => {
          props.history.push("/courses");
          let newCourses = [...coursesRef.current];
          newCourses.splice(rowIndex, 1);

          setCourses(newCourses);
      })
      .catch(e => {
          console.log(e);
      });
    }
  };

  const submitCourse = () => {
    let course_name = document.getElementById('course_name').value;
    let credits = document.getElementById('credits').value;
    
    if (course_name===null || course_name==="" || course_name.length < 2) {
      notify.show('Please correct course name!', 'error', 2000);
      return false;
    }
    if (credits===null || credits==="" || credits.length < 1) {
      notify.show('Please correct course credits!', 'error', 2000);
      return false;
    }

    CourseApiService.create({course_name: course_name, credits: credits})
      .then((response) => {
        props.history.push("/courses/" + response.data.insertId);
      })
      .catch((e) => {
        console.log(e);
      });
    
  };

  const columns = useMemo(
    () => [
      {
        Header: "Course Name",
        accessor: "course_name",
      },
      {
        Header: "Credits",
        accessor: "credits",
      },
      {
        Header: "Actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div>
              <span onClick={() => openCourse(rowIdx)}>
                view/edit
              </span>

              <span onClick={() => deleteCourse(rowIdx)}>
                delete
              </span>
            </div>
          );
        },
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    setFilter,
    canPreviousPage,
    canNextPage,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize }
    } = useTable({
        columns,
        data: courses,
        initialState: { pageSize: 20 }
    },
    useFilters,
    usePagination
    );

  return (
    <div>
      <Notifications />
      <Popup trigger={<button className="button"> New Course </button>} modal nested>
      {close => (
        <div className="modal">
          <button className="close" onClick={close}>
            &times;
          </button>
          <div className="header"> New Course </div>
          <div className="content">
            <form>
              <div className="form-group">
              <label htmlFor="course_name">Course Name</label>
              <input
                  type="text"
                  className="form-control"
                  id="course_name"
                  name="course_name"
              />
              </div>
              <div className="form-group">
              <label htmlFor="credits">Credits</label>
              <input
                  type="number"
                  className="form-control"
                  id="credits"
                  name="credits"
              />
              </div>
            </form>
          </div>
          <div className="actions">
            <button className="button" onClick={() => { close();}}>
              cancel
            </button>
            <button className="button" onClick={submitCourse}>
              submit
            </button>
          </div>
        </div>
      )}
    </Popup>
    <div className="list row">
      <div>
        <div>
          <input
          type="text"
            value={filterInput}
            onChange={handleFilterChange}
            placeholder={"Search course name"}
            />
        </div>
      </div>
      <div>
        <table
          className="blueTable"
          {...getTableProps()}
        >
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps()}>
                    {column.render("Header")}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className="pagination">
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {"<<"}
            </button>{" "}
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {"<"}
            </button>{" "}
            <button onClick={() => nextPage()} disabled={!canNextPage}>
            {">"}
            </button>{" "}
            <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {">>"}
            </button>{" "}
            <span>
            Page{" "}
            <strong>
                {pageIndex + 1} of {pageCount}
            </strong>{" "}
            </span>
            <span>
            | Go to page:{" "}
            <input
                type="number"
                defaultValue={pageIndex + 1}
                onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
                }}
                style={{ width: "100px" }}
            />
            </span>{" "}
            <select
                value={pageSize}
                onChange={(e) => {
                    setPageSize(Number(e.target.value));
                }}
                >
                {[10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                    </option>
                ))}
            </select>
        </div>
      </div>

    </div>
    </div>
  );
};

export default CourseList;
