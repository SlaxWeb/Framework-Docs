.. SlaxWeb Framework Database - Base Model file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. highlight:: php

.. _database basemodel:

Base Model
==========

The Base Model provides simple functions to interface with the database. To provide
this functionality it depends on other components and libraries that are either
the part of the core, or installed along with the component or its subcomponent.

Using the Base Model
--------------------

To use the Base Model, write your Model class and extend it from **\\SlaxWeb\\Database\\BaseModel**::

    <?php
    namespace App\Model;

    class MyModel extends \SlaxWeb\Database\BaseModel
    {
    }

The Base Model requires the following objects at construction time in that order:

* Logger - :ref:`gen topics logger`
* Config - :ref:`gen topics config`
* Inflector - `ICanBoogie Inflector Library <https://github.com/ICanBoogie/Inflector>`_
* Database Library

.. TODO: add link to the class documentation of the Database Library interface
   in the above line

The **Database Library** is available as a service under the name **databaseLibrary.service**
in the :ref:`gen topics application`, to obtain other objects, please refer to their
own documentations.

Using the loader
----------------

To make loading of models as simple as possible, a model loader is provided with
the **database** component. The loader is available as a service, and can be obtained
with the name **loadDBModel.service**. The loader service is called as a function
as it requires the name of the model as input::

    <?php
    // ... Route definition:
    $application["loadDBModel.service"]("MyModel");

The loader will obtain all required dependencies and automatically inject them into
the model supplied as the first argument in the loader call as presented above.

Customizing the **__constructor** is therefore not recommended, if you require any
custom initialisation, then you can implement an **init** method in your model.
Any further parameters you supply while calling the loader, will be injected into
the **init** method call.

Setting the table name
----------------------

A model should access only a single table in the database, and thus it should be
written for only that table. You can set the table name which the model accesses
with the **$table** class property.

If the **autoTable** configuration option is set to **true** in the **database.php**
configuration file, then the Base Model will set the table name automatically by
removing the namespace from the full class name, and using only the class name as
the name of the table.

If the **pluralizeTableName** configuration option is set to **true**, then the
class name will be pluralized.

Furthermore if the **tableNameStyle** configuration option is set to the correct
value, the pluralized class name will be converted to that style. For more information
please refer to the :ref:`database config tablestyle` documentation.

Accessing the Database
----------------------

The Base Model provides the :ref:`database querybuilder` methods to simplify query
generation and execution, and to access the database this way. The Query Builder
provides the **create**, **update**, **delete**, and **select** methods to create
and execute queries, as well as methods to build simple or complicated **where**
statements, join with other models, and much more. For more detail please refer
to the :ref:`database querybuilder` documentation.

Executing queries
`````````````````

.. TODO: Link Database Library to the class documentation of the Library interface,
   same as above.

The Base Model also provides a way to access the database more directly, through
the Database Library directly, and without the Query Builder. The Database Library
is available in the Base Models **$db** protected property. For more detail on executing
queries with the **database** component, refer to the :ref:`database execqueries`
documentation.

Callback hooks
--------------

The Base Model executes a number of callbacks through the Hooks system. Before a
Base Model method is executed a so called *before* hook is executed, and after the
method has finished executing an so called *after* hook is executed. By the default
the Hook name is constructed of the word **model**, the base class name of the model,
the type of callback, **before** or **after**, and the models method. Example::

    <?php
    namespace App\Model

    class MyModel extends \SlaxWeb\Database\BaseModel
    {
    }

When calling the **select** method on the above model, the following hooks would
be executed:

* **model.mymodel.before.select** - Before the method is executed
* **model.mymodel.after.select** - After the method finished execution

.. NOTE::
   The callbacks are executed only on the following functions: **__construct** (named **init**),
   **create**, **select**, **update**, and **delete**. Other methods like *where*
   etc. do not execute callbacks.

Custom model name
`````````````````

The second part of the full hook name is populated by the models base name, but
it can be overridden. To replace the model name with a custom value, it needs to
be set in the **$hookName** protected property of the model. Example::

    <?php
    namespace App\Model

    class MyModel extends \SlaxWeb\Database\BaseModel
    {
        protected $hookName = "overridenHook";
    }

When calling the **select** method on the above model, the following hooks would
be executed:

* **model.overridenHook.before.select** - Before the method is executed
* **model.overridenHook.after.select** - After the method finished execution
