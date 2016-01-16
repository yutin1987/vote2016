import React from 'react';
import ReactDOM from 'react-dom';
import c from 'classnames';
import Parse from 'parse';
import accounting from 'accounting';

import style from './app.css';

Parse.initialize("pPZFiNUUeXErVRv2slUWxToiuXL1kBf1wJwMBHA5", "BIuzDtmV1mWqTXoyBcklu34nthQLWoq4f0Dj54yi");

class App extends React.Component {

  state = {
    p: [],
  };

  findPresidentFromDoc() {
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
  }

  findPresidentFromParse() {
    const qPresident = new Parse.Query('President');
    qPresident.limit(1000);
    qPresident
      .find()
      .then(result => {
        let p1 = 0;
        let p2 = 0;
        let p3 = 0;
        let pOpen = 0;
        let pMax = 0;

        result.map(item => {
          switch(item.get('name')) {
            case '朱立倫王如玄': p1 += parseInt(item.get('value'), 10); break;
            case '蔡英文陳建仁': p2 += parseInt(item.get('value'), 10); break;
            case '宋楚瑜徐欣瑩': p3 += parseInt(item.get('value'), 10); break;
          }

          pOpen += parseInt(item.get('open'));
          pMax += parseInt(item.get('max'));
        });

        pOpen /= 3;
        pMax /= 3;

        return this.setState({ p1, p2, p3, pOpen, pMax });
      })
      .always(() => {
        setTimeout(::this.findPresidentFromParse, 10000);
      });
  }

  componentDidMount() {
    setInterval(::this.findPresidentFromDoc, 3000);
    setTimeout(::this.findPresidentFromParse, 10000);
  }

  render() {
    const {p, p1, p2, p3, pOpen, pMax, t4} = this.state;

    return (
      <div>
        <div style={{width: 300}}>
          {p.map((item, i) => {
            return (
              <div key={i} className={style.p}>
                <div><img src={`image/p${i+1}.png`} /></div>
                <div className={style.pBar}>
                  <div className={style.pBarPos} style={{width: `${item.value/8000000*100}%`}}>{item.value}</div>
                </div>
              </div>
            );
          })}
        </div>
        <div>
          <div>總統票[中選會]<br />國民黨朱立倫: {p1}<br />民進黨蔡英文: {p2}<br />親民黨宋楚瑜: {p3}<br />開票狀況: {pOpen}/{pMax}</div>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<App/>, document.getElementById('app'));