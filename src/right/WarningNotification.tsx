import { Component, Accessor, Setter, Show,createMemo } from "solid-js";
import { notification } from "antd";

export const WarningNotification: Component<{
  notifVisible: Accessor<boolean>,
  setNotifVisible: Setter<boolean>
}> = (props) => {
    createMemo(()=>{
        if (props.notifVisible()) {
            notification.warning({
              message: "Sorry",
              description: "Ruler currently does not support fine-tune for rule at this level of complexity, you can try some simplier one instead.More robust fine-tuning function is on the way.",
              placement:"topRight",
              duration:60
            });
          }
    })
  

  return null;
};