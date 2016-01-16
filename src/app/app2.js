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
    t4x: {
      '民主進步黨': {value: 0},
      '中國國民黨': {value: 0},
      '台灣團結聯盟': {value: 0},
      '親民黨': {value: 0},
      '時代力量': {value: 0},
      '綠黨社會民主黨聯盟': {value: 0},
    },
    tMax: 0,
    tOpen: 0,
    sum: 0,
  };

  findT4FromDoc() {
    const url = 'https://spreadsheets.google.com/feeds/list/1Bz0USG2NRm4XBDiZcnX1lKwt29R5KeRMaHaWjpYFfOg/2/public/values?alt=json';

    $.getJSON(url).then((reply) => {
      const entry = reply.feed.entry;
      let sum = 0;
      this.setState({
        t4: entry.map(item => {
          sum += parseInt(item.gsx$value.$t, 10);

          return {
            name: item.gsx$name.$t,
            value: item.gsx$value.$t,
            id: item.gsx$id.$t,
          }
        }),
        sum,
      });
    });
  }

  findT4FromParse() {
    const qT4 = new Parse.Query('T4');
    qT4.limit(1000);
    qT4
      .find()
      .then(result => {
        let t4x = {};
        let tOpen = 0;
        let tMax = 0;

        result.map(item => {
          if (!t4x[item.get('name')]) t4x[item.get('name')] = {
            value: 0,
            name: item.get('name'),
          };

          const target = t4x[item.get('name')];
          target.value += parseInt(item.get('value'), 10);
          tOpen += parseInt(item.get('open'), 10);
          tMax += parseInt(item.get('max'), 10);
        });

        tOpen /= 18;
        tMax /= 18;

        return this.setState({ t4x, tOpen, tMax });
      })
      .always(() => {
        setTimeout(::this.findT4FromParse, 10000);
      });
  }

  componentDidMount() {
    setInterval(::this.findT4FromDoc, 3000);
    // setTimeout(::this.findT4FromParse, 10000);
  }

  render() {
    const {t4, t4x, tOpen, tMax, sum} = this.state;

    const idx = ['民主進步黨', '中國國民黨', '台灣團結聯盟', '親民黨', '時代力量', '綠黨社會民主黨聯盟'];

    let total = 0;

    return (
      <div>
        <div>
          {t4.filter(item => item.id ? item : null).map((item, i) => {
            return (
              <div key={i} className={style.t4}>
                <img src={`image/${item.id}.png`} />
                <div className={style.info}>{accounting.formatNumber(item.value)} - {parseInt((item.value / sum * 100), 10)}%</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));