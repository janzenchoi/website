// Outer container that depends on header / footer size
export const outerContainerStyle = {
  height: 'calc(100vh - 50px)',
  width: '100vw'
};

// Container for centering elements horizontally
export const rowContainerStyle = {    
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
};

// Container for centering elements vertically
export const columnContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center'
};

// Style for a grid cell
export const cellStyle = {
  height: '25px',
  width: '25px',
  border: '1px solid lightgrey',
  cursor: 'pointer',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  textAlign: 'center'
};

// Default style for a button
export const buttonStyle = {
  width: '100px',
  cursor: 'pointer'
};
