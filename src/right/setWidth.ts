import { Accessor,Setter,onCleanup } from "solid-js" 




export interface WidthOptions {
    setMaxRuleBarWidth:Setter<number>
}

declare module 'solid-js' {
    namespace JSX {
      interface Directives {
        setWidth: WidthOptions
      }
    }
}

export const setWidth = (el:any,value:Accessor<WidthOptions>) => {
    const {setMaxRuleBarWidth} = value()
    console.log("check element")
    console.log(el.clientWidth)
    

    

  
    


}