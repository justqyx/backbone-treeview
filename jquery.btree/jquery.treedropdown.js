(function($) {

    // tree.hide
    // tree.show
    // tree.getSelected

    $.fn.treeDropdown = function(options) {

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
            var emptyBtnWidth = 15;

            // 隐藏面板
            this.hide = function() {
                $tddText.css("width", w - emptyBtnWidth);
                $treeContainer.removeClass("treedd-container-on");
                this.isActive = false;
            }

            // 显示面板
            this.show = function() {
                $tddText.css("width", w);
                $tddEmpty.css("display", "none");
                $treeContainer.addClass("treedd-container-on");
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

            var $treeContainer = null
              , $tddChoice = null
              , $tddText   = null
              , $tddEmpty  = null
              , $tddArrow  = null
              , $tddBody   = null;

            var currentNode = null;

            // Private methods
            function mergeConfiguration() {
                // merge recursively
                $.extend(true, _settings, configuration);
            }

            function initTDDContext() {
                $treeContainer = $('<div class="treedd-container"></div>')

                // Form Input Control
                $tddInput  = $input.clone()

                // Choice
                $tddChoice = $('<div class="treedd-choice"></div>')
                $tddText   = $('<span class="treedd-text"></span>')
                $tddEmpty  = $('<span class="treedd-empty">x</span>')

                $tddChoice.append($tddText)
                $tddChoice.append($tddEmpty)

                // Body
                $tddBody   = $('<div class="tdd-body"></div>')

                // Footer
                $tddFooter    = $('<div class="tdd-footer"></div>')
                $tddOkBtn     = $('<a href="javascript:void(0);">' + _settings.okBtnText + '</a>')
                $tddCancelBtn = $('<a href="javascript:void(0);">' + _settings.cancelBtnText +'</a>')

                $tddFooter.append($tddOkBtn)
                $tddFooter.append($tddCancelBtn)

                // 九九归一
                $treeContainer.append($tddInput)
                $treeContainer.append($tddChoice)
                $treeContainer.append($tddBody)
                $treeContainer.append($tddFooter)


                // Init Style
                $tddInput.css("display", "none");
                $treeContainer.css("width", w);
                $tddText.css("width", w - emptyBtnWidth);
            }

            function setupEvents() {
                $tddChoice.on('click', function(e) {
                    e.preventDefault();
                    treeddControl.toggle();
                })

                $tddEmpty.on('click', function(e) {
                    $tddInput.val('')
                    currentNode = null;

                    // fire the CANCEL_BUTTON click callback
                    // if (_settings.callback.onCancelClick != null) {
                    //     _settings.callback.onCancelClick.apply(treeddControl, {});
                    // }
                })

                $tddCancelBtn.on('click', function(e) {
                    treeddControl.hide();
                });

                $tddOkBtn.on('click', function(e) {
                    e.preventDefault();

                    if (treeddControl.treeObj) {
                        // You have to select a node
                        if (currentNode == null) {
                            return false;
                        }

                        // Hide the TreeDropdwon panel
                        treeddControl.hide();

                        // Update display dom nodes
                        $tddInput.val(currentNode[_settings.valueKey])
                        $tddText.html(currentNode["text"])

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
                $input.replaceWith($treeContainer);
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
