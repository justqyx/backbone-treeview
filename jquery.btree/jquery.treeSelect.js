(function($) {

    var HELPER = {
        CovertNodesToHTML: function (nodes, level, display) {
            var html = ''
              , basePL    = 15
              , currentPL = 0
              , ulCss     = ""

            if (level == 0) { // Root Node
                ulCss += "ui-simpletree simpletree-container";
            }

            var ulStyle = level == 0 || display ? "" : " style='display:none' ";

            // 计算该 ul 下的结点应该缩进缩少 px;
            currentPL = level * basePL;

            html += '<ul tabindex="0" class="' + ulCss + '" ' + ulStyle + '" _pl="' + currentPL + '">';

            for (var i = 0; i < nodes.length; i++) {
                var n = nodes[i];

                var spanCss = HELPER.GetSpanCss(n);

                html += '<li>';
                html += '<div _pid="' + n.pid + '" class="' + spanCss + ' " style="padding-left:' + currentPL +'px;">';

                html += HELPER.GetExpHTML(n);
                html += HELPER.GetIconHTML(n);
                html += HELPER.GetTitleHTML(n);

                html += '</div>';

                if (n.children && n.children.length > 0) {
                    html += HELPER.CovertNodesToHTML(n.children, level + 1, n.isExpanded);
                }

                html += '</li>';
            }

            html += '</ul>';
            return html;
        },

        GetExpHTML: function(node) {
            css = "simpletree-";

            if (node.children && node.children.length > 0) {
                css += "expander"
            } else {
                css += "empty"
            }

            return '<span class="'+ css +'"></span>';
        },

        GetSpanCss: function(node) {
            var css = "simpletree-node "

            if (node.liClass) {
                css += node.liClass
            }

            if (node.isActive) {
                css += " simpletree-node-active"
            }

            if (node.isExpanded) {
                css += " simpletree-node-on";
            }

            css += (node.isExpanded ? " simpletree-exp-e" : " simpletree-exp-c")

            return css;
        },

        GetIconHTML: function(node) {
            if (node.iconUrl) {
                return '<span class="simpletree-custom-icon"><img src="' + node.iconUrl + '"></span>';
            } else {
                return '<span class="simpletree-icon"></span>';
            }
        },

        GetTitleHTML: function(node) {
            var html = '';
            var tooltip = node.tooltip ? 'title="' + node.tooltip + '"' : "";

            var css = "simpletree-title";

            if (node.textCss) {
                css += (" " + node.textCss);
            }

            html += '<span ' + tooltip + ' class="' + css + '">';
            html += node.text;
            html += '</span>';

            return html;
        },

        FindNodeByPid: function(nodes, pid) {
            for(var i = 0; i < nodes.length; i++) {
                var node = nodes[i];

                if (node.pid == pid) {
                    return node;
                } else if (node.children && node.children.length > 0) {
                    var node_1 = HELPER.FindNodeByPid(node.children, pid);
                    if (node_1) {
                        return node_1;
                    }
                }
            }

            return null;
        },

        UnselectAll: function(nodes) {
            for (var i = 0; i < nodes.length; i++) {
                nodes[i].isActive = false
                if (nodes[i].children && nodes[i].children.length > 0) {
                    HELPER.UnselectAll(nodes[i].children);
                }
            };
        }
    }

    $.fn.treeSelect = function(options) {
        var $input = this;

        // Global
        // To store the data;
        var DB = {
            nodes: null,
            selectedNodeContext: null
        };

        // For rendering the tree
        function TreeView(treeViewConf) {
            var treeObj = this;

            this.$container = null;   // TreeView Container Context
            this.$el = null;          // TreeView Context

            var _settings = {
                renderTo: null,         // should be a jqContext
                dataUrl: null,  // Default to null;
                slidingTime: 100,       // Expand/Collapse children with 'slide'
            };

            this.getSelectedNode = function() {
                if (DB.selectedNodeContext) {
                    var pid = parseInt(DB.selectedNodeContext.attr("_pid"))
                    return HELPER.FindNodeByPid(pid);
                } else {
                    return null;
                }
            }

            this.selectNodeByPid = function(pid) {
                DB.selectedNodeContext = null;

                this.$el.find(".simpletree-node")
                    .each(function(el, index){
                        $node = $(el)
                        _pid = parseInt($node.attr("_pid"))
                        if (_pid == pid) {
                            DB.selectedNodeContext = $node;
                            $node.addClass("simpletree-node-active");
                        } else {
                            $node.removeClass("simpletree-node-active");
                        }
                    })
            }

            this.unselectAll = function() {
                DB.selectedNodeContext.removeClass("simpletree-node-active");
                DB.selectedNodeContext = null;
            }

            function buildTree() {
                if (treeObj.$el != null) {
                    treeObj.$el.empty();
                    treeObj.$el = null;
                }

                // Covert nodes to HTML
                treeObj.$el = $(HELPER.CovertNodesToHTML(DB.nodes, 0, true));

                // Append to treeview container
                treeObj.$container.empty();
                treeObj.$container.append(treeObj.$el);

                // Bind node events
                // Toggle the Node
                treeObj.$el.find(".simpletree-node").on('click', function(e){
                    var currentPid = null;

                    if (DB.selectedNodeContext) {
                        currentPid = parseInt(DB.selectedNodeContext.attr("_pid"));
                    }

                    var $this = $(this)
                      , pid   = parseInt($this.attr("_pid"));

                    if (currentPid && pid == currentPid) {
                        if ($this.hasClass("simpletree-exp-c")) {
                            $this.addClass("simpletree-exp-e");
                            $this.removeClass("simpletree-exp-c");
                            $this.siblings("ul").css("display", "block");
                        } else {
                            $this.addClass("simpletree-exp-c");
                            $this.removeClass("simpletree-exp-e");
                            $this.siblings("ul").css("display", "none");
                        }
                    } else {
                        if (DB.selectedNodeContext) {
                            DB.selectedNodeContext.removeClass("simpletree-node-active");
                        }
                        $this.addClass("simpletree-node-active");
                        DB.selectedNodeContext = $this;
                    }
                });
            }

            this.render = function() {
                if (_settings.data) {
                    DB.nodes = _settings.data;
                    buildTree();
                } else if (_settings.dataUrl) {
                    $.ajax({
                        url: _settings.dataUrl,
                        type: "GET",
                        dataType: "JSON",
                        success: function(data, textStauts, jqXHR) {
                            DB.nodes = data;
                            buildTree();
                        },
                        error: function(jqXHR, textStauts, errorThrown) {
                            console.dir(jqXHR);
                            alert("加载数据失败");
                        }
                    });
                } else {
                    console.warn("Tree without data!");
                }
            }

            $.extend(true, _settings, treeViewConf);

            if (_settings.renderTo) {
                treeObj.$container = _settings.renderTo;
            } else {
                alert("renderTo can't not be null.");
            }

            return this;
        }

        // The Tree SelectBox Obj
        function TreeDropdown(configuration) {
            var _settings = {
                // text of the OK_BUTTON
                okBtnText: "确定",

                // text of the CALCEL_BUTTON
                cancelBtnText: "取消",

                // callback after click OK_BUTTON
                onOkClick: null,

                // callback after click CALCEL_BUTTON
                onCancelClick: null,
                tree: {
                    data: null,    // Build tree with data
                    dataUrl: null  // IF data IS null THEN LOAD FROM SERVER
                }
            };

            /**************************************
            ** Public variables and methods
            ***************************************/
            this.treeObj = null;
            this.isActive = false;

            var treeddControl = this;

            var w = $input.width()
              , w1 = w - 20       // 去掉 tsText 的左右 padding 值
              , w2 = w - 20 - 15

            // 隐藏面板
            this.hide = function() {
                // the tree selectbox
                $tsText.css("width", w1);
                $treeSelectbox.removeClass("selectbox-on");

                // the tree selectbox panel
                $treeSelectPanel.css("display", "none");

                // the marker
                this.isActive = false;
            }

            // 显示面板
            this.show = function() {
                // the tree selectbox
                $tsText.css("width", w1);
                $tsEmpty.css("display", "none");
                $treeSelectbox.addClass("selectbox-on");

                // the tree selectbox panel
                var top  = $treeSelectbox.offset().top + 34;
                var left = $treeSelectbox.offset().left;
                $treeSelectPanel.css({top: top, left: left, display: 'inline-block'});

                // the marker
                this.isActive = true;
            }

            this.toggle = function() {
                if (this.isActive == true) {
                    this.hide();
                } else {
                    this.show();
                }
            }

            // 得到选中的树结点的数据
            this.getSelected = function() {
                if (this.treeObj) {
                    return this.treeObj.getSelectedNode();
                } else {
                    return null;
                }
            }

            /**************************************
            ** Private variables and methods
            ***************************************/

            var $treeSelectbox = null
              , $tsInput  = null
              , $tsChoice = null
              , $tsText   = null
              , $tsEmpty  = null

            var $treeSelectPanel  = null
              , $treeSelectBody   = null
              , $treeSelectFooter = null

            // Private methods
            function mergeConfiguration() {
                // merge recursively
                $.extend(true, _settings, configuration);
            }

            function initTDDContext() {
                /* Tree Selectbox */
                $treeSelectbox = $('<div class="tree-selectbox"></div>')

                $tsInput  = $input.clone()

                $tsChoice = $('<div class="ts-choice"></div>')
                $tsText   = $('<span class="ts-text"></span>')
                $tsEmpty  = $('<span class="ts-empty">x</span>')

                $tsChoice.append($tsText)
                $tsChoice.append($tsEmpty)

                $treeSelectbox.append($tsInput)
                $treeSelectbox.append($tsChoice)

                /* Tree Selectbox Panel */
                $treeSelectPanel = $('<div class="tree-selectbox-panel"></div>')

                $tpBody   = $('<div class="tp-body"></div>')

                // Footer
                $tpFooter     = $('<div class="tp-footer"></div>')
                $tpfOkBtn     = $('<a href="javascript:void(0);">' + _settings.okBtnText + '</a>')
                $tpfCancelBtn = $('<a href="javascript:void(0);">' + _settings.cancelBtnText +'</a>')

                $tpFooter.append($tpfOkBtn)
                $tpFooter.append($tpfCancelBtn)

                $treeSelectPanel.append($tpBody)
                $treeSelectPanel.append($tpFooter)

                /* Init Style */
                $tsInput.css("display", "none");

                // Two control
                $treeSelectbox.css("width", w);
                $treeSelectPanel.css("width", w);

                // The text
                $tsText.css("width", w1);
            }

            function setupEvents() {
                $tsChoice.on('click', function(e) {
                    e.preventDefault();
                    treeddControl.toggle();
                })

                $tsEmpty.on('click', function(e) {
                    $tddInput.val('')
                    treeddControl.treeObj.unselectAll();
                })

                $tpfCancelBtn.on('click', function(e) {
                    treeddControl.hide();
                });

                $tpfOkBtn.on('click', function(e) {
                    e.preventDefault();

                    if (treeddControl.treeObj) {
                        var node = treeddControl.treeObj.getSelectedNode();

                        // Hide the TreeDropdwon panel
                        treeddControl.hide();

                        // Update display dom nodes
                        $tsInput.val(node["pid"])
                        $tsText.html(node["text"])

                        // fire the OK_BUTTON click callback
                        if (_settings.callback.onOkClick) {
                            _settings.callback.onOkClick.apply(treeddControl, { node: node })
                        }                   
                    } else {
                        // oh my god, it's too slow.
                        console.warn("Tree is not ready yet!");
                        treeObj.$container.html("No data!");
                        return false;
                    }
                })
            }

            function showTreeddPanel() {
                $input.replaceWith($treeSelectbox);
                $('body').append($treeSelectPanel);
            }

            function buildTree() {
                var tvConfig = _settings.tree;

                // Init the TreeView Container
                tvConfig.renderTo = $tpBody;

                treeddControl.treeObj = new TreeView(tvConfig);
                treeddControl.treeObj.render();
            }

            mergeConfiguration();   // 初始化配置
            initTDDContext();       // 初始化面板(弹出面板控件，面板，树容器)
            showTreeddPanel();      // 显示控件
            setupEvents();          // 初始化事件(弹出按钮点击事件，初始化取消按钮事件)
            buildTree();            // 加载数据，初始化树

            return this;
        }

        var treePanel = new TreeDropdown(options);
        return treePanel;
    }

})(jQuery);
