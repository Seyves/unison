const Spinner = ({className} : ISpinner) => {
    return (
        <div className={"lds-ellipsis " + className}><div></div><div></div><div></div><div></div></div>
    );
};

interface ISpinner {
    className?: string
}

export default Spinner;