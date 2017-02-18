.. SlaxWeb Framework General Topics - Models file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. highlight:: php

.. _gen topics model:

Models
======

Models are PHP classes that are designed to work with information be it from the
database or any other source. Models should contain all of the applications business
logic, and should never output anything on their own.

Base Model
----------

Base Models provide simple functionality to interface with the data sources, such
as database, RESTful API services, SOAP services, and more. They are available in
their respective components, which you must install with the :ref:`gen topics slaxer`_
command line tool.

The following components provide Base Models:

* **database** - for interfacing with a :ref:`database`
* **rest** - for interfacing with a RESTful API services
* **soap** - for interfacing with SOAP enabled services

.. ATTENTION::
   Right now only the **database** component is available. **rest** and **soap**
   components are planned for future releases!

Writing a Model
---------------

A Model is a simple PHP class that extends from a Base Model. In the bellow examples
the Database Base Model will be used, but may be replaced with any other Base Model.
If you wish to skip the use of a Base Model, you may do so, and take care of everything
required yourself.

.. NOTE::
   This part of the documentation will not cover functionality for interfacing with
   a data source as a Database, RESTful API, or SOAP enabled services. For this
   please reffer to the correct parts of the documentation.

::

    <?php
    namespace App\Model;

    use SlaxWeb\Database\BaseModel;

    class MyModel extends BaseModel
    {
    }

Since our example model extends from **\\SlaxWeb\\Database\\BaseModel** parent class,
it automatically provides database functionality through the **database** component.

In the model you can write methods and properties just as in any other class, and
use its Base Model functionality.

Loader
------

Each component that provides a Base Model also provides a loader for the models.
These loaders construct the classes and inject required dependencies into them.
Because of this, it is recommended that you do not use the **__constructor** method
and let the Base Model.

Instead of the **__constructor** method, you can use the **init** public method
that gets executed by the Loader when instantiating the Model. The Loader will pass
any additional parameters received into the **init** method. In the example bellow
the database model loader is used::

    <?php
    // ... Route definition:
    $application["loadDBModel.service"]("MyModel", "param1");

    // ... MyModel class:
    public function init(string $param)
    {
    }
