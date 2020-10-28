import {setStyle} from '../utils';

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

export default Mole;
