function Mole(element, dimension) {
  this.isCrazy = false;
  this.visible = false;
  this.goCrazyTimeout = null;
  this.innerTimeout = null;
  this.show = function() {
    return new Promise((resolve) => {
      element.style.bottom = `${dimension}px`;
      setTimeout(() => {
        element.style.zIndex = '0';
        this.visible = true;
        resolve();
      }, 150); // A little bit less than 300 (transition duration)
    });
  };
  this.hide = function() {
    return new Promise((resolve) => {
      element.style.zIndex = '-1';
      setTimeout(() => {
        element.style.bottom = '0';
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

  styleCanvas();
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
      mole.src = 'img/mole.svg';
      mole.style.zIndex = "-1";
      mole.style.position = "absolute";
      mole.style.bottom = "0";
      mole.style.width = `${dimension}px`;
      mole.style.cursor = "pointer";
      mole.style.transition = "all .3s ease-in-out";
      mole.addEventListener('dragstart', e => e.preventDefault());
      mole.addEventListener('mousedown', function() {
        if(lastMoleHit !== mole.id) {
          mole.style.backgroundImage = 'url("./img/stars.svg")';
          setTimeout(() => {
            mole.style.backgroundImage = null;
          }, 300);
          lastMoleHit = mole.id;
          document.getElementById('actualScore').innerText =
            `${++score} moles caught`;
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
      row.style.display = 'flex';

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
      moleImg.src = 'img/mole-tunnel.svg';
      moleImg.style.height = '40%';
      moleImg.addEventListener('dragstart', e => e.preventDefault());

      tunnel.appendChild(moleImg);
      tunnel.appendChild(createMole(id));

      return (function styleTunnel() {
        // Using closure
        tunnel.id = `tunnel-${id}`;
        tunnel.style.backgroundColor = 'darkKhaki';
        tunnel.style.borderWidth = "2px";
        tunnel.style.borderColor = "#54596e"; // Same as mole's border
        tunnel.style.borderStyle = "solid";
        tunnel.style.height = `${dimension}px`;
        tunnel.style.width = `${dimension}px`;
        tunnel.style.margin = `0 ${dimension}px`;
        tunnel.style.marginTop = `${dimension + 20}px`;
        tunnel.style.display = "flex";
        tunnel.style.position = "relative";
        tunnel.style.justifyContent = "center";
        tunnel.style.alignItems = "center";
        tunnel.style.borderRadius = "0 0 12px 12px";
        tunnel.style.boxShadow = "0px 5px 8px 0px rgba(0,0,0,0.75)";

        return tunnel;
      })();
    }
  }

  function styleCanvas() {
    canvas.style.display= 'flex';
    canvas.style.marginBottom = '80px';
    canvas.style.flexDirection= 'column';
    canvas.style.alignItems= 'center';
    canvas.style.justifyContent= 'center';
  }

  function initializeStartButton() {
    let startButton = document.createElement('button');
    startButton.innerText = 'START';
    startButton.style.color = 'darkOliveGreen';
    startButton.style.borderColor = 'darkOliveGreen';
    startButton.style.borderWidth = "2px";
    startButton.style.borderStyle = "solid";
    startButton.style.fontWeight = "bold";
    startButton.style.backgroundColor = "white";
    startButton.style.borderRadius = "12px";
    startButton.style.padding = "10px 30px";
    startButton.style.cursor = "pointer";
    startButton.addEventListener('mouseover', () => {
      startButton.style.color = 'white';
      startButton.style.backgroundColor = "darkOliveGreen";
    });
    startButton.addEventListener('mouseout', () => {
      startButton.style.color = 'darkOliveGreen';
      startButton.style.backgroundColor = "white";
    })
    startButton.addEventListener('click', () => startGame(startButton));
    canvas.after(startButton);
  }

  function initializeLabels() {
    const storedRecord = window.localStorage.getItem('record');

    let labelContainer = document.createElement('div');
    labelContainer.style.display = 'flex';
    labelContainer.style.flexDirection = 'row';
    labelContainer.style.justifyContent = 'space-evenly';
    labelContainer.style.alignItems = 'flex-end';
    labelContainer.style.width = '100%';

    let actualScoreLabel = document.createElement('span');
    actualScoreLabel.id = 'actualScore';
    actualScoreLabel.style.fontWeight = 'bold';
    actualScoreLabel.style.textTransform = 'uppercase';
    actualScoreLabel.innerText = '0 moles caught';

    let actualRecordLabel = document.createElement('span');
    actualRecordLabel.id = 'actualRecord';
    actualRecordLabel.style.fontWeight = 'bold';
    actualRecordLabel.style.textTransform = 'uppercase';
    actualRecordLabel.innerText = `Record: ${storedRecord ? storedRecord : '0'} moles`;

    let countdownLabel = document.createElement('span');
    countdownLabel.innerText = '10';
    countdownLabel.id = 'countdown';
    countdownLabel.style.fontWeight = 'bold';
    countdownLabel.style.fontSize = '25px';

    labelContainer.appendChild(actualScoreLabel);
    labelContainer.appendChild(countdownLabel);
    labelContainer.appendChild(actualRecordLabel);

    canvas.appendChild(labelContainer);
  }

  function startGame(startButton) {
    let countdown = 10;
    score = 0;
    startButton.disabled = true;
    startButton.style.opacity = '0.5';

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
      startButton.style.opacity = '1';

      if (score > window.localStorage.getItem('record')) {
        window.localStorage.setItem('record', score);
        document.getElementById('actualRecord').innerText = `Record: ${score} moles`;
      }

    }, countdown * 1000);
  }

}());
