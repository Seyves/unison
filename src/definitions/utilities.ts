interface WarningObj {
    trigger: boolean,
    message: string | null
}

interface DirectionStatus {
    top: {
        isLoading: boolean,
        isReached: boolean
    },
    bottom: {
        isLoading: boolean,
        isReached: boolean
    }
}

export { 
    DirectionStatus,
    WarningObj
}