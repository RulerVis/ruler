import { Component,createSignal,createEffect } from "solid-js"
import { Ruler } from "./Ruler"
import { Input } from "./Input"

const App:Component<{

}> = (props) => {
    

    

 
    return (
        <>
            <Input/>
            <Ruler />
        </>
    )
    
}

export default App