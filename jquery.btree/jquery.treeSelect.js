(function($) {

    // tree.hide
    // tree.show
    // tree.getSelected

    $.fn.treeSelect = function(options) {

        var $input = this;

        // 默认配置
        var _settings = {

            // value key of the TREE NODE, default: 'pid'
            valueKey: 'pid',

            // text of the OK_BUTTON
            okBtnText: "确定",

            // text of the CALCEL_BUTTON
            cancelBtnText: "取消",

            // Load tree data from server
            remote: {
                enable: false,    // default to disable
                url: null,
                type: "GET",
                dataType: "JSON"
            },

            // callback after click OK_BUTTON
            onOkClick: null,

            // callback after click CALCEL_BUTTON
            onCancelClick: null // Default to hide the panel
        };

        // For rendering the tree view
        function TreeView() {
        }

        function TreeDropdown(configuration) {

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

            var currentNode = null;

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
                    currentNode = null;
                })

                $tpfCancelBtn.on('click', function(e) {
                    treeddControl.hide();
                });

                $tpfOkBtn.on('click', function(e) {
                    e.preventDefault();

                    if (treeddControl.treeObj) {
                        // You have to select a node
                        if (currentNode == null) {
                            return false;
                        }

                        // Hide the TreeDropdwon panel
                        treeddControl.hide();

                        // Update display dom nodes
                        $tsInput.val(currentNode[_settings.valueKey])
                        $tsText.html(currentNode["text"])

                        // fire the OK_BUTTON click callback
                        if (_settings.callback.onOkClick) {
                            _settings.callback.onOkClick.apply(treeddControl, { node: currentNode })
                        }                   
                    } else {
                        // oh my god, it's too slow.
                        console.warn("Tree is not ready yet!");
                        return false;
                    }
                })
            }

            function showTreeddPanel() {
                $input.replaceWith($treeSelectbox);
                $('body').append($treeSelectPanel);
            }

            function buildTree() {
            }

            function init() {
                // 初始化配置
                mergeConfiguration()

                // 初始化面板(弹出面板控件，面板，树容器)
                initTDDContext();

                // 显示控件
                showTreeddPanel();

                // 初始化事件(弹出按钮点击事件，初始化取消按钮事件)
                setupEvents();

                // 加载数据，初始化树
                buildTree();
            }

            init();

            return this;
        }

        var treePanel = new TreeDropdown(options);
        return treePanel;
    }

})(jQuery);
