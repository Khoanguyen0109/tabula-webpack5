export const contentLeft = (props, theme) => ({
    backgroundColor: theme.newColors.gray[50],
    borderTop: !!props?.isInProgress && `${theme.spacing(1)} solid ${theme.mainColors.primary2[0]}`,
    borderRadius: theme.spacing(1),
    height: '100%',
    '& .wrap-content': {
      padding: theme.spacing(2),
    }
  });