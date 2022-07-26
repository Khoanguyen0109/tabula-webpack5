const styles = (theme) => ({
  root: {
    padding: theme.spacing(1,1),
  },
  colorPrimary: {
      color: theme.mainColors.primary1[0]
  },
  colorSecondary: {
      color: theme.mainColors.primary2[0]
  },
  indeterminate: {

  },
  checked: {
      '&:hover': {

      },
      '&:active': {

      }
  },
  disabled: {
    '&:active': {
        backgroundColor: theme.openColors.white,
      },
    '& svg#icn_checkbox_unselected g': {
      fill: theme.mainColors.gray[2],
      stroke: theme.mainColors.gray[6]
    },
    '& svg#icn_checkbox_selected rect': {
      fill: theme.mainColors.gray[6],
    }
  }
});

export default styles;