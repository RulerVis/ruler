import { Component, createSignal, Accessor, Setter, createMemo } from "solid-js"

export const DropDownMenu: Component<{
    options: any[],
    currentMode?: Accessor<string>,   // <-- Make it optional
    setCurrentMode?: Setter<string>,   // <-- Make it optional
    datasetMode?: Accessor<string>,   // <-- Make it optional
    setDatasetMode?: Setter<string>,   // <-- Make it optional

}> = (props) => {
    const [isOpen, setIsOpen] = createSignal(false);
    const [selectedOption, setSelectedOption] = createSignal(props.options[0]);
    
    createMemo(() => {
        if (props.currentMode) {   // <-- Check if it exists
            let index = Number(props.currentMode().replace("mode", ""))
            setSelectedOption(props.options[index - 1])
        }
        if (props.datasetMode) {   // <-- Check if it exists
            let index = Number(props.datasetMode().replace("dataset", ""))
            setSelectedOption(props.options[index - 1])
        }

    })

    const handleOptionClick = (option: any) => {
        setSelectedOption(option);
        if (props.setCurrentMode) {   // <-- Check if it exists
            props.setCurrentMode(option.value)
        }
        if (props.setDatasetMode) {   // <-- Check if it exists
            props.setDatasetMode(option.value)
        }
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
