import React from 'react';
import ReactDOM from 'react-dom';
import c from 'classnames';
import Parse from 'parse';
import accounting from 'accounting';

import style from './app.css';

Parse.initialize("pPZFiNUUeXErVRv2slUWxToiuXL1kBf1wJwMBHA5", "BIuzDtmV1mWqTXoyBcklu34nthQLWoq4f0Dj54yi");

class App extends React.Component {

  state = {
    t4: [],
  };

  findT4FromDoc() {
    const url = 'https://spreadsheets.google.com/feeds/list/1Bz0USG2NRm4XBDiZcnX1lKwt29R5KeRMaHaWjpYFfOg/2/public/values?alt=json';

    $.getJSON(url).then((reply) => {
      const entry = reply.feed.entry;
      this.setState({
        t4: entry.map(item => {
          return {
            name: item.gsx$name.$t,
            value: item.gsx$value.$t,
            id: item.gsx$id.$t,
          }
        }),
      });
    });
  }

  componentDidMount() {
    setInterval(::this.findT4FromDoc, 3000);
  }

  render() {
    const {p, p1, p2, p3, pOpen, pMax, t4} = this.state;

    return (
      <div>
        {t4.filter(item => item.id ? item : null).map((item, i) => {
          return (
            <div key={i} className={style.t4}>
              <img src={`image/${item.id}.png`} />
              <div className={style.info}>{accounting.formatNumber(item.value)}</div>
            </div>
          );
        })}
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));