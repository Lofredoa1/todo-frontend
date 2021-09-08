import AllPosts from "./pages/AllPosts";
import SinglePost from "./pages/SinglePost";
import Form from "./pages/Form";

import React, {useState, useEffect} from "react"
import {Route, Switch, Link} from "react-router-dom"

function App(props) {
  ////////////////////
  // Style Objects
  ////////////////////

  const h1 = {
    textAlign: "center",
    margin: "10px",
  };

  const button = {
    backgroundColor: "navy",
    display: "block",
    margin: "auto",
  };

  ///////////////////////////
  // State & Other Variables
  //////////////////////////

  // Our API URL
  const url = "https://todo-al.herokuapp.com/todos/"

  // State to Hold The List of Posts
  const [posts, setPosts] = useState([]);

  // an object that represents a null todo
  const nullTodo = {
    subject: "",
    details: "",
  };

  const [targetTodo, setTargetTodo] = useState(nullTodo);

  //////////////
  // Functions
  //////////////
  const getTodos = async () => {
    const response = await fetch(url)
    const data = await response.json()
    setPosts(data)
  };

  const addTodos = async (newTodo) => {
    const response = await fetch(url, {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodo),
    });
    // get updated list of todos
    getTodos();
  };

  const getTargetTodo = (todo) => {
    setTargetTodo(todo);
    props.history.push("/edit");
  };

  const updateTodo = async (todo) => {
    const response = await fetch(url + todo.id + "/", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(todo),
    });
    getTodos();
  };

  const deleteTodo = async (todo) => {
    const response = await fetch(url + todo.id + "/", {
      method: "delete",
    });
  
    // get updated list of todos
    getTodos();
    props.history.push("/");
  };

  //////////////
  // useEffects
  //////////////
  useEffect(() => {getTodos()},[])

  /////////////////////
  // returned JSX
  /////////////////////
  return (
    <div>
      <h1 style={h1}>My Todo List</h1>
      <Link to="/new"><button style={button}>Create New ToDo</button></Link>
      <Switch>
        <Route
          exact
          path="/"
          render={(routerProps) => <AllPosts {...routerProps} posts={posts} />
        }/>
        <Route
          path="/post/:id"
          render={(routerProps) => (
            <SinglePost 
              {...routerProps} 
              posts={posts} 
              edit={getTargetTodo} 
              deleteTodo={deleteTodo}
            />
          )}
        />
        <Route
          path="/new"
          render={(routerProps) => (
            <Form 
              {...routerProps}
              initialTodo={nullTodo}
              handleSubmit={addTodos}
              buttonLabel="create todo"
            />
          )}
        />
        <Route
          path="/edit"
          render={(routerProps) => (
            <Form 
              {...routerProps}
              initialTodo={targetTodo}
              handleSubmit={updateTodo}
              buttonLabel="Update ToDo" 
            />
          )}
        />
      </Switch>
    </div>
  );
}

export default App;
