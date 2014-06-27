function Event(sender) {
    this._sender = sender;
    this._listeners = [];

    this.attach = function(listener) {
        this._listeners.push(listener);
    }

    this.notify = function(args) {
        var index;

        for (index = 0; index < this._listeners.length; index++) {
            this._listeners[index](this._sender, args);
        };
    }
}

function NodeModel(nodes) {
    this._nodes = nodes;
    this._selected = [];

    this.nodeAdded    = new Event(this);
    this.nodeRemoved  = new Event(this);
    this.nodeSelected = new Event(this);

    this.getItems = function() {
        return [].concat(this._nodes);
    }

    this.addNode = function() {
        this._nodes.push(node);
        this.nodeAdded.notify({node: node});
    }

    this.removeNode = function() {
        var index = this._nodes.indexOf(node);

        if (index != -1) {
            this._nodes.slice(index, 1);
        }

        this.nodeRemoved.notify({node: node})
    }
}

function NodeView(model, elements) {
    this._model = model;
    this._elements = elements;

    this.listModified = new Event(this);
    this.addButtonClicked = new Event(this);
    this.delButtonClicked = new Event(this);

    var _this = this;

    // 绑定模型监听器
    this._model.nodeAdded.attach(function(){
        _this.rebuildList();
    });

    this._model.nodeRemoved.attach(function(){
        _this.rebuildList();
    });


    // 将监听器绑定到 HTML 控件上
    this._elements.addButton.click(function(){
        _this.addButtonClicked.notify();
    })

    this._elements.delButton.click(function(){
        _this.delButtonClicked.notify();
    })

    // 因为没有多个策略，所以我们往往是省略了 Controller 这一部分
}

function NodeController(model, view){
    this._model = model;
    this._view  = view;

    var _this = this;

    this._view.addButtonClicked.attach(function(){
        _this.addNode();
    })

    this._view.delButtonClicked.attach(function(){
        _this.delNode();
    })

    this.addNode = function() {
        this._model.addNode("德玛西亚");
    }

    this.delNode = function() {
        var index;

        index = this._model.getSelectedIndex();

        if (index != -1) {
            this._model.removeNode(index)
        }
    }
}
