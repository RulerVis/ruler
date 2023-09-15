import { Component,onMount } from "solid-js"
import { render } from "solid-js/web"
import { Ruler } from "./Ruler"

export const Input:Component<{

}> = (props) => {
    
    const renderRuler = (el:HTMLInputElement) => {
        el.addEventListener("change", () => {
            console.log("change!!!!")
            const ruler = document.getElementById('ruler');
            // Call unmount to clear the previously mounted content
            const unmount = render(()=>null, ruler!)

            unmount()

            // Render the Ruler component
            render(() => <Ruler />, ruler!)              
        })
       
    }

    onMount(() => {
        const el = document.getElementById("file-input")
        renderRuler(el as HTMLInputElement)
    });


    return (
        <div class="absolute">
            <input type="file" id="file-input" class="hidden" />
            <label for="file-input" class="cursor-pointer px-2 py-1 rounded-md bg-gray-200 text-gray-600 hover:bg-gray-300 transition-colors">
                Choose file
            </label>
        </div>
    )
}