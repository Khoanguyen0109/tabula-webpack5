const styles = (theme) => ({
  root: {
    '&:focus': {
      '& .editor-container': {
        border: '1px solid red'
      }
    },
    '& td': {
      wordBreak: 'break-word'
    }
  },
  editorContainer: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    border: '1px solid ',
    borderRadius: '8px',
    borderColor: theme.newColors.gray[200],
    transition: theme.transitionDefault,
    paddingBottom: 8,
    color: theme.newColors.gray[900]
  },

  noGrow: {
    flex: '0 0 auto'
  },
  body: {
    flex: '1 1 auto',
    position: 'relative',
    display: 'flex',
    background: theme.openColors.white,
    borderRadius: '8px'
  },
  editor: (props) => ({
    minWidth: 200,
    flexGrow: 1,
    flexShrink: 1,
    position: 'relative',
    height: 'auto !important',
    overflow: 'visible',
    minHeight: props.height || '200px',
    fontSize: theme.fontSize.normal,
    maxHeight: 'calc(50vh)',
    padding: theme.spacing(1, 2, 1, 1),
    '& #_rooster_watermarkSpan': {
      fontSize: `${theme.fontSize.normal} !important`,
      color: `${theme.newColors.gray[500]} !important`
    },
    '& h1': {
      lineHeight: theme.spacing(4)
    },
    '& h2': {
      lineHeight: theme.spacing(3)
    }
  })
});
export default styles;