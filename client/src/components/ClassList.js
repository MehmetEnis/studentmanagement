import React, { useState, useEffect, useMemo, useRef } from "react";
import ClassApiService from "../services/ClassService";
import { useTable, useFilters, usePagination  } from "react-table";
import Notifications, {notify} from 'react-notify-toast';
import Popup from 'reactjs-popup';

const ClassList = (props) => {
  const [classes, setClasses] = useState([]);
  const [filterInput, setFilterInput] = useState("");
  const classesRef = useRef();

  classesRef.current = classes;

  useEffect(() => {
    retrieveClasses();
  }, []);

  const handleFilterChange = e => {
    const value = e.target.value || undefined;
    setFilter("class_name", value);
    setFilterInput(value);
  };

  const retrieveClasses = () => {
    ClassApiService.getAll()
      .then((response) => {
        setClasses(response.data);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const openClass = (rowIndex) => {
    const id = classesRef.current[rowIndex].id;
    props.history.push("/classes/" + id);
  };

  const deleteClass = (rowIndex) => {
    const id = classesRef.current[rowIndex].id;
    if (window.confirm('Are you sure? If you delete a class, all student enrolments will also be removed!')) {
      ClassApiService.remove(id)
        .then((response) => {
          props.history.push("/classes");

          let newClasses = [...classesRef.current];
          newClasses.splice(rowIndex, 1);

          setClasses(newClasses);
        })
        .catch((e) => {
          console.log(e);
        });
    }
  };

  const submitClass = () => {
    let class_name = document.getElementById('class_name').value;
    let department = document.getElementById('department').value;
    
    if (class_name===null || class_name==="" || class_name.length < 2) {
      notify.show('Please correct class name!', 'error', 2000);
      return false;
    }
    if (department===null || department==="" || department.length < 2) {
      notify.show('Please correct class department!', 'error', 2000);
      return false;
    }

    ClassApiService.create({class_name: class_name, department: department})
      .then((response) => {
        props.history.push("/classes/" + response.data.insertId);
      })
      .catch((e) => {
        console.log(e);
      });
    
  };

  const columns = useMemo(
    () => [
      {
        Header: "Class Name",
        accessor: "class_name",
      },
      {
        Header: "Department",
        accessor: "department",
      },
      {
        Header: "Actions",
        Cell: (props) => {
          const rowIdx = props.row.id;
          return (
            <div>
              <span onClick={() => openClass(rowIdx)}>
                view/edit
              </span>

              <span onClick={() => deleteClass(rowIdx)}>
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
        data: classes,
        initialState: { pageSize: 20 }
    },
    useFilters,
    usePagination
    );

  return (
    <div>
      <Notifications />
      <Popup trigger={<button className="button"> New Class </button>} modal nested>
      {close => (
        <div className="modal">
          <button className="close" onClick={close}>
            &times;
          </button>
          <div className="header"> New Class </div>
          <div className="content">
            <form>
              <div className="form-group">
              <label htmlFor="class_name">Class Name</label>
              <input
                  type="text"
                  className="form-control"
                  id="class_name"
                  name="class_name"
              />
              </div>
              <div className="form-group">
              <label htmlFor="department">Department</label>
              <input
                  type="text"
                  className="form-control"
                  id="department"
                  name="department"
              />
              </div>
            </form>
          </div>
          <div className="actions">
            <button className="button" onClick={() => { close();}}>
              cancel
            </button>
            <button className="button" onClick={submitClass}>
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
            placeholder={"Search class name"}
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

export default ClassList;
