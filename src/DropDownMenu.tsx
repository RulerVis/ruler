import { Component,createSignal,Accessor,Setter,createMemo } from "solid-js"

export const DropDownMenu:Component<{
    options:any[],
    currentMode:Accessor<string>,
    setCurrentMode:Setter<string>

}> = (props) => {
    const [isOpen, setIsOpen] = createSignal(false);
    const [selectedOption, setSelectedOption] = createSignal(props.options[0]);
    createMemo(()=>{
        let index = Number(props.currentMode().replace("mode",""))
        setSelectedOption(props.options[index-1])
    })

    const handleOptionClick = (option:any) => {
        setSelectedOption(option);
        props.setCurrentMode(option.value)
        setIsOpen(false);
    };

    return (
        <div class="relative w-full">
            <button
                class="py-2 px-4  focus:outline-none"
                onClick={() => setIsOpen(!isOpen())}
            >
                {selectedOption().label}
            </button>
            {isOpen() && (
                <div class="absolute top-10 right-0 z-10 bg-white shadow-md rounded-md">
                {props.options.map((option) => (
                    <div
                    class="py-2 px-4 cursor-pointer hover:bg-blue-100 w-full"
                    onClick={() => handleOptionClick(option)}
                    >
                    {option.label}
                    </div>
                ))}
                </div>
            )}
        </div>
    );
}