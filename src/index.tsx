/* @refresh reload */
import { render } from 'solid-js/web';

import './index.css';
import 'virtual:windi.css'
import {Ruler} from './Ruler'
import {Input} from "./Input"
import {Notification} from "./Notification"

const ruler = document.getElementById("ruler")
const input = document.getElementById("input")
const notification = document.getElementById("notification")


render(() => <Ruler />, ruler!);
render(() => <Notification />, notification!);
//alert("maybe you should adjust your screen for better workflow")
// render(() => <Input />, input!);

