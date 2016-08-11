import { PAGE_IDS } from '../consts';


// [uiEventName]: [logicName:string, curriedLogicArgs:array?]
const routes = {
  SHOW_FIRST_VIEW: ['changePage', [PAGE_IDS.WELCOME]],
  TOUCH_START: ['changePage', [PAGE_IDS.CANVAS]],
};


const UI_EVENT_NAMES = {};
Object.keys(routes).forEach(eventName => UI_EVENT_NAMES[eventName] = eventName);


export default routes;
export { UI_EVENT_NAMES };
