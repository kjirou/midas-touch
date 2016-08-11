import { PAGE_IDS } from '../../consts';
import CanvasPage from './CanvasPage';
import WelcomePage from './WelcomePage';


const pages = {
  [PAGE_IDS.CANVAS]: CanvasPage,
  [PAGE_IDS.WELCOME]: WelcomePage,
};


export default pages;
