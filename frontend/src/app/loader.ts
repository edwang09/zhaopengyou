import * as PIXI from "pixi.js";
// import background from "../assets/images/background.png";
// // import * as avatar from "../assets/images/avatar.json";
// // import button from "../assets/images/button.json";
// // import arrow from "../assets/images/arrow.json";
// import modalTall from "../assets/images/modal-tall.png";
// import modalWide from "../assets/images/modal-wide.png";

export class Loader {
  _callback: () => void;
  _assetLoader: PIXI.Loader;
  public resources: PIXI.IResourceDictionary;
  constructor() {
    this._callback = null;
    this._assetLoader = PIXI.Loader.shared;
    this._assetLoader.baseUrl="assets"
    this._assetLoader.add("background", "background.png");
    this._assetLoader.add("modal-tall", "modal-tall.png");
    this._assetLoader.add("modal-wide", "modal-wide.png");
    this._assetLoader.add("star", "star.png");
    this._assetLoader.add("tag", "tag.png");
    this._assetLoader.add("field", "field.png");
    this._assetLoader.add("avatar", "avatar.json");
    this._assetLoader.add("button", "button.json");
    this._assetLoader.add("arrow", "arrow.json");
    this._assetLoader.add("card", "card.json");
    this._assetLoader.add("icon", "icon.json");
    this._assetLoader.onComplete.add(this._onImagesLoad.bind(this));
    this.resources = this._assetLoader.resources;
  }
  load(callback: () => void): void {
    this._callback = callback;
    this._assetLoader.load();
  }
  _onImagesLoad(): void {
    this._callback();
  }
}
