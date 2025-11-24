import { Visualisation } from "./visualisation.js";
import { WikiConnector } from "./wikiConnector.js";

const visulisation = new Visualisation();
new WikiConnector(visulisation.onWikiEvent);
