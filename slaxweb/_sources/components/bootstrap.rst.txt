.. SlaxWeb Framework Bootstrap component documentation file, created by
   Tomaz Lovrec <tomaz.lovrec@gmail.com>

.. highlight:: php

.. _bootstrap component:

Bootstrap Component
===================

Bootstrap is the main component of the Framework, and it extends the `Pimple Dependency
Injection Container <http://pimple.sensiolabs.org/>` (DIC from now on). The Bootstrap
is responsible for starting the user application, with the help of the :ref:`Router
component`, and providing a DIC, it is also responsible for instantiating all other
components, and exposing them to the DIC through their providers. It loads user
defined providers, routes, user hook definitions, and most importantly, the configuration
files.

Application
-----------

The Boobstrap components provides the **\\SlaxWeb\\Bootstrap\\Application** class
that is extending the *Pimple DIC*. The *Application* object is also injected into
all Route definitions actions, and Hook definitions. Through the *Application* object
all other services can be accessed and obtained, and new services and providers
can be registered with it.

The Application class implements `The ArrayAccess <http://php.net/manual/en/class.arrayaccess.php>`
and thus the Application class can be used as an Array when dealing with services
or Application parameters. For more detailed information on this, please read the
`Pimple Documentation <http://pimple.sensiolabs.org/>`.

Hooks
`````

The application executes the following Hooks at various points of execution. Some
supply the Hook definition with a parameter, and some use the return value. Check
the description of a hook to find out more:

+----------------------------------+-------------------------------+--------+--------------------------------------------------------+
| name                             | parameters                    | return | description                                            |
+==================================+===============================+========+========================================================+
| application.init.after           | none                          | none   | | Executed afther the *init* method of the Application |
|                                  |                               |        | | class has finished executing, and all the Hook       |
|                                  |                               |        | | definitions, routes have been loaded, and all other  |
|                                  |                               |        | | service providers have been registered.              |
+----------------------------------+-------------------------------+--------+--------------------------------------------------------+
| application.dispatch.before      | | \\SlaxWeb\\Router\\Request  | string | | Executed before the Dispatcher of Router Component   |
|                                  | | \\SlaxWeb\\Router\\Response |        | | Dispatcher *dispatch* method is called. The Hook     |
|                                  |                               |        | | definition retrieves the Request and Response        |
|                                  |                               |        | | objects. If it returns a string value of "exit", the |
|                                  |                               |        | | Application class will stop further execution, and   |
|                                  |                               |        | | will not call the *dispatch* method of the Routers   |
|                                  |                               |        | | Dispatcher class.                                    |
+----------------------------------+-------------------------------+--------+--------------------------------------------------------+
| application.dispatch.after       | none                          | none   | | Executed after the Router components                 |
|                                  |                               |        | | *Dispatcher::dispatch* has finished executing.       |
+----------------------------------+-------------------------------+--------+--------------------------------------------------------+

Registering Additional Providers
--------------------------------

The Application class inspects the configuration to determine if it should register
any other providers. The configuration may provide a full list of classes that must
be registered as providers, but the Application does not take care of loading those
classes. They need to be loaded before or an autoloader must be provided, such as
the composer autoloader. Along with Providers, the Application class will also check
if it must load any Hook Definition Providers, as well as Route Collection Providers,
in that order.

Configuration options and their data types:

* **application.provider.register** - boolean
* **application.providerList** - array
* **application.hooks.load** - boolean
* **application.hooksList** - array
* **application.routes.load** - boolean
* **application.routesList** - array

Class reference
---------------

Class reference for the Bootstrap Component is available in an external documentation.
Click `here <bootstrap/classref/index.html>`_ to go to that documentation now.
