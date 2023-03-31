import { Component, onMount } from "solid-js";
import { notification } from "antd";

export const Notification: Component<{}> = (props) => {
  onMount(() => {
    notification.open({
      message: "Notification Before Using Ruler",
      description: "The display ratio of Ruler may not be suitable for your current device, please adjust the resolution of your device for better use.",
      duration:0,
      placement:"top"

    });
  });

  return <div class="absolute"></div>;
};