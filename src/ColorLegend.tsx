import { interpolatePiYG,interpolateGreys } from 'd3-scale-chromatic';
import { Component,createMemo, createSignal,Accessor } from 'solid-js';



  
  export const ColorScaleLegend:Component<{
    min:number,
    max:number,
    scaleMode:Accessor<string>
  }> = (props) => {
    const [colorScale, setColorScale] = createSignal<{ value: number; color: string }[] | null>(null);
  
    createMemo(() => {
      setColorScale(() => {
        const scale = [];
        for (let i = 0; i < 11; i++) {
          const value = props.min + (props.max - props.min) / 10 * i;
          let color
          if(props.scaleMode() == "mode1" || props.scaleMode() == "mode2") {
            color = interpolateGreys(i / 10);
          }
          else{
            color = interpolatePiYG(i / 10);
          }
          scale.push({ value, color });
        }
        return scale;
      });
    });
  
    return (
      <div>
        <div class="flex justify-between">
          {colorScale() && colorScale()?.map(({ value, color }) => (
            <div
              style={{
                "background-color": color,
                width: '20px',
                height: '20px',
              }}
            />
          ))}
        </div>
        <div class="flex justify-between mt-1px text-xs">
          <div>0</div>
          <div>max</div>
        </div>
      </div>
    );
  }