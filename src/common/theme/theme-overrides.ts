import type { GlobalThemeOverrides } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
    common: {
        primaryColor: '#3a8696',
        errorColor: '#FF0055',
        warningColor: '#FF8000',
        borderRadius: '5px',
        borderRadiusSmall: '3px',
        borderColor: '#e4e7ec',
    },
    Card: {
        borderRadius: '7px',
    },
    Tag: {
        borderRadius: '4px',
    },
}

export const darkThemeOverrides: GlobalThemeOverrides = {
    common: {
        primaryColor: '#3a8696',
        errorColor: '#FF0055',
    },
    Popover: {
        color: '#0f172a',
    },
    DataTable: {
        thColor: '#1c202c',
        tdColor: '#1c2334',
        hoverColor: '#1c202c',
    },
    Tag: {
        borderRadius: '4px',
    },
}

export default themeOverrides