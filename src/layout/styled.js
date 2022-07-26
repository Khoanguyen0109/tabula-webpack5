export default (theme) => ({
  root: {
  },
  layoutSidebar: {
    width: theme.sideBar.openWidth,
    zIndex: theme.zIndex.drawer,
  },
  layoutSidebarClose: {
    width: theme.sideBar.width,
  },
  layoutContent: {
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    height: '100vh'
  }
});