import React from 'react';
import ReactDOM from 'react-dom';
import c from 'classnames';

import style from './app.css';

class App extends React.Component {

  state = {
    p: [],
  };

  componentDidMount() {
    $(() => {
      const url = 'https://spreadsheets.google.com/feeds/list/1Bz0USG2NRm4XBDiZcnX1lKwt29R5KeRMaHaWjpYFfOg/1/public/values?alt=json';

      $.getJSON(url).then((reply) => {
        const entry = reply.feed.entry;
        this.setState({
          p: entry.map(item => {
            return {
              name: item.gsx$name.$t,
              value: item.gsx$value.$t,
            }
          }),
        })
      });
    });
  }

  render() {
    const {p} = this.state;
    return (
      <div>
        {p.map((item, i) => {
          return (
            <div>
              <img src={`image/p${i+1}.png`} />
              <div>{item.name}: {item.value}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));