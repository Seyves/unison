import { useState } from 'react'
import { DirectionStatus } from '../definitions/utilities';

const useDirectionStatus = () => {
    let [directionStatus, setDirectionStatusRaw] = useState<DirectionStatus>({
        top: {
            isLoading: false,
            isReached: false
        },
        bottom: {
            isLoading: false,
            isReached: false
        }
    })

    const setDirectionStatus = <T extends keyof DirectionStatus>(
        direction: T, state: keyof DirectionStatus[T], 
        status: boolean
    ) => {
        setDirectionStatusRaw(prev => ({
            ...prev,
            [direction]: {
                ...prev[direction],
                [state] : status
            }
        }))
    }

    return [directionStatus, setDirectionStatus] as const
};

export default useDirectionStatus;
