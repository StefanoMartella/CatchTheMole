const Styles = {
  canvas: {
    display: 'flex',
    marginBottom: '80px',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mole: {
    zIndex: '-1',
    position: 'absolute',
    bottom: '0',
    cursor: 'pointer',
    transition: 'all .3s ease-in-out',
  },
  tunnel: {
    backgroundColor: 'darkKhaki',
    borderWidth: '2px',
    borderColor: '#54596e', // Same as mole's border
    borderStyle: 'solid',
    display: 'flex',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '0 0 12px 12px',
    boxShadow: '0px 5px 8px 0px rgba(0,0,0,0.75)',
  },
  startButton: {
    color: 'darkOliveGreen',
    borderColor: 'darkOliveGreen',
    borderWidth: '2px',
    borderStyle: 'solid',
    fontWeight: 'bold',
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '10px 30px',
    cursor: 'pointer',
  },
  labelContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'flex-end',
    width: '100%',
}
};

export default Styles;
