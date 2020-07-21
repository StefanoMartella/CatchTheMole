const setStyle = (element, style) => Object.keys(style).forEach(property =>
  element.style[property] = style[property]
);

function Mole(element, dimension) {
  this.isCrazy = false;
  this.visible = false;
  this.goCrazyTimeout = null;
  this.innerTimeout = null;
  this.show = function() {
    return new Promise((resolve) => {
      setStyle(element, { bottom: `${dimension}px` });
      setTimeout(() => {
        setStyle(element, { zIndex: '0' });
        this.visible = true;
        resolve();
      }, 150); // A little bit less than 300 (transition duration)
    });
  };
  this.hide = function() {
    return new Promise((resolve) => {
      setStyle(element, { zIndex: '-1' });
      setTimeout(() => {
        setStyle(element, { bottom: '0' });
        this.visible = false;
        resolve();
      }, 150); // A little bit less than 300 (transition duration)
    });
  };
  this.goCrazy = function() {
    this.isCrazy = true;
    this.startMole();
  };
  this.startMole = function() {
    this.goCrazyTimeout = !this.isCrazy ? false : setTimeout(async () => {
      await this.show();
      this.innerTimeout = setTimeout(async () => {
        await this.hide();
        this.startMole();
        this.innerTimeout = null;
      }, (Math.random() * (1500 - 500)) + 500);
      this.goCrazyTimeout = null;
    }, (Math.random() * (5000 - 2000)) + 2000);
  }
  this.stopMole = function() {
    this.isCrazy = false;
    this.goCrazyTimeout && clearTimeout(this.goCrazyTimeout);
    this.innerTimeout && clearTimeout(this.innerTimeout);
    this.visible && this.hide();
  }
}

(function() {
  const canvas = document.getElementById("canvas");
  const moles = [];
  let lastMoleHit;
  let score = 0;

  setStyle(canvas, {
    display: 'flex',
    marginBottom: '80px',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  });
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
      mole.src = './src/assets/img/mole.svg';
      setStyle(mole, {
        zIndex: "-1",
        position: "absolute",
        bottom: "0",
        width: `${dimension}px`,
        cursor: "pointer",
        transition: "all .3s ease-in-out",
      });
      mole.addEventListener('dragstart', e => e.preventDefault());
      mole.addEventListener('mousedown', function() {
        if(lastMoleHit !== mole.id) {
          setStyle(mole, { backgroundImage: 'url("./src/assets//img/stars.svg")' });
          setTimeout(() => setStyle(mole, { backgroundImage: null }), 300);
          lastMoleHit = mole.id;
          document.getElementById('actualScore').innerText = `${++score} moles caught`;
        }
      });

      moles.push(new Mole(mole, dimension));

      return mole;
    };

    // Building the grid
    for(let i = 0; i < rowsNumber; i++) {
      let row = document.createElement("div");
      row.id = `row-${i}`;
      row.classList.add('row');
      setStyle(row, { display: 'flex' });

      for(let j = 0; j < columnsNumber; j++) {
        row.appendChild(createTunnel(`${i}${j}`));
      }
      canvas.appendChild(row);
    }

    // This can be declared after the call since this is not an expression function
    function createTunnel(id) {
      let tunnel = document.createElement("div");
      tunnel.classList.add('tunnel');

      let moleImg = document.createElement('img');
      moleImg.src = './src/assets/img/mole-tunnel.svg';
      setStyle(moleImg, { height: '40%' });
      moleImg.addEventListener('dragstart', e => e.preventDefault());

      tunnel.appendChild(moleImg);
      tunnel.appendChild(createMole(id));

      return (function styleTunnel() {
        // Using closure
        tunnel.id = `tunnel-${id}`;
        setStyle(tunnel, {
          backgroundColor: 'darkKhaki',
          borderWidth: "2px",
          borderColor: "#54596e", // Same as mole's border
          borderStyle: "solid",
          height: `${dimension}px`,
          width: `${dimension}px`,
          margin: `0 ${dimension}px`,
          marginTop: `${dimension + 20}px`,
          display: "flex",
          position: "relative",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "0 0 12px 12px",
          boxShadow: "0px 5px 8px 0px rgba(0,0,0,0.75)",
        });

        return tunnel;
      })();
    }
  }

  function initializeStartButton() {
    let startButton = document.createElement('button');
    startButton.innerText = 'START';
    setStyle(startButton, {
      color: 'darkOliveGreen',
      borderColor: 'darkOliveGreen',
      borderWidth: "2px",
      borderStyle: "solid",
      fontWeight: "bold",
      backgroundColor: "white",
      borderRadius: "12px",
      padding: "10px 30px",
      cursor: "pointer",
    });
    startButton.addEventListener('mouseover', () =>
      setStyle(startButton, { color: 'white', backgroundColor: 'darkOliveGreen' })
    );
    startButton.addEventListener('mouseout', () =>
      setStyle(startButton, { color: 'darkOliveGreen', backgroundColor: 'white' })
    );
    startButton.addEventListener('click', () => startGame(startButton));
    canvas.after(startButton);
  }

  function initializeLabels() {
    const storedRecord = window.localStorage.getItem('record');

    let labelContainer = document.createElement('div');
    setStyle(labelContainer, {
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'flex-end',
      width: '100%',
    });

    let actualScoreLabel = document.createElement('span');
    actualScoreLabel.id = 'actualScore';
    actualScoreLabel.innerText = '0 moles caught';
    setStyle(actualScoreLabel, { fontWeight: 'bold', textTransform: 'uppercase' });

    let actualRecordLabel = document.createElement('span');
    actualRecordLabel.id = 'actualRecord';
    actualRecordLabel.innerText = `Record: ${storedRecord ? storedRecord : '0'} moles`;
    setStyle(actualRecordLabel, { fontWeight: 'bold', textTransform: 'uppercase' });

    let countdownLabel = document.createElement('span');
    countdownLabel.innerText = '30';
    countdownLabel.id = 'countdown';
    setStyle(countdownLabel, { fontWeight: 'bold', fontSize: '25px' });

    labelContainer.appendChild(actualScoreLabel);
    labelContainer.appendChild(countdownLabel);
    labelContainer.appendChild(actualRecordLabel);

    canvas.appendChild(labelContainer);
  }

  function startGame(startButton) {
    let countdown = 30;
    score = 0;
    startButton.disabled = true;
    setStyle(startButton, { opacity: '0.5' });

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
      setStyle(startButton, { opacity: '1' });

      if (score > window.localStorage.getItem('record')) {
        window.localStorage.setItem('record', score);
        document.getElementById('actualRecord').innerText = `Record: ${score} moles`;
      }

    }, countdown * 1000);
  }

}());
