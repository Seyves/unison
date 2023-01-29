import { useState } from "react"
import { WarningObj } from "../definitions/utilities";

const useWarning = () => {
    const [state, setState] = useState<WarningObj>({trigger: false, message: null})

    return [state, (message) => setState(prev => ({trigger: !prev.trigger, message}))] as [WarningObj, (arg0: string | null) => void]
};

export default useWarning;