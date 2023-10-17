import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import ListGroup from "react-bootstrap/ListGroup";

class App extends Component {
  constructor(props) {
    super(props);

    // Setting up state
    this.state = {
      userInput: "",
      list: [],
    };
  }

  // Set a user input value
  updateInput(value) {
    this.setState({
      userInput: value,
    });
  }

  // Add item if user input is not empty
  addItem() {
    if (this.state.userInput !== "") {
      // Send a POST request to add a new item to the backend
      fetch("http://localhost:3001/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ description: this.state.userInput }),
      })
        .then((response) => response.json())
        .then((data) => {
          // Update the state with the newly created item
          this.setState((prevState) => ({
            list: [...prevState.list, data],
            userInput: "",
          }));
        })
        .catch((error) => {
          console.error("Error adding a task:", error);
        });
    }
  }

  // Function to delete item from the list and the backend
  deleteItem(id) {
    // Send a DELETE request to remove the item from the backend
    fetch(`http://localhost:3001/api/tasks/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        // Update the state to remove the deleted item
        this.setState((prevState) => ({
          list: prevState.list.filter((item) => item._id !== id),
        }));
      })
      .catch((error) => {
        console.error("Error deleting a task:", error);
      });
  }

  // Function to edit an item in the list and the backend
  editItem(index) {
    const todos = [...this.state.list];
    const editedTodo = prompt("Edit the todo:");
    if (editedTodo !== null && editedTodo.trim() !== "") {
      const updatedTodo = { description: editedTodo };

      // Send a PUT request to update the item in the backend
      fetch(`http://localhost:3001/api/tasks/${todos[index]._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedTodo),
      })
        .then(() => {
          // Update the state with the edited item
          this.setState((prevState) => {
            const updatedList = [...prevState.list];
            updatedList[index].description = editedTodo;
            return { list: updatedList };
          });
        })
        .catch((error) => {
          console.error("Error updating a task:", error);
        });
    }
  }

  // Fetch tasks from the backend when the component mounts
  componentDidMount() {
    fetch("http://localhost:3001/api/tasks")
      .then((response) => response.json())
      .then((data) => {
        this.setState({ list: data });
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  }

  render() {
    return (
      <Container>
        <Row
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "3rem",
            fontWeight: "bolder",
          }}
        >
          TODO LIST
        </Row>

        <hr />
        <Row>
          <Col md={{ span: 5, offset: 4 }}>
            <InputGroup className="mb-3">
              <FormControl
                placeholder="add item . . . "
                size="lg"
                value={this.state.userInput}
                onChange={(item) => this.updateInput(item.target.value)}
                aria-label="add something"
                aria-describedby="basic-addon2"
              />
              <InputGroup>
                <Button
                  variant="dark"
                  className="mt-2"
                  onClick={() => this.addItem()}
                >
                  ADD
                </Button>
              </InputGroup>
            </InputGroup>
          </Col>
        </Row>
        <Row>
          <Col md={{ span: 5, offset: 4 }}>
            <ListGroup>
              {/* map over and print items */}
              {this.state.list.map((item, index) => {
                return (
                  <div key={index}>
                    <ListGroup.Item
                      variant="dark"
                      action
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      {item.description}
                      <span>
                        <Button
                          style={{ marginRight: "10px" }}
                          variant="light"
                          onClick={() => this.deleteItem(item._id)}
                        >
                          Deletion
                        </Button>
                        <Button variant="light" onClick={() => this.editItem(index)}>
                          Edit
                        </Button>
                      </span>
                    </ListGroup.Item>
                  </div>
                );
              })}
            </ListGroup>
          </Col>
        </Row>
      </Container>
    );
  }
}

export default App;