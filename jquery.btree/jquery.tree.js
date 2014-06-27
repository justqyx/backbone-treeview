/*

[Node]
负责维护结点的数据

[NodeView]
负责维护结点
  单击事件
  双击事件
  右键事件
启用编辑模式
更新结点数据，并支持回调事件

[TreeView]
渲染树和重新渲染功能
支持结点搜索功能
支持定位某个结点

*/

(function($) {

    // Node model
    function Node(attrs) {
        var default = {
            isFolder: false
        }

        this.init = function(attrs) {
        }

        this.init();

        if (this.initializer) { this.initializer(); }

        return this;
    }

    // Node view
    function NodeView() {
        this._model = null;

        this.hasChildren = function() {
            return false;
        }

        this.toggle = function(expandOrCollapse) {
            if (expandOrCollapse == 'open') {
                // code here
            } else if (expandOrCollapse == 'close') {
                // code here
            } else {
                return false;
            }
        }

        this.expand = function() {
            this.toggle('open')
        }

        this.collapse = function() {
            this.toggle('close')
        }

        this.addChild = function(nodeModel) {
        }

        this.removeChild = function(nodeModel) {
        }

        // Remove self (allow even if children?)
        this.remove = function() {
        }
    }

    function SimpleTree(jqContext, options) {

        var DEFAULT_OPTIONS = {

            data: null,

            // 数据从本地加载
            simpleData: {
                enable: false
            },

            // 数据从远程加载
            remote: {
                enable: false,
                url: null,
                type: 'GET',
                dataType: 'JSON',
            },

            // Expand or Collapse 结点的动画时间
            slidingTime: 100,

            calback: {

                // after click node
                onclick: null,

                // after dblclick node
                ondblclick: null,

                // after toggle node
                ontoggle: null,
            }
        }

        // do some init work
        function init(jqContext, options) {
        }

        this.render = function() {
        }

        this.reRender = function(data) {
        }

        this.expandAll = function() {
        }

        this.collapseAll = function() {
        }

        init();

        return this;
    }

    $.fn.simpletree = function(options) {
        var jqContext = this
        , treeObj = new SimpleTree(jqContext, options);

        return treeObj;
    }

});
