import MathJaxPlugin from './mathjax';
import RibbonPlugin from './ribbon/RibbonPlugin';
export default class PluginManage {
  constructor() {
    this.plugins = null;
  }
  dispose() {
    this.plugins = null;
  }
  getPlugins() {
    if (!this.plugins) {
      this.plugins = {
        ribbon: new RibbonPlugin(),
        mathjax: new MathJaxPlugin()
      };
    }
    return this.plugins;
  }
  getAllPluginArray() {
    let allPlugins = this.getPlugins();
    return [
      allPlugins.ribbon,
      allPlugins.mathjax
    ];
  }
}