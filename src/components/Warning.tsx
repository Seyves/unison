import { useRef, useEffect } from 'react';
import { WarningObj } from '../definitions/utilities';

const Warning = ({warning, className} : IWarning) => {
    const elem = useRef<HTMLDivElement>(null)

    useEffect(() => {
        //Magical animation retrigger
        elem.current?.classList?.remove("animate-hide");
        void elem.current?.offsetWidth;
        elem.current?.classList?.add("animate-hide");
    }, [warning.trigger])

    return (
        <div ref={elem} className={'text-red-600 text-center mt-4 opacity-0 ' + className}>
            {warning.message}
        </div>
    );
};

interface IWarning {
    className?: string
    warning: WarningObj
}

export default Warning;