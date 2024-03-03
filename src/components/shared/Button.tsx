import PlusIcon from "../icons/PlusIcon";

interface ButtonProp {
    label: string;
    onClick: () => void;
}
function Button({ label, onClick }: ButtonProp) {
    return (
        <button
            className="
            px-3 py-1
    cursor-pointer
    rounded-lg
    text-sm
    text-gray-900
    dark:text-white
    dark:bg-primary
    bg-white
    border-2
    dark:border-secondary
    border-gray-300
    shadow-md
    dark:ring-rose-500
    ring-blue-700
    hover:ring-2
    flex
    whitespace-nowrap
gap-2"
            onClick={onClick}
        >
            <PlusIcon />   {label}
        </button>
    );
}

export default Button;
