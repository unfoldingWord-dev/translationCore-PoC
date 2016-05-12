Views
====
Views/Templates are used to render the html content from the provided data in the models sent via the controller.

Purpose
----
Purpose of a view is to be hold the template html and reference attributes of the model sent from the controller.
Most if not all data/logic belongs in the model.
Most if not all html/template belongs in the view.
Most if not all calls to the model are from the controller.

Notes
----
Views sometimes have logic in them that transform data necessary to render.
Most if not all of that logic can be moved into the model and called to store the data in an instance of the model, even if a new model has to be created.
The exceptions are typically conditionals and loops.