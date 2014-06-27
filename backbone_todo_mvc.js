var Todo = Backbone.Model.extend({
    defaults: function() {
        return {
            title: 'Empty todo ...',
            order: Todos.nextOrder(),
            done: false
        }
    },

    toggle: function() {
        this.save({done: !this.get('done')});
    }
});

var TodoView = Backbone.View.extend({
    tagName: "li",

    template: _.template($("#item-template")).html(),

    events: {
        "click .toggle"   : "toggleDone",
        "dbclick .view"   : "edit",
        "click a.destroy" : "clear",
        "keypress .edit"  : "updateOnEnter",
        "blur .edit"      : "close"
    },

    initialize: function() {
        this.listenTo(this.model, "change", this.render);
        this.listenTo(this.model, "destroy", this.remove);
    },

    render: function() {
        this.$el.html( this.template(this.model.toJSON()) )

        this.$el.toggleClass('done', this.model.get('done'))

        this.input = this.$('.edit')


        return this;
    },

    toggleDone: function() {
        this.model.toggle();
    },

    edit: function() {
        this.$el.addClass('edit')
        this.input.focus()
    },

    close: function() {
        var value = this.input.val();
        if (!value) {
            this.clear();
        } else {
            this.model.save({title: value});
            this.$el.removeClass("editing");
        }
    },

    updateOnEnter: function() {
        if (e.keyCode == 13) {
            this.close();
        }
    },

    clear: function() {
        this.model.destroy();
    }

});

// Todo List, to store todos
var TodoList = Backbone.Collection.extend({
    model: Todo,

    localStorage: new Backbone.LocalStorage("todos-backbone"),

    done: function() {
        return this.where(done: true)
    },

    remaining: function() {
        return this.without.apply(this, this.done());
    },

    nextOrder: function() {
        if (!this.length) {
            return 1;
        } else {
            return this.last().get('order') + 1;
        }
    },

    comparator: 'order'
});

// ============
var Todos = new TodoList;

var AppView = Backbone.view.extend({
    // The view, jqueryContext
    el: $("#todoapp"),

    statsTemplate: _.template($("#stats-template").html()),

    events: {
        "keypress #new-todo"     : "createOnEnter",
        "click #clear-complated" : "clearComplated",
        "click #toggle-all"      : "toggleAllComplate"
    },

    initialize: function() {
        // 输入框
        this.$input = this.$("#new-todo");

        // 按钮
        this.$allCheckbox = this.$("#toggle-all")[0];

        this.listenTo(Todos, 'add', this.addOne);
        this.listenTo(Todos, 'reset', this.addAll);
        this.listenTo(Todos, 'all', this.render);

        this.footer = this.$('footer');
        this.main   = $("#main");

        Todos.fetch();
    },

    render: function() {
        var done = Todos.done().length;
        var remaining = Todos.remaining.length;


        if (Todos.length) {
            this.main.show();
            this.footer.show();
            this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
        } else {
            this.main.hide();
            this.footer.hide();
        }
    },

    addOne: function(todo) {
        var view = new TodoView({model: todo});
        this.$("#todo-list").append(view.render().el);
    },

    addAll: function() {
        Todos.each(this.addOne, this);
    },

    createOnEnter: function() {
        if (e.keyCode != 13) return;
        if (!this.input.val()) return;

        Todos.create({title: this.$input.val()})
        this.$input.val('');
    },

    clearComplated: function() {
        _.invoke(Todos.done(), 'destroy');
        return false;
    },

    toggleAllComplate: function() {
        var done = this.allCheckbox.checked;
        Todos.each(function(todo) {
            todo.save({'done': done});
        })
    }
});

