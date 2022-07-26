const styles = (theme) => ({
  root: {
    padding: theme.spacing(1), // remove this if ripple is enabled

    '& svg': {
      height: theme.spacing(3.5),
      width: theme.spacing(3.5),
      borderRadius: theme.spacing(1.2),
      padding: '2px',

    },

    '&:active': {
      '& svg': {
        background: theme.newColors.primary[50],
        transition: '0.2s all',
      },

      '& svg path': {
        transition: '0.2s all',
      },

      '& svg#icn_checkbox_selected path': {
        fill: theme.newColors.primary[800],
      },
      '& svg#icn_checkbox_indeterminate path': {
        fill: theme.newColors.primary[800],
      },
    },

    '& svg#icn_checkbox_unselected path': {
      fill: '#FFFFFF',
      stroke: theme.newColors.gray[400],
    },
    '& svg#icn_checkbox_unselected path#unselected_icon': {
      stroke: '#FFFFFF',
    },

    '& svg#icn_checkbox_selected path': {
      fill: theme.newColors.primary[500],
      stroke: theme.newColors.primary[800],
    },
    '& svg#icn_checkbox_selected path#selected_icon': {
      stroke: '#FFFFFF',
    },

    '& svg#icn_checkbox_indeterminate g#indeterminate_icon path': {
      fill: '#FFFFFF',
    },
  },

  disabled: {
    '& svg#icn_checkbox_unselected path': {
      fill: theme.newColors.gray[100],
      stroke: theme.newColors.gray[200],
    },
    '& svg#icn_checkbox_unselected path#unselected_icon': {
      stroke: theme.newColors.gray[100],
    },

    '& svg#icn_checkbox_selected path': {
      fill: theme.newColors.gray[100],
      stroke: theme.newColors.gray[200],
    },
    '& svg#icn_checkbox_selected path#selected_icon': {
      stroke: theme.newColors.gray[200],
    },

    '& svg#icn_checkbox_indeterminate path': {
      fill: theme.newColors.gray[100],
      stroke: theme.newColors.gray[200],
    },
    '& svg#icn_checkbox_indeterminate g#indeterminate_icon path': {
      stroke: theme.newColors.gray[200],
      fill: theme.newColors.gray[200],
    },
  },
});

export default styles;
