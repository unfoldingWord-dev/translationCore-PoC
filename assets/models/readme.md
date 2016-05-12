Models
====
Models hold the data and logic that will need to be rendered by the template.

Purpose
----
Purpose of a model is to hold the business logic and transform the data to be consumable by the template but called by the controller.
Most if not all data/logic belongs in the model.
Most if not all html/template belongs in the view.
Most if not all calls to the model are from the controller.

Notes
----
Models sometimes have template/html snippets that are used to create the html.
Most if not all of those template/html snippets should be moved into the template in loops and conditional statements and the data referenced from the template.