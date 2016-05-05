Controllers
====
Light weight controllers are used to render the template and provide the necessary models to the template.

Purpose
----
Purpose of a controller is to be light weight and only call the models necessary to render the view.
Most if not all data/logic belongs in the model.
Most if not all html/template belongs in the view.
Most if not all calls to the model are from the controller.

Notes
----
Controllers sometimes have helpers that transform data necessary to the template.
Most of those helpers can be moved into the model and called to store the data in an instance of the model, even if a new model has to be created.