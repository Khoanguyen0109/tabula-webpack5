import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme) => ({
    root: {
        maxHeight: `calc(100% - ${theme.navbar.gradebook}px)`,
        width: '100%',
        paddingTop: theme.spacing(3),
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        overflowY: 'auto',
    },
    tabs: {
        marginBottom: theme.spacing(2)

    },
    tabButton: {
        color: theme.newColors.gray[400],
        backgroundColor: 'transparent',
        textTransform: 'none',
        width: theme.spacing(10),
        borderRadius: theme.spacing(22.5),
        lineHeight: theme.spacing(2.5),
        fontSize: theme.fontSize.normal,
        fontWeight: theme.fontWeight.normal,
        minHeight: theme.spacing(0),
        padding: theme.spacing(0.625)

    },
    tabSelected: {
        color: 'white !important',
        backgroundColor: theme.customColors.primary1.main,

    },
    filters: {
        display: 'flex',
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: theme.spacing(3)

    },
    rightFilter: {
        display: 'flex'
        
    },
    searchBox: {
        width: theme.spacing(30),
        marginRight: theme.spacing(2)

    },
    filter: {
        width: theme.spacing(25),
        marginRight: theme.spacing(2)

    },
    lefFilter: {
        width: theme.spacing(25),
    },
    indicator: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },

}));

export default useStyles;