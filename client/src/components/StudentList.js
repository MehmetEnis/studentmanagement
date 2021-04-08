import React, { useState, useEffect, useMemo, useRef } from "react";
import StudentApiService from "../services/StudentService";
import { useTable, useFilters, usePagination  } from "react-table";
import Notifications, {notify} from 'react-notify-toast';
import Popup from 'reactjs-popup';

const StudentList = (props) => {
  const [students, setStudents] = useState([]);
  const [filterInput, setFilterInput] = useState("");
  const studentsRef = useRef();

  studentsRef.current = students;

  useEffect(() => {
    retrieveStudents();
  }, []);

  const handleFilterChange = e => {
    const value = e.target.value || undefined;
    setFilter("name", value);
    setFilterInput(value);
  };

  const retrieveStudents = () => {
    StudentApiService.getAllStudents()
      .then((response) => {
        setStudents(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const openStudent = (rowIndex) => {
    const id = studentsRef.current[rowIndex].id;
    props.history.push("/students/" + id);
  };

  const deleteStudent = (rowIndex) => {
    const id = studentsRef.current[rowIndex].id;

    if (window.confirm('Are you sure? If you delete a student, all course and class enrolments will also be removed!')) {
      StudentApiService.remove(id)
      .then((response) => {
        props.history.push("/students");

        let newStudents = [...studentsRef.current];
        newStudents.splice(rowIndex, 1);

        setStudents(newStudents);
      })
      .catch((e) => {
        console.log(e);
      });
    }
    
  };

  const submitStudent = () => {
    let dob = document.getElementById('dateofbirth').value;
    let name = document.getElementById('name').value;
    let surname = document.getElementById('surname').value;
    
    if (name===null || name==="" || name.length < 2) {
      notify.show('Please correct your name!', 'error', 2000);
      return false;
    }
    if (surname===null || surname==="" || surname.length < 2) {
      notify.show('Please correct your surname!', 'error', 2000);
      return false;
    }
    if (dob===null || dob==="" || dob.length < 2) {
      notify.show('Please select your date of birth!', 'error', 2000);
      return false;
    }

    StudentApiService.create({name: name, surname: surname, dateofbirth: dob})
      .then((response) => {
        props.history.push("/students/" + response.data.insertId);
      })
      .catch((e) => {
        console.log(e);
      });
    
  };

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Surname",
        accessor: "surname",
      },
      {
        Header: "Age",
        accessor: "dateofbirth",
        Cell: (props) => {
            var today = new Date();
            var birthDate = new Date(props.value);
            var age_now = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) 
            {
                age_now--;
            }
            return age_now;
        },
      },
      {
        Header: "Actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div>
              <span onClick={() => openStudent(rowIdx)}>
                view/edit
              </span>

              <span onClick={() => deleteStudent(rowIdx)}>
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
        data: students,
        initialState: { pageSize: 20 }
    },
    useFilters,
    usePagination
    );

  return (
    <div>
    <Notifications />      
    <Popup trigger={<button className="button"> New Student </button>} modal nested>
      {close => (
        <div className="modal">
          <button className="close" onClick={close}>
            &times;
          </button>
          <div className="header"> New Student </div>
          <div className="content">
            <form>
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="name"
                  name="name"
                />
              </div>
              <div className="form-group">
                <label htmlFor="surname">Surname</label>
                <input
                  type="text"
                  className="form-control"
                  id="surname"
                  name="surname"
                />
              </div>
              <div className="form-group">
                <label htmlFor="dateofbirth">D.O.B</label>
                <input
                  type="date"
                  className="form-control"
                  id="dateofbirth"
                  name="dateofbirth"
                />
              </div>
            </form>
          </div>
          <div className="actions">
            <button className="button" onClick={() => { close();}}>
              cancel
            </button>
            <button className="button" onClick={submitStudent}>
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
            placeholder={"Search student name"}
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

export default StudentList;
