const styles = (theme) => ({
  ribbon: {
    // height: 38,
    whiteSpace: 'nowrap',
    padding: theme.spacing(1, 0.5, 0.75, 0.5),
    display: 'flex',
    background: theme.newColors.gray[50],
    borderRadius: theme.spacing(1, 1, 0, 0)
  },
  line: {
    border: `1px solid ${theme.newColors.gray[400]}`,
    height: '20px',
    margin: theme.spacing(0.75, 1, 0, 1)
  },
  textButton: {
    marginLeft: 'auto'
  },
  dropDownButton: {
    position: 'relative',
    overflow: 'visible',
  },
  dropDownButtonDisabled: {
    opacity: '0.4'
  },
  dropDown: {
    zIndex: 1,
    minWidth: 180,
    display: 'inline-block',
    backgroundColor: 'white',
    padding: theme.spacing(2, 1),
    position: 'absolute',
    top: 32,
    left: 0,
    border: '1px solid #E9ECEF',
    boxSizing: 'border-box',
    boxShadow: '0px 8px 32px rgba(33, 37, 41, 0.16)',
    borderRadius: theme.spacing(1)
  },
  dropDownItem: {
    cursor: 'pointer',
    padding: 2,
    whiteSpace: 'nowrap',
    minWidth: 60,
    '&:hover': {
      backgroundColor: '#aaf6ff',
    }
  }
});
export default styles;