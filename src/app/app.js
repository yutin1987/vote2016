import React from 'react';
import ReactDOM from 'react-dom';
import c from 'classnames';

import style from './app.css';

class App extends React.Component {

  state = {
    p: [],
  };

  componentDidMount() {
    const url = 'https://spreadsheets.google.com/feeds/list/1Bz0USG2NRm4XBDiZcnX1lKwt29R5KeRMaHaWjpYFfOg/1/public/values?alt=json';


    setInterval(() => {
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
    }, 3000);
  }

  render() {
    const {p} = this.state;
    return (
      <div>
        <div>
          {p.map((item, i) => {
            return (
              <div className={style.p}>
                <div><img src={`image/p${i+1}.png`} /></div>
                <div className={style.pBar}>
                  <div className={style.pBarPos} style={{width: `${item.value/8000000*100}%`}}>{item.value}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));