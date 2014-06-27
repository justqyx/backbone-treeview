function NodeModel() {

}

function NodeCollection() {
  this._nodes = [];
}

function NodeView() {
  this._model = new NodeModel();

  this.addChild = function() {

  }
}

function TreeView(data, options) {

  this._nodeCollection = new NodeCollection(data);

  // 初始化配置
    // 1. 将自定义配置和默认配置合并
    // 2. 

  // 建立树
    // 1. 递归地渲染树

  // DOM 事件绑定
    // 1. 结点单击事件
    // 2. 结点双击事件
    // 3. 结点拖动事件

  this.initOptions = function(options) {
  }

  this.buildTree = function() {
  }

}
