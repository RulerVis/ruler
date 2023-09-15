import { Accessor,Setter } from "solid-js"

export const scrollToRow = (event:MouseEvent,reactiveData:Accessor<any>,reactiveDataVisible:Accessor<boolean>,currentIndex:Accessor<number>,setCurrentIndex:Setter<number>,step:number) => {
    event.preventDefault()
    // console.log("currentIndex")
    // console.log(currentIndex())
    if(reactiveDataVisible() == true){
        if(step == -1){
            if(currentIndex() == 0 || currentIndex() == -1){
                setCurrentIndex(reactiveData().length-1)
            }
            else{
                setCurrentIndex((index)=>(index+step))
            }    
        }
        else if(step == 1){
            if(currentIndex() == reactiveData().length-1){
                setCurrentIndex(0)
            }
            else{
                setCurrentIndex((index)=>(index+step))
            }    
        }
        let row = document.getElementById("select-row-"+currentIndex().toString()) as Element
        // let allRows = document.getElementsByClassName("single-row")
        // for(let i=0;i<allRows.length;i++){
        //     if(allRows[i] == row){
        //         for(const child of allRows[i].childNodes){
        //             let element = child as Element
        //             element.classList.add("bg-blue-400")
        //         }   
        //     }
        //     else{
        //         for(const child of allRows[i].childNodes){
        //             let element = child as Element
        //             element.classList.remove("bg-blue-400")   
        //         }   
        //     }
            
        // }

        row?.scrollIntoView({ behavior: "smooth",block:"center"})

    }
    return true

}