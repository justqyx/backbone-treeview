addNode = function(node, target) {}
delNode = function(node) {}
selectNode = function(node) {}
unselectNode = function(node) {}
expandNode = function(node) {}
collapseNode = function(node) {}

function Event(sender) {
    this._sender    = sender;
    this._listeners = [];

    // 订阅事件
    this.attach = function(listener) {
        this._listeners.push(listener)
    }

    // 通知事件被激活
    this.notify = function(args) {
        var index;

        for (index = 0; index < this._listeners.length; index++) {
            this._listeners[index](this._sender, args)
        }
    }
}

var NodeModel = function() {
    this._nodes = node;
    this._selected = [];

    this.selecteNodeEvent = new Event(this);

    this.selectNode = function(node) {
        this._selected.push(node.id);
    }
}

var TreeView = function() {

    this.nodeClick   = new Event(this);
    this.nodeDbClick = new Event(this);

    // init events
    this.$('.tree-node').on('click', function(e) {
        var $node = $(e.target);

        // 通知订阅 [结点的点击事件] 的 callback
        this.nodeClick.notify({node: $node})
    })
}

var TreeController = function(options) {

    this._nodes = new NodeModel();
    this._view  = new TreeView();

    // 订阅视图的 [nodeClick] 事件
    this._view.nodeClick.attach(function() {
        _this.nodes.selectNode(this)
    })
}
