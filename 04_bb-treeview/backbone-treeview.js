(function($){

    /* Single node object in tree */
    var TreeNodeModel = Backbone.Model.extend({
        defaults: {
            hasChild: null,
            text: 'Node',
            children: [],   // Children are represented as ids not objects
        },

        /* Return a suitable label for the Node
         * override this function to better serve the view
         */
        getLabel: function() {
            return this.get('text');
        },

        hasChild: function() {
            if (this.get('hasChild') == null) {
                var hasChild = this.get('children').length > 0;
                this.set('hasChild', hasChild);
                return hasChild;
            } else {
                return this.get('hasChild');
            }
        },

        /* Return an array of actual TreeNodeModel instances
         * override this function depending on how children are store
         */
        getChildren: function() {
            return this.get('children');
        },
    });

    /* Tree view is attached to a single node (root) and built automatically */
    var TreeNodeView = Backbone.View.extend({
        tagName: 'li',

        /* 结点 HTML 模板 */
        template: ' \
            <div class="treeview-node" style="padding-left:<%= pl %>px;"> \
                <span class="treeview-node-handler"> \
                    <em class="b-in-blk plus"></em> \
                    <dfn class="b-in-blk folder"></dfn> \
                    <span class="treeview-node-txt"><%= text %></span> \
                </span> \
            </div> \
            <ul class="treeview treeview-collapse"></ul>',

        /* 子结点 slideUp 和 slideDown 的速度 */
        collapseSpeed: 50,

        /* 结点默认是关闭状态 */
        collapsed: true,

        initialize: function() {
            /* pl 指结点的 padding-left 值 */
            this.model = this.options.model;
            this.pl    = this.options.pl || 0;
        },

        setupEvents: function() {
            // Hack to get around event delegation not supporting ">" selector
            var that = this;
            this.$('> .treeview-node').click(function() {
                if (that.model.hasChild()) {
                    return that.toggleCollapse();
                } else {
                    return false;
                }
            });
        },

        toggleCollapse: function() {
            this.collapsed = !this.collapsed;
            if (this.collapsed) {
                this.$('> .treeview-node').removeClass("treeview-node-on");
                this.$('> .treeview').slideUp(this.collapseSpeed);
            } else {
                this.$('> .treeview-node').addClass("treeview-node-on");
                this.$('> .treeview').slideDown(this.collapseSpeed);
            }
        },

        render: function() {
            // Load HTML template and setup events
            var pl = this.pl,
                text = this.model.get('text');

            this.$el.html(_.template(this.template, { pl: pl, text: text }));
            this.setupEvents();

            var $childNodesContainer = this.$('> .treeview')
                , childNodeModel = null
                , childNodeView  = null;

            if (this.model.hasChild()) {
                _.each(this.model.getChildren(), function(childNode) {
                    childNodeModel = new TreeNodeModel(childNode),
                    childNodeView  = new TreeNodeView({model: childNodeModel, pl: pl + 15})

                    $childNodesContainer.append(childNodeView.$el);
                    childNodeView.render();
                });
            } else {
                this.$('> .treeview-node').addClass('treenode-empty');
            }

            return this;
        },
    });

    /* Tree View */
    window.TreeView = Backbone.View.extend({
        // $el 是树的容器, 一般为 DIV

        initialize: function() {
            var $container = $('<ul class="treeview"></ul>');

            this.nodes = this.options.data || [];
            this.$el.append($container);

            _.each(this.nodes, function(nodeData) {
                var node = new TreeNodeModel(nodeData)
                    , nodeView = new TreeNodeView({model: node, pl: 0});

                $container.append(nodeView.$el);
                nodeView.render();
            });
        }
    });

})(jQuery);
