import './styles/custom.scss';
import './styles/main.scss';
import './styles/normalize.scss';
import Styles from './styles';
import MoleImg from './assets/img/mole.svg'
import MoleTunnelImg from './assets/img/mole-tunnel.svg'
import StarsImg from './assets/img/stars.svg'
import {setStyle} from './utils';
import Mole from './models/Mole';

(function() {
  const canvas = document.getElementById('canvas');
  const moles = [];
  let lastMoleHit;
  let score = 0;

  setStyle(canvas, Styles.canvas);
  initializeStartButton();
  initializeLabels();
  createGrid({rowsNumber: 3, columnsNumber: 3});

  function createGrid({rowsNumber = 10, columnsNumber = 10}) {

    let dimension = window.innerWidth / columnsNumber / 6;

    // Function expression placed before usage in createTunnel function call
    const createMole = function(id) {
      let mole = document.createElement('img');
      mole.id = `mole-${id}`;
      mole.classList.add('mole');
      mole.src = MoleImg;
      setStyle(mole, {...Styles.mole, width: `${dimension}px`});
      mole.addEventListener('dragstart', e => e.preventDefault());
      mole.addEventListener('mousedown', function() {
        if (lastMoleHit !== mole.id) {
          mole.classList.add('hit')
          setTimeout(() => mole.classList.remove('hit'), 300);
          lastMoleHit = mole.id;
          document.getElementById('actualScore').innerText = `${++score} moles caught`;
        }
      });

      moles.push(new Mole(mole, dimension));

      return mole;
    };

    // Building the grid
    for (let i = 0; i < rowsNumber; i++) {
      let row = document.createElement('div');
      row.id = `row-${i}`;
      row.classList.add('row');
      setStyle(row, {display: 'flex'});

      for (let j = 0; j < columnsNumber; j++) {
        row.appendChild(createTunnel(`${i}${j}`));
      }
      canvas.appendChild(row);
    }

    // This can be declared after the call since this is not an expression function
    function createTunnel(id) {
      let tunnel = document.createElement('div');
      tunnel.classList.add('tunnel');

      let moleImg = document.createElement('img');
      moleImg.src = MoleTunnelImg;
      setStyle(moleImg, {height: '40%'});
      moleImg.addEventListener('dragstart', e => e.preventDefault());

      tunnel.appendChild(moleImg);
      tunnel.appendChild(createMole(id));

      return (function styleTunnel() {
        // Using closure
        tunnel.id = `tunnel-${id}`;
        setStyle(tunnel, {
          ...Styles.tunnel,
          height: `${dimension}px`,
          width: `${dimension}px`,
          margin: `0 ${dimension}px`,
          marginTop: `${dimension + 20}px`,
        });

        return tunnel;
      })();
    }
  }

  function initializeStartButton() {
    let startButton = document.createElement('button');
    startButton.innerText = 'START';
    setStyle(startButton, Styles.startButton);
    startButton.addEventListener('mouseover', () =>
      setStyle(startButton, {color: 'white', backgroundColor: 'darkOliveGreen'}),
    );
    startButton.addEventListener('mouseout', () =>
      setStyle(startButton, {color: 'darkOliveGreen', backgroundColor: 'white'}),
    );
    startButton.addEventListener('click', () => startGame(startButton));
    canvas.after(startButton);
  }

  function initializeLabels() {
    const storedRecord = window.localStorage.getItem('record');

    let labelContainer = document.createElement('div');
    setStyle(labelContainer, Styles.labelContainer);

    let actualScoreLabel = document.createElement('span');
    actualScoreLabel.id = 'actualScore';
    actualScoreLabel.innerText = '0 moles caught';
    setStyle(actualScoreLabel, {fontWeight: 'bold', textTransform: 'uppercase'});

    let actualRecordLabel = document.createElement('span');
    actualRecordLabel.id = 'actualRecord';
    actualRecordLabel.innerText = `Record: ${storedRecord ? storedRecord : '0'} moles`;
    setStyle(actualRecordLabel, {fontWeight: 'bold', textTransform: 'uppercase'});

    let countdownLabel = document.createElement('span');
    countdownLabel.innerText = '30';
    countdownLabel.id = 'countdown';
    setStyle(countdownLabel, {fontWeight: 'bold', fontSize: '25px'});

    labelContainer.appendChild(actualScoreLabel);
    labelContainer.appendChild(countdownLabel);
    labelContainer.appendChild(actualRecordLabel);

    canvas.appendChild(labelContainer);
  }

  function startGame(startButton) {
    let countdown = 30;
    score = 0;
    startButton.disabled = true;
    setStyle(startButton, {opacity: '0.5'});

    document.getElementById('actualScore').innerText = '0 moles caught';

    moles.forEach(mole => mole.goCrazy());

    let countdownInterval = setInterval(() => {
      document.getElementById('countdown').innerText =
        // To prevent countdown to be less than 0:
        // It could happen (almost impossible) because this setInterval is called
        // some milliseconds before the following setTimeout
        (countdown ? --countdown : countdown) < 10 ? `0${countdown}` : countdown;
    }, 1000);

    setTimeout(() => {
      clearInterval(countdownInterval);
      moles.forEach(mole => mole.stopMole());
      startButton.disabled = false;
      setStyle(startButton, {opacity: '1'});

      if (score > window.localStorage.getItem('record')) {
        window.localStorage.setItem('record', score);
        document.getElementById('actualRecord').innerText = `Record: ${score} moles`;
      }

    }, countdown * 1000);
  }

}());
