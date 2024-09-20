import React, { Component } from 'react';
import DataStreamer, { ServerRespond } from './DataStreamer';
import Graph from './Graph';
import './App.css';

/**
 * State declaration for <App />
 */
interface IState {
  data: ServerRespond[],
}

/**
 * The parent element of the react app.
 * It renders title, button and Graph react element.
 */
class App extends Component<{}, IState> {

  private intervalId: NodeJS.Timeout | undefined;

  constructor(props: {}) {
    super(props);

    this.state = {
      // data saves the server responds.
      // We use this state to parse data down to the child element (Graph) as element property
      data: [],
    };
  }

  /**
   * Render Graph react component with state.data parse as property data
   */
  renderGraph() {
    console.log('Rendering graph with data:', this.state.data);
    return (<Graph data={this.state.data}/>)
  }

  /**
   * Start requesting data from server when the App component is mounted
   */
  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  /**
   * Get new data from server and update the state with the new data
   */
   getDataFromServer() {
    this.intervalId = setInterval(() => {
      DataStreamer.getData((serverResponds: ServerRespond[]) => {
        // Update the state by creating a new array of data that consists of
        // Previous data in the state and the new data from server

        if (serverResponds.length === 0) {

          // stop requesting data from the server when the server does not return anymore data
          // or the app is closed
          // by clearing the intervalId

          if (this.intervalId) {
            clearInterval(this.intervalId);
          }
        } else {
          this.setState({ data: [...this.state.data, ...serverResponds] });
        }
      });
    }, 100);
  }


  /**
   * Render the App react component
   */
  render() {

    return (
      <div className="App">
        <header className="App-header">
          Bank & Merge Co Task 2
        </header>
        <div className="App-content">
          <button className="btn btn-primary Stream-button"
            // when button is click, our react app tries to request
            // new data from the server.
            // As part of your task, update the getDataFromServer() function
            // to keep requesting the data every 100ms until the app is closed
            // or the server does not return anymore data.
            onClick={() => {this.getDataFromServer()}}>
            Start Streaming Data
          </button>
          <div className="Graph">
            {this.renderGraph()}
          </div>
        </div>
      </div>
    )
  }
}

export default App;
