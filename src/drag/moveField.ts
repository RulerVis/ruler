import { index } from 'd3';
import { onCleanup,Accessor,Setter } from 'solid-js'
import { produce,SetStoreFunction,} from 'solid-js/store'

export interface moveOptions {
    field:any,
    fields:Accessor<any[]>,
    setFields:Setter<string[]>
}

declare module 'solid-js' {
    namespace JSX {
        interface Directives {
            moveField:moveOptions   
        }
    }
}

export const moveField = (el:HTMLElement,value:Accessor<moveOptions>) => {

    const {field,fields,setFields} = value()

    let list:HTMLElement
    let children:any

    let x:number
    let y:number

    let index:number
    


    const handleDragStart = (event:DragEvent) => {
        
        el.addEventListener("drag",handleDrag)
        el.addEventListener("dragend",handleDragEnd)
        
    
    }

    const handleDrag = (event:DragEvent) => {
        event.preventDefault()
        

        el.classList.add("opacity-20")
        el.classList.add("border-dashed")
        el.classList.add("border-gray-500")
        el.classList.add("rounded-md")

        //get the FlowBoard Element
        list = document.getElementById("fieldContainer") as HTMLElement
        children = list.children

        x = event.clientX
        y = event.clientY 


        for(let i:number=0;i<children.length;i++){
            if(children[i].classList.contains("divider")){
                if(children[i] === document.elementFromPoint(x,y) as HTMLElement){
                    children[i].classList.add("bg-red-300")
                }
                else{
                    children[i].classList.remove("bg-red-300")
                }
                
            }
        }
    }

    const handleDragEnd = (event:DragEvent) => {

        x = event.clientX
        y = event.clientY

        for(let i:number=0;i<children.length;i++){
            if(children[i].classList.contains("divider")){
                children[i].classList.remove("bg-red-300")  
                if(children[i] === document.elementFromPoint(x,y) as HTMLElement){
                    index = Number(children[i].classList[0].replace("divider",""))
                    console.log("check index")
                    console.log(index)
                }     
            }
        }

        if(index == 1000){
            setFields((fields:any[])=>{
                let array = fields.slice()
                array = array.filter((item:any)=>(item!=field))
                array.push(field)
                console.log("fields")
                console.log(array)
                return array
            })
        }
        else if(index>=0){
            setFields((fields:any[])=>{
                let array = fields.slice()
                let newArray:string[] = []
                for(let i=0;i<index;i++){
                    if(array[i] != field) newArray.push(array[i])
                }
                newArray.push(field)
                for(let i=index;i<array.length;i++){
                    if(array[i] != field) newArray.push(array[i])
                }

                return newArray
            })
        }

 

        

        

        

        el.classList.remove("opacity-20")
        el.classList.remove("border-dashed")
        el.classList.remove("border-gray-500")
        el.removeEventListener("drag",handleDrag)
        el.removeEventListener('dragend',handleDragEnd)
        

    }
    el.addEventListener("dragstart",handleDragStart)
    el.addEventListener("dragover", (event:MouseEvent) => {
        event.preventDefault();
      });
    onCleanup(()=>{
        el.removeEventListener("dragstart",handleDragStart)
    })   
}